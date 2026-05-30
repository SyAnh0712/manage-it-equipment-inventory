const express = require("express");

const router = express.Router();
const inventoryLogController = require("../controllers/inventoryLogControllers");
const { authMiddleware } = require("../middlewares/authMiddlewares");

router.use(authMiddleware);
router.get("/", inventoryLogController.getAllInventoryLogs);

module.exports = router;
