const supplierService = require("../services/supplier/supplierServices");

const createSupplier = async (req, res) => {
  try {
    const supplierData = req.body;
    const supplier = await supplierService.createSupplier(supplierData);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getAllSuppliers(req.query);
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await supplierService.getSupplierById(supplierId);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSupplier = async (req, res) => {
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
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const result = await supplierService.deleteSupplier(supplierId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
