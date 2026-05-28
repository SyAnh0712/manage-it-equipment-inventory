const express = require("express");

const router = express.Router();

const supplierController = require("../controllers/supplierControllers");
const { authMiddleware } = require("../middlewares/authMiddlewares");
const {
  validate,
  supplierSchema,
} = require("../middlewares/validationMiddleware");

router.use(authMiddleware);

router.post("/", validate(supplierSchema), supplierController.createSupplier);
router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put("/:id", validate(supplierSchema), supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;
