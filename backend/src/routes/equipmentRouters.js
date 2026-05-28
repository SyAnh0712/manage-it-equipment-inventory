const express = require("express");

const router = express.Router();

const equipmentController = require("../controllers/equipmentControllers");
const { authMiddleware } = require("../middlewares/authMiddlewares");
const {
  validate,
  equipmentSchema,
} = require("../middlewares/validationMiddleware");
const upload = require("../utils/uploadHelper");

router.use(authMiddleware);

router.post(
  "/",
  upload.single("image"),
  validate(equipmentSchema),
  equipmentController.createEquipment,
);
router.get("/", equipmentController.getAllEquipment);
router.get("/:id", equipmentController.getEquipmentById);
router.put(
  "/:id",
  upload.single("image"),
  validate(equipmentSchema),
  equipmentController.updateEquipment,
);
router.delete("/:id", equipmentController.deleteEquipment);

module.exports = router;
