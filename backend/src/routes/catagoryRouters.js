const express = require("express");

const router = express.Router();

const catagoryController = require("../controllers/catagoryControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  validate,
  categorySchema,
} = require("../middlewares/validationMiddleware");
const upload = require("../utils/uploadHelper");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("admin"),
  upload.single("image"),
  validate(categorySchema),
  catagoryController.createCategory,
);
router.get("/", roleMiddleware("admin"), catagoryController.getAllCategories);
router.get("/:id", roleMiddleware("admin"), catagoryController.getCategoryById);
router.put(
  "/:id",
  roleMiddleware("admin"),
  upload.single("image"),
  validate(categorySchema),
  catagoryController.updateCategory,
);
router.delete(
  "/:id",
  roleMiddleware("admin"),
  catagoryController.deleteCategory,
);

module.exports = router;
