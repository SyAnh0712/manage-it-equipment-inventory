const db = require("../../models");

const ExportOrder = db.ExportOrder;

const generateExportCode = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EXP-${yyyy}${mm}${dd}-${random}`;
};

const createExportOrder = async (exportOrderData) => {
  try {
    const payload = {
      ...exportOrderData,
      code: exportOrderData?.code || generateExportCode(),
    };

    return await ExportOrder.create(payload);
  } catch (error) {
    throw new Error("Error creating export order: " + error.message);
  }
};

const getAllExportOrders = async () => {
  try {
    return await ExportOrder.findAll({
      order: [["created_at", "DESC"]],
      include: [{ model: db.User, as: "creator" }],
    });
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

const updateExportOrder = async (id, exportOrderData) => {
  try {
    const exportOrder = await ExportOrder.findByPk(id);
    if (!exportOrder) {
      throw new Error("Export order not found");
    }

    await exportOrder.update(exportOrderData);
    return exportOrder;
  } catch (error) {
    throw new Error("Error updating export order: " + error.message);
  }
};

const deleteExportOrder = async (id) => {
  try {
    const exportOrder = await ExportOrder.findByPk(id);
    if (!exportOrder) {
      throw new Error("Export order not found");
    }

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
};
