const db = require("../../models");
const { Op } = require("sequelize");

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

const createImportOrder = async (importOrderData) => {
  try {
    const { details, ...orderData } = importOrderData;
    const payload = {
      ...orderData,
      code: importOrderData?.code || generateImportCode(),
    };

    const result = await db.sequelize.transaction(async (transaction) => {
      const importOrder = await ImportOrder.create(payload, { transaction });

      const detailList = Array.isArray(details) ? details : [];

      for (const item of detailList) {
        if (!item.equipment_id) {
          throw new Error("Thiếu equipment_id trong chi tiết nhập kho");
        }

        const equipment = await Equipment.findByPk(item.equipment_id, { transaction });
        if (!equipment) {
          throw new Error(`Thiếu thiết bị với id ${item.equipment_id}`);
        }

        const quantity = Number(item.quantity || 0);
        if (quantity <= 0) {
          throw new Error("Số lượng nhập phải lớn hơn 0");
        }

        const quantityBefore = Number(equipment.quantity || 0);
        const quantityAfter = quantityBefore + quantity;

        await equipment.update(
          { quantity: quantityAfter },
          { transaction },
        );

        await ImportOrderDetail.create(
          {
            import_order_id: importOrder.id,
            equipment_id: item.equipment_id,
            quantity,
            unit_price: item.unit_price || 0,
          },
          { transaction },
        );

        await InventoryLog.create(
          {
            equipment_id: item.equipment_id,
            action_type: "import",
            quantity_before: quantityBefore,
            quantity_changed: quantity,
            quantity_after: quantityAfter,
            reference_code: importOrder.code,
            created_by: importOrder.created_by || null,
          },
          { transaction },
        );
      }

      return importOrder;
    });

    return result;
  } catch (error) {
    throw new Error("Error creating import order: " + error.message);
  }
};

const getAllImportOrders = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const search = (query.search || "").trim();

    const where = search
      ? {
          [Op.or]: [
            { code: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
            { note: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await ImportOrder.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
      include: [
        { model: db.Supplier, as: "supplier" },
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
    throw new Error("Error fetching import orders: " + error.message);
  }
};

const getImportOrderById = async (id) => {
  try {
    return await ImportOrder.findByPk(id, {
      include: [
        { model: db.Supplier, as: "supplier" },
        { model: db.User, as: "creator" },
        { model: db.ImportOrderDetail, as: "details" },
      ],
    });
  } catch (error) {
    throw new Error("Error fetching import order: " + error.message);
  }
};

const updateImportOrder = async (id, importOrderData) => {
  try {
    const importOrder = await ImportOrder.findByPk(id);
    if (!importOrder) {
      throw new Error("Import order not found");
    }

    await importOrder.update(importOrderData);
    return importOrder;
  } catch (error) {
    throw new Error("Error updating import order: " + error.message);
  }
};

const deleteImportOrder = async (id) => {
  try {
    const importOrder = await ImportOrder.findByPk(id);
    if (!importOrder) {
      throw new Error("Import order not found");
    }

    await importOrder.destroy();
    return { message: "Import order deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting import order: " + error.message);
  }
};

module.exports = {
  createImportOrder,
  getAllImportOrders,
  getImportOrderById,
  updateImportOrder,
  deleteImportOrder,
};
