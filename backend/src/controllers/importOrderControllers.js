const importOrderService = require("../services/inventory/importOrderServices");
const { sendSuccess } = require("../utils/responseHelper");

const createImportOrder = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.createImportOrder(
      req.body,
      req.user?.id,
    );
    return sendSuccess(
      res,
      201,
      "Import order created successfully",
      importOrder,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const getAllImportOrders = async (req, res, nextHandler) => {
  try {
    const importOrders = await importOrderService.getAllImportOrders(
      req.query,
      req.user,
    );
    return sendSuccess(
      res,
      200,
      "Import orders fetched successfully",
      importOrders,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const getImportOrderById = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.getImportOrderById(
      req.params.id,
      req.user,
    );
    if (!importOrder) {
      const err = new Error("Import order not found");
      err.status = 404;
      throw err;
    }

    return sendSuccess(
      res,
      200,
      "Import order fetched successfully",
      importOrder,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const updateImportOrder = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.updateImportOrder(
      req.params.id,
      req.body,
      req.user,
    );

    return sendSuccess(
      res,
      200,
      "Import order updated successfully",
      importOrder,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const deleteImportOrder = async (req, res, nextHandler) => {
  try {
    const result = await importOrderService.deleteImportOrder(
      req.params.id,
      req.user,
    );
    return sendSuccess(
      res,
      200,
      "Import order deleted successfully",
      result,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const approveImportOrder = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.approveImportOrder(
      req.params.id,
      req.user?.id,
    );
    return sendSuccess(
      res,
      200,
      "Import order approved successfully",
      importOrder,
    );
  } catch (error) {
    nextHandler(error);
  }
};

const rejectImportOrder = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.rejectImportOrder(
      req.params.id,
      req.user?.id,
    );
    return sendSuccess(
      res,
      200,
      "Import order rejected successfully",
      importOrder,
    );
  } catch (error) {
    nextHandler(error);
  }
};

module.exports = {
  createImportOrder,
  getAllImportOrders,
  getImportOrderById,
  updateImportOrder,
  deleteImportOrder,
  approveImportOrder,
  rejectImportOrder,
};
