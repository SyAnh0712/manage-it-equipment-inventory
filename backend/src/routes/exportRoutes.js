const express = require("express");

const router = express.Router();
const exportOrderController = require("../controllers/exportOrderControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  validate,
  exportOrderSchema,
} = require("../middlewares/validationMiddleware");

router.use(authMiddleware);

router.post(
  "/",
  validate(exportOrderSchema),
  exportOrderController.createExportOrder,
);
router.get("/", exportOrderController.getAllExportOrders);
router.get("/:id", exportOrderController.getExportOrderById);
router.put(
  "/:id",
  validate(exportOrderSchema),
  exportOrderController.updateExportOrder,
);
router.delete("/:id", exportOrderController.deleteExportOrder);
router.post(
  "/:id/approve",
  roleMiddleware("admin"),
  exportOrderController.approveExportOrder,
);
router.post(
  "/:id/reject",
  roleMiddleware("admin"),
  exportOrderController.rejectExportOrder,
);

module.exports = router;
