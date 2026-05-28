const express = require("express");

const router = express.Router();
const exportOrderController = require("../controllers/exportOrderControllers");
const { authMiddleware } = require("../middlewares/authMiddlewares");

router.use(authMiddleware);

router.post("/", exportOrderController.createExportOrder);
router.get("/", exportOrderController.getAllExportOrders);
router.get("/:id", exportOrderController.getExportOrderById);
router.put("/:id", exportOrderController.updateExportOrder);
router.delete("/:id", exportOrderController.deleteExportOrder);

module.exports = router;
