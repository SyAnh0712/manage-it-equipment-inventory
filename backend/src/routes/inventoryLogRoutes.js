const express = require("express");

const router = express.Router();
const inventoryLogController = require("../controllers/inventoryLogControllers");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddlewares");

router.use(authMiddleware);
router.get(
  "/",
  roleMiddleware("admin"),
  inventoryLogController.getAllInventoryLogs,
);

module.exports = router;
