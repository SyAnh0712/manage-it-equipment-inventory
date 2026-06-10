const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/categoryControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  validate,
  categorySchema,
  categoryUpdateSchema,
} = require("../middlewares/validationMiddleware");
const { handleUpload } = require("../utils/uploadHelper");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("admin"),
  handleUpload("image"),
  validate(categorySchema),
  categoryController.createCategory,
);
router.get("/", roleMiddleware("admin"), categoryController.getAllCategories);
router.get("/:id", roleMiddleware("admin"), categoryController.getCategoryById);
router.put(
  "/:id",
  roleMiddleware("admin"),
  handleUpload("image"),
  validate(categoryUpdateSchema),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  roleMiddleware("admin"),
  categoryController.deleteCategory,
);

module.exports = router;
