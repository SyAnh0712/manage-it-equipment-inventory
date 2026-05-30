const express = require("express");

const router = express.Router();
const inventoryLogController = require("../controllers/inventoryLogControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  validate,
  adjustInventorySchema,
} = require("../middlewares/validationMiddleware");

router.use(authMiddleware);
router.get(
  "/",
  roleMiddleware("admin"),
  inventoryLogController.getAllInventoryLogs,
);
router.post(
  "/adjust",
  roleMiddleware("admin"),
  validate(adjustInventorySchema),
  inventoryLogController.adjustInventory,
);

module.exports = router;
