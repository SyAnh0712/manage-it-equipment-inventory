const exportOrderService = require("../services/inventory/exportOrderServices");

const createExportOrder = async (req, res, nextHandler) => {
  try {
    const exportOrder = await exportOrderService.createExportOrder(
      req.body,
      req.user?.id,
    );
    res.status(201).json(exportOrder);
  } catch (error) {
    nextHandler(error);
  }
};

const getAllExportOrders = async (req, res, nextHandler) => {
  try {
    const exportOrders = await exportOrderService.getAllExportOrders(req.query);
    res.json(exportOrders);
  } catch (error) {
    nextHandler(error);
  }
};

const getExportOrderById = async (req, res, nextHandler) => {
  try {
    const exportOrder = await exportOrderService.getExportOrderById(
      req.params.id,
    );
    if (!exportOrder) {
      const err = new Error("Export order not found");
      err.status = 404;
      throw err;
    }

    res.json(exportOrder);
  } catch (error) {
    nextHandler(error);
  }
};

const updateExportOrder = async (req, res, nextHandler) => {
  try {
    const exportOrder = await exportOrderService.updateExportOrder(
      req.params.id,
      req.body,
    );

    res.json(exportOrder);
  } catch (error) {
    nextHandler(error);
  }
};

const deleteExportOrder = async (req, res, nextHandler) => {
  try {
    const result = await exportOrderService.deleteExportOrder(req.params.id);
    res.json(result);
  } catch (error) {
    nextHandler(error);
  }
};

const approveExportOrder = async (req, res, nextHandler) => {
  try {
    const exportOrder = await exportOrderService.approveExportOrder(
      req.params.id,
      req.user?.id,
    );
    res.json(exportOrder);
  } catch (error) {
    nextHandler(error);
  }
};

const rejectExportOrder = async (req, res, nextHandler) => {
  try {
    const exportOrder = await exportOrderService.rejectExportOrder(
      req.params.id,
      req.user?.id,
    );
    res.json(exportOrder);
  } catch (error) {
    nextHandler(error);
  }
};

module.exports = {
  createExportOrder,
  getAllExportOrders,
  getExportOrderById,
  updateExportOrder,
  deleteExportOrder,
  approveExportOrder,
  rejectExportOrder,
};
