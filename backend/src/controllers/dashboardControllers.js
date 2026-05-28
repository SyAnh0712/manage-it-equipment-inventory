const dashboardService = require("../services/dashboard/dashboardServices");

const getStatistics = async (req, res) => {
  try {
    const result = await dashboardService.getStatistics();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStatistics,
};
