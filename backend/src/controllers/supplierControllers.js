const supplierService = require("../services/supplier/supplierServices");
const { sendSuccess } = require("../utils/responseHelper");

const createSupplier = async (req, res, nextHandler) => {
  try {
    const supplierData = req.body;
    const supplier = await supplierService.createSupplier(supplierData);
    return sendSuccess(res, 201, "Supplier created successfully", supplier);
  } catch (error) {
    next(error);
  }
};

const getAllSuppliers = async (req, res, nextHandler) => {
  try {
    const suppliers = await supplierService.getAllSuppliers(req.query);
    return sendSuccess(res, 200, "Suppliers fetched successfully", suppliers);
  } catch (error) {
    next(error);
  }
};

const getSupplierById = async (req, res, nextHandler) => {
  try {
    const supplierId = req.params.id;
    const supplier = await supplierService.getSupplierById(supplierId);
    if (supplier) {
      return sendSuccess(res, 200, "Supplier fetched successfully", supplier);
    } else {
      const err = new Error("Supplier not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, nextHandler) => {
  try {
    const supplierId = req.params.id;
    const supplierData = req.body;
    const updatedSupplier = await supplierService.updateSupplier(
      supplierId,
      supplierData,
    );
    if (updatedSupplier) {
      return sendSuccess(
        res,
        200,
        "Supplier updated successfully",
        updatedSupplier,
      );
    } else {
      const err = new Error("Supplier not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, nextHandler) => {
  try {
    const supplierId = req.params.id;
    const result = await supplierService.deleteSupplier(supplierId);
    return sendSuccess(res, 200, "Supplier deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
