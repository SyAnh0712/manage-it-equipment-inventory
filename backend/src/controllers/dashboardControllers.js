const dashboardService = require("../services/dashboard/dashboardServices");

const getStatistics = async (req, res, next) => {
  try {
    const result = await dashboardService.getStatistics();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailedStatistics = async (req, res, next) => {
  try {
    const result = await dashboardService.getDetailedStatistics();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getInventoryTrends = async (req, res, next) => {
  try {
    const days = Math.max(1, Number(req.query.days) || 30);
    const result = await dashboardService.getInventoryTrends(days);
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatistics,
  getDetailedStatistics,
  getInventoryTrends,
};
