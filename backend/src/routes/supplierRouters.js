const express = require("express");

const router = express.Router();

const supplierController = require("../controllers/supplierControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  validate,
  supplierSchema,
} = require("../middlewares/validationMiddleware");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("admin"),
  validate(supplierSchema),
  supplierController.createSupplier,
);
router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put(
  "/:id",
  roleMiddleware("admin"),
  validate(supplierSchema),
  supplierController.updateSupplier,
);
router.delete(
  "/:id",
  roleMiddleware("admin"),
  supplierController.deleteSupplier,
);

module.exports = router;
