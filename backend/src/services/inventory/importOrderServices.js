const db = require("../../models");

const ImportOrder = db.ImportOrder;

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
    const payload = {
      ...importOrderData,
      code: importOrderData?.code || generateImportCode(),
    };

    return await ImportOrder.create(payload);
  } catch (error) {
    throw new Error("Error creating import order: " + error.message);
  }
};

const getAllImportOrders = async () => {
  try {
    return await ImportOrder.findAll({
      order: [["created_at", "DESC"]],
      include: [
        { model: db.Supplier, as: "supplier" },
        { model: db.User, as: "creator" },
      ],
    });
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
