const express = require("express");

const router = express.Router();
const dashboardController = require("../controllers/dashboardControllers");
const authMiddleware = require("../middlewares/authMiddlewares");

router.use(authMiddleware);

router.get("/statistics", dashboardController.getStatistics);
router.get("/statistics/detailed", dashboardController.getDetailedStatistics);
router.get("/trends", dashboardController.getInventoryTrends);

module.exports = router;
