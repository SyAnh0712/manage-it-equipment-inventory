const db = require("../../models");

const Supplier = db.Supplier;

const createSupplier = async (supplierData) => {
  try {
    const newSupplier = await Supplier.create(supplierData);
    return newSupplier;
  } catch (error) {
    throw new Error("Error creating supplier: " + error.message);
  }
};

const getAllSuppliers = async () => {
  try {
    const suppliers = await Supplier.findAll();
    return suppliers;
  } catch (error) {
    throw new Error("Error fetching suppliers: " + error.message);
  }
};

const getSupplierById = async (id) => {
  try {
    const supplier = await Supplier.findByPk(id);
    return supplier;
  } catch (error) {
    throw new Error("Error fetching supplier: " + error.message);
  }
};

const updateSupplier = async (id, supplierData) => {
  try {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    await supplier.update(supplierData);
    return supplier;
  } catch (error) {
    throw new Error("Error updating supplier: " + error.message);
  }
};

const deleteSupplier = async (id) => {
  try {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    await supplier.destroy();
    return { message: "Supplier deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting supplier: " + error.message);
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
