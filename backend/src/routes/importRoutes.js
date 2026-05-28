const express = require("express");

const router = express.Router();
const importOrderController = require("../controllers/importOrderControllers");
const { authMiddleware } = require("../middlewares/authMiddlewares");
const {
  validate,
  importOrderSchema,
} = require("../middlewares/validationMiddleware");

router.use(authMiddleware);

router.post(
  "/",
  validate(importOrderSchema),
  importOrderController.createImportOrder,
);
router.get("/", importOrderController.getAllImportOrders);
router.get("/:id", importOrderController.getImportOrderById);
router.put(
  "/:id",
  validate(importOrderSchema),
  importOrderController.updateImportOrder,
);
router.delete("/:id", importOrderController.deleteImportOrder);

module.exports = router;
