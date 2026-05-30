const inventoryLogService = require("../services/inventory/inventoryLogServices");

const getAllInventoryLogs = async (req, res, next) => {
  try {
    const logs = await inventoryLogService.getAllInventoryLogs(req.query);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventoryLogs,
};
