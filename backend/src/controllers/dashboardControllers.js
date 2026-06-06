const dashboardService = require("../services/dashboard/dashboardServices");
const { sendSuccess } = require("../utils/responseHelper");

const getStatistics = async (req, res, next) => {
  try {
    const result = await dashboardService.getStatistics(req.user);
    return sendSuccess(res, 200, "Statistics fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const getDetailedStatistics = async (req, res, next) => {
  try {
    const result = await dashboardService.getDetailedStatistics();
    return sendSuccess(res, 200, "Detailed statistics fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const getInventoryTrends = async (req, res, next) => {
  try {
    const days = Math.max(1, Number(req.query.days) || 30);
    const result = await dashboardService.getInventoryTrends(days);
    return sendSuccess(res, 200, "Inventory trends fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatistics,
  getDetailedStatistics,
  getInventoryTrends,
};
