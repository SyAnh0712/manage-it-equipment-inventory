const inventoryLogService = require("../services/inventory/inventoryLogServices");
const { sendSuccess } = require("../utils/responseHelper");
const { formatInventoryLog, formatInventoryLogList } = require("../dto/inventory/inventoryLog.response.dto");

const getAllInventoryLogs = async (req, res, next) => {
  try {
    const logs = await inventoryLogService.getAllInventoryLogs(req.query);
    return sendSuccess(res, 200, "Inventory logs fetched successfully", formatInventoryLogList(logs));
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
    return sendSuccess(res, 201, "Inventory adjusted successfully", formatInventoryLog(log));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventoryLogs,
  adjustInventory,
};
