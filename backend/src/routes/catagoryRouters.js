const express = require("express");

const router = express.Router();

const catagoryController = require("../controllers/catagoryControllers");
const { authMiddleware } = require("../middlewares/authMiddlewares");
const {
  validate,
  categorySchema,
} = require("../middlewares/validationMiddleware");

router.use(authMiddleware);

router.post("/", validate(categorySchema), catagoryController.createCategory);
router.get("/", catagoryController.getAllCategories);
router.get("/:id", catagoryController.getCategoryById);
router.put("/:id", validate(categorySchema), catagoryController.updateCategory);
router.delete("/:id", catagoryController.deleteCategory);

module.exports = router;
