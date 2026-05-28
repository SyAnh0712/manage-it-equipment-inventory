const importOrderService = require("../services/inventory/importOrderServices");

const createImportOrder = async (req, res) => {
  try {
    const importOrder = await importOrderService.createImportOrder(req.body);
    res.status(201).json(importOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllImportOrders = async (req, res) => {
  try {
    const importOrders = await importOrderService.getAllImportOrders(req.query);
    res.json(importOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImportOrderById = async (req, res) => {
  try {
    const importOrder = await importOrderService.getImportOrderById(
      req.params.id,
    );
    if (!importOrder) {
      return res.status(404).json({ error: "Import order not found" });
    }

    res.json(importOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateImportOrder = async (req, res) => {
  try {
    const importOrder = await importOrderService.updateImportOrder(
      req.params.id,
      req.body,
    );

    res.json(importOrder);
  } catch (error) {
    if (error.message === "Import order not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(400).json({ error: error.message });
  }
};

const deleteImportOrder = async (req, res) => {
  try {
    const result = await importOrderService.deleteImportOrder(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === "Import order not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createImportOrder,
  getAllImportOrders,
  getImportOrderById,
  updateImportOrder,
  deleteImportOrder,
};
