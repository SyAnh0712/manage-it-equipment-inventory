const exportOrderService = require("../services/inventory/exportOrderServices");
const { sendSuccess } = require("../utils/responseHelper");

const createExportOrder = async (req, res, nextHandler) => {
  try {
    const exportOrder = await exportOrderService.createExportOrder(
      req.body,
      req.user?.id,
    );
    return sendSuccess(
      res,
      201,
      "Export order created successfully",
      exportOrder,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const getAllExportOrders = async (req, res, nextHandler) => {
  try {
    const exportOrders = await exportOrderService.getAllExportOrders(
      req.query,
      req.user,
    );
    return sendSuccess(
      res,
      200,
      "Export orders fetched successfully",
      exportOrders,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const getExportOrderById = async (req, res, nextHandler) => {
  try {
    const exportOrder = await exportOrderService.getExportOrderById(
      req.params.id,
      req.user,
    );
    if (!exportOrder) {
      const err = new Error("Export order not found");
      err.status = 404;
      throw err;
    }

    return sendSuccess(
      res,
      200,
      "Export order fetched successfully",
      exportOrder,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const updateExportOrder = async (req, res, nextHandler) => {
  try {
    const exportOrder = await exportOrderService.updateExportOrder(
      req.params.id,
      req.body,
      req.user,
    );

    return sendSuccess(
      res,
      200,
      "Export order updated successfully",
      exportOrder,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const deleteExportOrder = async (req, res, nextHandler) => {
  try {
    const result = await exportOrderService.deleteExportOrder(
      req.params.id,
      req.user,
    );
    return sendSuccess(
      res,
      200,
      "Export order deleted successfully",
      result,
    );
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
    return sendSuccess(
      res,
      200,
      "Export order approved successfully",
      exportOrder,
    );
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
    return sendSuccess(
      res,
      200,
      "Export order rejected successfully",
      exportOrder,
    );
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
