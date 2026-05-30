const express = require("express");

const router = express.Router();
const inventoryLogController = require("../controllers/inventoryLogControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);
router.get(
  "/",
  roleMiddleware("admin"),
  inventoryLogController.getAllInventoryLogs,
);

module.exports = router;
