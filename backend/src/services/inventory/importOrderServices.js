const db = require("../../models");
const { Op } = require("sequelize");
const { createError, rethrowServiceError } = require("../../utils/httpError");
const {
  assertOrderReadAccess,
  buildStaffOwnershipFilter,
} = require("../../utils/orderAccessHelper");
const { emitToAll } = require("../../utils/socket");

const ImportOrder = db.ImportOrder;
const ImportOrderDetail = db.ImportOrderDetail;
const InventoryLog = db.InventoryLog;
const Equipment = db.Equipment;

const generateImportCode = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `IMP-${yyyy}${mm}${dd}-${random}`;
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

const validateImportItems = async (detailList, transaction) => {
  const validDetails = [];

  for (const item of detailList) {
    if (!item.equipment_id) {
      throw new Error("Thiếu equipment_id trong chi tiết nhập kho");
    }

    const equipment = await Equipment.findByPk(item.equipment_id, {
      transaction,
    });
    if (!equipment) {
      throw new Error(`Thiếu thiết bị với id ${item.equipment_id}`);
    }

    const quantity = Number(item.quantity || 0);
    if (quantity <= 0) {
      throw new Error("Số lượng nhập phải lớn hơn 0");
    }

    validDetails.push({
      equipment,
      quantity,
      unit_price: Number(item.unit_price ?? 0),
    });
  }

  return validDetails;
};

const verifyImportOrderOwnership = (order, user) => {
  if (!order) {
    throw createError("Import order not found", 404);
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

const createImportOrder = async (importOrderData, userId) => {
  try {
    const { details, ...orderData } = importOrderData;
    const payload = {
      ...orderData,
      code: importOrderData?.code || generateImportCode(),
      created_by: userId || null,
      status: "pending",
    };

    const result = await db.sequelize.transaction(async (transaction) => {
      const importOrder = await ImportOrder.create(payload, { transaction });

      const detailList = Array.isArray(details) ? details : [];
      if (detailList.length === 0) {
        throw new Error("Chi tiết đơn nhập không được để trống");
      }

      await validateImportItems(detailList, transaction);

      for (const item of detailList) {
        await ImportOrderDetail.create(
          {
            import_order_id: importOrder.id,
            equipment_id: item.equipment_id,
            quantity: item.quantity,
            unit_price: item.unit_price || 0,
          },
          { transaction },
        );
      }

      emitToAll("import:created", { order: importOrder });
      emitToAll("notification", {
        type: "import",
        message: `Phiếu nhập ${importOrder.code} đã được tạo.`,
      });

      return importOrder;
    });

    return result;
  } catch (error) {
    rethrowServiceError(error, "Error creating import order");
  }
};

const applyImportOrder = async (importOrder, approverId, transaction) => {
  const details = await ImportOrderDetail.findAll({
    where: { import_order_id: importOrder.id },
    transaction,
  });

  if (!details.length) {
    throw new Error("Không có chi tiết đơn nhập để duyệt");
  }

  for (const item of details) {
    const equipment = await Equipment.findByPk(item.equipment_id, {
      transaction,
    });
    if (!equipment) {
      throw new Error(`Thiếu thiết bị với id ${item.equipment_id}`);
    }

    const quantityBefore = Number(equipment.quantity || 0);
    const quantityAfter = quantityBefore + Number(item.quantity);

    await equipment.update({ quantity: quantityAfter }, { transaction });

    await InventoryLog.create(
      {
        equipment_id: item.equipment_id,
        action_type: "import",
        quantity_before: quantityBefore,
        quantity_changed: Number(item.quantity),
        quantity_after: quantityAfter,
        reference_code: importOrder.code,
        created_by: approverId || importOrder.created_by || null,
      },
      { transaction },
    );
  }
};

const approveImportOrder = async (id, approverId) => {
  try {
    const result = await db.sequelize.transaction(async (transaction) => {
      const importOrder = await ImportOrder.findByPk(id, {
        include: [{ model: db.ImportOrderDetail, as: "details" }],
        transaction,
      });

      if (!importOrder) {
        throw new Error("Import order not found");
      }

      if (importOrder.status !== "pending") {
        throw new Error("Chỉ có thể duyệt đơn ở trạng thái pending");
      }

      await applyImportOrder(importOrder, approverId, transaction);

      await importOrder.update(
        {
          status: "approved",
          approved_at: new Date(),
        },
        { transaction },
      );

      emitToAll("import:approved", { order: importOrder });
      emitToAll("notification", {
        type: "import",
        message: `Phiếu nhập ${importOrder.code} đã được duyệt.`,
      });

      return importOrder;
    });

    return result;
  } catch (error) {
    rethrowServiceError(error, "Error approving import order");
  }
};

const rejectImportOrder = async (id, approverId) => {
  try {
    const importOrder = await ImportOrder.findByPk(id);
    if (!importOrder) {
      throw new Error("Import order not found");
    }

    if (importOrder.status !== "pending") {
      throw new Error("Chỉ có thể từ chối đơn ở trạng thái pending");
    }

    await importOrder.update({
      status: "rejected",
      approved_at: new Date(),
    });

    return importOrder;
  } catch (error) {
    rethrowServiceError(error, "Error rejecting import order");
  }
};

const getImportOrderById = async (id, user) => {
  try {
    const importOrder = await ImportOrder.findByPk(id, {
      include: [
        { model: db.Supplier, as: "supplier" },
        { model: db.User, as: "creator" },
        {
          model: db.ImportOrderDetail,
          as: "details",
          include: [
            {
              model: db.Equipment,
              as: "equipment",
              attributes: ["id", "code", "name", "unit"],
            },
          ],
        },
      ],
    });

    assertOrderReadAccess(importOrder, user, "Import order not found");
    return importOrder;
  } catch (error) {
    rethrowServiceError(error, "Error fetching import order");
  }
};

const getAllImportOrders = async (query, user) => {
  try {
    const safeQuery = query || {};
    const page = Math.max(1, Number(safeQuery.page) || 1);
    const limit = Math.max(1, Number(safeQuery.limit) || 10);
    const search = (safeQuery.search || "").trim();
    const supplierId = safeQuery.supplier_id
      ? Number(safeQuery.supplier_id)
      : null;

    const where = {
      ...buildStaffOwnershipFilter(user),
      ...buildDateRangeFilter(safeQuery.date_from, safeQuery.date_to),
    };

    if (search) {
      where[Op.or] = [
        { code: { [Op.like]: `%${search}%` } },
        { status: { [Op.like]: `%${search}%` } },
        { note: { [Op.like]: `%${search}%` } },
        { "$supplier.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    if (supplierId) {
      where.supplier_id = supplierId;
    }

    const { count, rows } = await ImportOrder.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
      subQuery: false,
      distinct: true,
      include: [
        { model: db.Supplier, as: "supplier", required: false },
        { model: db.User, as: "creator" },
      ],
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
    rethrowServiceError(error, "Error fetching import orders");
  }
};

const updateImportOrder = async (id, importOrderData, user) => {
  try {
    const importOrder = await ImportOrder.findByPk(id);
    verifyImportOrderOwnership(importOrder, user);

    const { details, status, created_by, ...orderData } = importOrderData;

    await db.sequelize.transaction(async (transaction) => {
      await importOrder.update(orderData, { transaction });

      if (Array.isArray(details)) {
        await ImportOrderDetail.destroy({
          where: { import_order_id: importOrder.id },
          transaction,
        });

        if (details.length === 0) {
          throw new Error("Chi tiết đơn nhập không được để trống");
        }

        await validateImportItems(details, transaction);

        for (const item of details) {
          await ImportOrderDetail.create(
            {
              import_order_id: importOrder.id,
              equipment_id: item.equipment_id,
              quantity: item.quantity,
              unit_price: item.unit_price || 0,
            },
            { transaction },
          );
        }
      }
    });

    return importOrder;
  } catch (error) {
    rethrowServiceError(error, "Error updating import order");
  }
};

const deleteImportOrder = async (id, user) => {
  try {
    const importOrder = await ImportOrder.findByPk(id);
    verifyImportOrderOwnership(importOrder, user);

    await importOrder.destroy();
    return { message: "Import order deleted successfully" };
  } catch (error) {
    rethrowServiceError(error, "Error deleting import order");
  }
};

module.exports = {
  createImportOrder,
  getAllImportOrders,
  getImportOrderById,
  updateImportOrder,
  deleteImportOrder,
  approveImportOrder,
  rejectImportOrder,
};
