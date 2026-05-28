const express = require("express");

const router = express.Router();
const exportOrderController = require("../controllers/exportOrderControllers");
const { authMiddleware } = require("../middlewares/authMiddlewares");
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

module.exports = router;
