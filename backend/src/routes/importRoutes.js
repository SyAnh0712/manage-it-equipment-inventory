const express = require("express");

const router = express.Router();
const importOrderController = require("../controllers/importOrderControllers");

router.post("/", importOrderController.createImportOrder);
router.get("/", importOrderController.getAllImportOrders);
router.get("/:id", importOrderController.getImportOrderById);
router.put("/:id", importOrderController.updateImportOrder);
router.delete("/:id", importOrderController.deleteImportOrder);

module.exports = router;
