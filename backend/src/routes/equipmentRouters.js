const express = require("express");

const router = express.Router();

const equipmentController = require("../controllers/equipmentControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  validate,
  equipmentSchema,
  equipmentUpdateSchema,
} = require("../middlewares/validationMiddleware");
const { handleUpload } = require("../utils/uploadHelper");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("admin"),
  handleUpload("image"),
  validate(equipmentSchema),
  equipmentController.createEquipment,
);
router.get("/", equipmentController.getAllEquipment);
router.get("/:id", equipmentController.getEquipmentById);
router.put(
  "/:id",
  roleMiddleware("admin"),
  handleUpload("image"),
  validate(equipmentUpdateSchema),
  equipmentController.updateEquipment,
);
router.delete(
  "/:id",
  roleMiddleware("admin"),
  equipmentController.deleteEquipment,
);

module.exports = router;
