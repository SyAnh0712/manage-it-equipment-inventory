const db = require("../../models");
const { Op } = require("sequelize");
const { createError, rethrowServiceError } = require("../../utils/httpError");
const {
  assertOrderReadAccess,
  buildStaffOwnershipFilter,
} = require("../../utils/orderAccessHelper");
const { emitToAll } = require("../../utils/socket");

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

const buildDateRangeFilter = (dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) {
    return {};
  }

  const range = {};
  if (dateFrom) {
    range[Op.gte] = new Date(`${dateFrom}T00:00:00`);
  }
  if (dateTo) {
    range[Op.lte] = new Date(`${dateTo}T23:59:59`);
  }

  return { created_at: range };
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

  const aggregated = {};
  for (const item of validDetails) {
    const equipmentId = item.equipment.id;
    aggregated[equipmentId] = (aggregated[equipmentId] || 0) + item.quantity;
  }

  for (const [equipmentId, totalQty] of Object.entries(aggregated)) {
    const equipment = validDetails.find(
      (item) => String(item.equipment.id) === String(equipmentId),
    ).equipment;
    const stockQty = Number(equipment.quantity || 0);

    if (stockQty < totalQty) {
      throw new Error(
        `Không đủ số lượng tồn kho cho thiết bị ${equipment.name || equipmentId} (còn ${stockQty}, yêu cầu ${totalQty})`,
      );
    }
  }

  return validDetails;
};

const verifyExportOrderOwnership = (order, user) => {
  if (!order) {
    throw createError("Export order not found", 404);
  }

  if (order.status !== "pending") {
    throw createError("Chỉ có thể cập nhật đơn đang ở trạng thái pending", 400);
  }

  if (user?.role === "admin") {
    return;
  }

  if (String(order.created_by) !== String(user?.id)) {
    throw createError("Bạn không có quyền cập nhật đơn hàng này", 403);
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

      emitToAll("export:created", { order: exportOrder });
      emitToAll("notification", {
        type: "export",
        message: `Yêu cầu xuất ${exportOrder.code} đã được tạo.`,
      });

      return exportOrder;
    });

    return result;
  } catch (error) {
    rethrowServiceError(error, "Error creating export order");
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

      emitToAll("export:approved", { order: exportOrder });
      emitToAll("notification", {
        type: "export",
        message: `Yêu cầu xuất ${exportOrder.code} đã được duyệt.`,
      });

      return exportOrder;
    });

    return result;
  } catch (error) {
    rethrowServiceError(error, "Error approving export order");
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
    rethrowServiceError(error, "Error rejecting export order");
  }
};

const getExportOrderById = async (id, user) => {
  try {
    const exportOrder = await ExportOrder.findByPk(id, {
      include: [
        { model: db.User, as: "creator" },
        {
          model: db.ExportOrderDetail,
          as: "details",
          include: [
            {
              model: db.Equipment,
              as: "equipment",
              attributes: ["id", "code", "name", "unit", "quantity"],
            },
          ],
        },
      ],
    });

    assertOrderReadAccess(exportOrder, user, "Export order not found");
    return exportOrder;
  } catch (error) {
    rethrowServiceError(error, "Error fetching export order");
  }
};

const getAllExportOrders = async (query, user) => {
  try {
    const safeQuery = query || {};
    const page = Math.max(1, Number(safeQuery.page) || 1);
    const limit = Math.max(1, Number(safeQuery.limit) || 10);
    const search = (safeQuery.search || "").trim();
    const department = (safeQuery.department || "").trim();

    const where = {
      ...buildStaffOwnershipFilter(user),
      ...buildDateRangeFilter(safeQuery.date_from, safeQuery.date_to),
    };

    if (search) {
      where[Op.or] = [
        { code: { [Op.like]: `%${search}%` } },
        { status: { [Op.like]: `%${search}%` } },
        { department: { [Op.like]: `%${search}%` } },
        { receiver: { [Op.like]: `%${search}%` } },
      ];
    }

    if (department) {
      where.department = { [Op.like]: `%${department}%` };
    }

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
    rethrowServiceError(error, "Error fetching export orders");
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
    rethrowServiceError(error, "Error updating export order");
  }
};

const deleteExportOrder = async (id, user) => {
  try {
    const exportOrder = await ExportOrder.findByPk(id);
    verifyExportOrderOwnership(exportOrder, user);

    await exportOrder.destroy();
    return { message: "Export order deleted successfully" };
  } catch (error) {
    rethrowServiceError(error, "Error deleting export order");
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
