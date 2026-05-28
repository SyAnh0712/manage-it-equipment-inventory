const supplierService = require("../services/supplier/supplierServices");

const createSupplier = async (req, res, nextHandler) => {
  try {
    const supplierData = req.body;
    const supplier = await supplierService.createSupplier(supplierData);
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

const getAllSuppliers = async (req, res, nextHandler) => {
  try {
    const suppliers = await supplierService.getAllSuppliers(req.query);
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

const getSupplierById = async (req, res, nextHandler) => {
  try {
    const supplierId = req.params.id;
    const supplier = await supplierService.getSupplierById(supplierId);
    if (supplier) {
      res.json(supplier);
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
      res.json(updatedSupplier);
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
    res.json(result);
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
