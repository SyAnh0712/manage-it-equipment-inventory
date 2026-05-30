const express = require("express");

const router = express.Router();

const equipmentController = require("../controllers/equipmentControllers");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddlewares");
const {
  validate,
  equipmentSchema,
} = require("../middlewares/validationMiddleware");
const upload = require("../utils/uploadHelper");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("admin"),
  upload.single("image"),
  validate(equipmentSchema),
  equipmentController.createEquipment,
);
router.get("/", equipmentController.getAllEquipment);
router.get("/:id", equipmentController.getEquipmentById);
router.put(
  "/:id",
  roleMiddleware("admin"),
  upload.single("image"),
  validate(equipmentSchema),
  equipmentController.updateEquipment,
);
router.delete(
  "/:id",
  roleMiddleware("admin"),
  equipmentController.deleteEquipment,
);

module.exports = router;
