const inventoryLogService = require("../services/inventory/inventoryLogServices");

const getAllInventoryLogs = async (req, res, next) => {
  try {
    const logs = await inventoryLogService.getAllInventoryLogs(req.query);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const adjustInventory = async (req, res, next) => {
  try {
    const log = await inventoryLogService.adjustInventory(
      req.body,
      req.user?.id,
    );
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventoryLogs,
  adjustInventory,
};
