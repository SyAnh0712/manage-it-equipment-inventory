const express = require("express");

const router = express.Router();

const catagoryController = require("../controllers/catagoryControllers");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddlewares");
const {
  validate,
  categorySchema,
} = require("../middlewares/validationMiddleware");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("admin"),
  validate(categorySchema),
  catagoryController.createCategory,
);
router.get("/", catagoryController.getAllCategories);
router.get("/:id", catagoryController.getCategoryById);
router.put(
  "/:id",
  roleMiddleware("admin"),
  validate(categorySchema),
  catagoryController.updateCategory,
);
router.delete(
  "/:id",
  roleMiddleware("admin"),
  catagoryController.deleteCategory,
);

module.exports = router;
