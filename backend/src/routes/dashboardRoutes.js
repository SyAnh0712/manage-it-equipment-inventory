const express = require("express");

const router = express.Router();
const dashboardController = require("../controllers/dashboardControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);

router.get("/statistics", dashboardController.getStatistics);
router.get(
  "/statistics/detailed",
  roleMiddleware("admin"),
  dashboardController.getDetailedStatistics,
);
router.get("/trends", roleMiddleware("admin"), dashboardController.getInventoryTrends);
router.get("/monthly-report", dashboardController.getMonthlyReport);
router.get("/category-distribution", dashboardController.getCategoryDistribution);
router.get("/top-equipment", dashboardController.getTopEquipment);
router.get("/recent-activities", dashboardController.getRecentActivities);
router.get("/my-recent-orders", dashboardController.getMyRecentOrders);
router.get("/my-activities", dashboardController.getMyActivities);

module.exports = router;
