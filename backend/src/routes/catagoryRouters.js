const express = require("express");

const router = express.Router();

const catagoryController = require("../controllers/catagoryControllers");
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
  catagoryController.createCategory,
);
router.get("/", roleMiddleware("admin"), catagoryController.getAllCategories);
router.get("/:id", roleMiddleware("admin"), catagoryController.getCategoryById);
router.put(
  "/:id",
  roleMiddleware("admin"),
  handleUpload("image"),
  validate(categoryUpdateSchema),
  catagoryController.updateCategory,
);
router.delete(
  "/:id",
  roleMiddleware("admin"),
  catagoryController.deleteCategory,
);

module.exports = router;
