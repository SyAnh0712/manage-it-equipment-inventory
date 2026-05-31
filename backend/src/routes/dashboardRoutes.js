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

module.exports = router;
