const exportOrderService = require("../services/inventory/exportOrderServices");

const createExportOrder = async (req, res) => {
  try {
    const exportOrder = await exportOrderService.createExportOrder(req.body);
    res.status(201).json(exportOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllExportOrders = async (req, res) => {
  try {
    const exportOrders = await exportOrderService.getAllExportOrders();
    res.json(exportOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExportOrderById = async (req, res) => {
  try {
    const exportOrder = await exportOrderService.getExportOrderById(
      req.params.id,
    );
    if (!exportOrder) {
      return res.status(404).json({ error: "Export order not found" });
    }

    res.json(exportOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExportOrder = async (req, res) => {
  try {
    const exportOrder = await exportOrderService.updateExportOrder(
      req.params.id,
      req.body,
    );

    res.json(exportOrder);
  } catch (error) {
    if (error.message === "Export order not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(400).json({ error: error.message });
  }
};

const deleteExportOrder = async (req, res) => {
  try {
    const result = await exportOrderService.deleteExportOrder(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === "Export order not found") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExportOrder,
  getAllExportOrders,
  getExportOrderById,
  updateExportOrder,
  deleteExportOrder,
};
