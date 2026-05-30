const db = require("../../models");
const { Op } = require("sequelize");

const ExportOrder = db.ExportOrder;
const ExportOrderDetail = db.ExportOrderDetail;
const InventoryLog = db.InventoryLog;
const Equipment = db.Equipment;

const generateExportCode = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EXP-${yyyy}${mm}${dd}-${random}`;
};

const validateExportItems = async (detailList, transaction) => {
  const validDetails = [];

  for (const item of detailList) {
    if (!item.equipment_id) {
      throw new Error("Thiếu equipment_id trong chi tiết xuất kho");
    }

    const equipment = await Equipment.findByPk(item.equipment_id, {
      transaction,
    });
    if (!equipment) {
      throw new Error(`Thiếu thiết bị với id ${item.equipment_id}`);
    }

    const quantity = Number(item.quantity || 0);
    if (quantity <= 0) {
      throw new Error("Số lượng xuất phải lớn hơn 0");
    }

    validDetails.push({
      equipment,
      quantity,
    });
  }

  return validDetails;
};

const verifyExportOrderOwnership = (order, user) => {
  if (!order) {
    throw new Error("Export order not found");
  }

  if (order.status !== "pending") {
    throw new Error("Chỉ có thể cập nhật đơn đang ở trạng thái pending");
  }

  if (user?.role === "admin") {
    return;
  }

  if (String(order.created_by) !== String(user?.id)) {
    throw new Error("Bạn không có quyền cập nhật đơn hàng này");
  }
};

const createExportOrder = async (exportOrderData, userId) => {
  try {
    const { details, ...orderData } = exportOrderData;
    const payload = {
      ...orderData,
      code: exportOrderData?.code || generateExportCode(),
      created_by: userId || null,
      status: "pending",
    };

    const result = await db.sequelize.transaction(async (transaction) => {
      const exportOrder = await ExportOrder.create(payload, { transaction });

      const detailList = Array.isArray(details) ? details : [];
      if (detailList.length === 0) {
        throw new Error("Chi tiết đơn xuất không được để trống");
      }

      await validateExportItems(detailList, transaction);

      for (const item of detailList) {
        await ExportOrderDetail.create(
          {
            export_order_id: exportOrder.id,
            equipment_id: item.equipment_id,
            quantity: item.quantity,
          },
          { transaction },
        );
      }

      return exportOrder;
    });

    return result;
  } catch (error) {
    throw new Error("Error creating export order: " + error.message);
  }
};

const applyExportOrder = async (exportOrder, approverId, transaction) => {
  const details = await ExportOrderDetail.findAll({
    where: { export_order_id: exportOrder.id },
    transaction,
  });

  if (!details.length) {
    throw new Error("Không có chi tiết đơn xuất để duyệt");
  }

  for (const item of details) {
    const equipment = await Equipment.findByPk(item.equipment_id, {
      transaction,
    });
    if (!equipment) {
      throw new Error(`Thiếu thiết bị với id ${item.equipment_id}`);
    }

    const quantityBefore = Number(equipment.quantity || 0);
    const quantity = Number(item.quantity);
    if (quantityBefore < quantity) {
      throw new Error(
        `Không đủ số lượng tồn kho cho thiết bị ${equipment.name || item.equipment_id}`,
      );
    }

    const quantityAfter = quantityBefore - quantity;

    await equipment.update({ quantity: quantityAfter }, { transaction });

    await InventoryLog.create(
      {
        equipment_id: item.equipment_id,
        action_type: "export",
        quantity_before: quantityBefore,
        quantity_changed: -quantity,
        quantity_after: quantityAfter,
        reference_code: exportOrder.code,
        created_by: approverId || exportOrder.created_by || null,
      },
      { transaction },
    );
  }
};

const approveExportOrder = async (id, approverId) => {
  try {
    const result = await db.sequelize.transaction(async (transaction) => {
      const exportOrder = await ExportOrder.findByPk(id, {
        include: [{ model: db.ExportOrderDetail, as: "details" }],
        transaction,
      });

      if (!exportOrder) {
        throw new Error("Export order not found");
      }

      if (exportOrder.status !== "pending") {
        throw new Error("Chỉ có thể duyệt đơn ở trạng thái pending");
      }

      await applyExportOrder(exportOrder, approverId, transaction);

      await exportOrder.update(
        {
          status: "approved",
          approved_at: new Date(),
        },
        { transaction },
      );

      return exportOrder;
    });

    return result;
  } catch (error) {
    throw new Error("Error approving export order: " + error.message);
  }
};

const rejectExportOrder = async (id, approverId) => {
  try {
    const exportOrder = await ExportOrder.findByPk(id);
    if (!exportOrder) {
      throw new Error("Export order not found");
    }

    if (exportOrder.status !== "pending") {
      throw new Error("Chỉ có thể từ chối đơn ở trạng thái pending");
    }

    await exportOrder.update({
      status: "rejected",
      approved_at: new Date(),
    });

    return exportOrder;
  } catch (error) {
    throw new Error("Error rejecting export order: " + error.message);
  }
};

const getAllExportOrders = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const search = (query.search || "").trim();

    const where = search
      ? {
          [Op.or]: [
            { code: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
            { department: { [Op.like]: `%${search}%` } },
            { receiver: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await ExportOrder.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
      include: [{ model: db.User, as: "creator" }],
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    throw new Error("Error fetching export orders: " + error.message);
  }
};

const getExportOrderById = async (id) => {
  try {
    return await ExportOrder.findByPk(id, {
      include: [
        { model: db.User, as: "creator" },
        { model: db.ExportOrderDetail, as: "details" },
      ],
    });
  } catch (error) {
    throw new Error("Error fetching export order: " + error.message);
  }
};

const updateExportOrder = async (id, exportOrderData, user) => {
  try {
    const exportOrder = await ExportOrder.findByPk(id);
    verifyExportOrderOwnership(exportOrder, user);

    const { details, status, created_by, ...orderData } = exportOrderData;

    await db.sequelize.transaction(async (transaction) => {
      await exportOrder.update(orderData, { transaction });

      if (Array.isArray(details)) {
        await ExportOrderDetail.destroy({
          where: { export_order_id: exportOrder.id },
          transaction,
        });

        if (details.length === 0) {
          throw new Error("Chi tiết đơn xuất không được để trống");
        }

        await validateExportItems(details, transaction);

        for (const item of details) {
          await ExportOrderDetail.create(
            {
              export_order_id: exportOrder.id,
              equipment_id: item.equipment_id,
              quantity: item.quantity,
            },
            { transaction },
          );
        }
      }
    });

    return exportOrder;
  } catch (error) {
    throw new Error("Error updating export order: " + error.message);
  }
};

const deleteExportOrder = async (id, user) => {
  try {
    const exportOrder = await ExportOrder.findByPk(id);
    verifyExportOrderOwnership(exportOrder, user);

    await exportOrder.destroy();
    return { message: "Export order deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting export order: " + error.message);
  }
};

module.exports = {
  createExportOrder,
  getAllExportOrders,
  getExportOrderById,
  updateExportOrder,
  deleteExportOrder,
  approveExportOrder,
  rejectExportOrder,
};
