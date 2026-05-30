const importOrderService = require("../services/inventory/importOrderServices");

const createImportOrder = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.createImportOrder(
      req.body,
      req.user?.id,
    );
    res.status(201).json(importOrder);
  } catch (error) {
    next(error);
  }
};

const getAllImportOrders = async (req, res, nextHandler) => {
  try {
    const importOrders = await importOrderService.getAllImportOrders(
      req.query,
      req.user,
    );
    res.json(importOrders);
  } catch (error) {
    next(error);
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

    res.json(importOrder);
  } catch (error) {
    next(error);
  }
};

const updateImportOrder = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.updateImportOrder(
      req.params.id,
      req.body,
      req.user,
    );

    res.json(importOrder);
  } catch (error) {
    next(error);
  }
};

const deleteImportOrder = async (req, res, nextHandler) => {
  try {
    const result = await importOrderService.deleteImportOrder(
      req.params.id,
      req.user,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const approveImportOrder = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.approveImportOrder(
      req.params.id,
      req.user?.id,
    );
    res.json(importOrder);
  } catch (error) {
    next(error);
  }
};

const rejectImportOrder = async (req, res, nextHandler) => {
  try {
    const importOrder = await importOrderService.rejectImportOrder(
      req.params.id,
      req.user?.id,
    );
    res.json(importOrder);
  } catch (error) {
    next(error);
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
