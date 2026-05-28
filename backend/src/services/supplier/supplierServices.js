const db = require("../../models");
const { Op } = require("sequelize");

const Supplier = db.Supplier;

const createSupplier = async (supplierData) => {
  try {
    const newSupplier = await Supplier.create(supplierData);
    return newSupplier;
  } catch (error) {
    throw new Error("Error creating supplier: " + error.message);
  }
};

const getAllSuppliers = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const search = (query.search || "").trim();

    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Supplier.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
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
