const express = require("express");

const router = express.Router();

const catagoryController = require("../controllers/catagoryControllers");
const { authMiddleware } = require("../middlewares/authMiddlewares");

router.use(authMiddleware);

router.post("/", catagoryController.createCategory);
router.get("/", catagoryController.getAllCategories);
router.get("/:id", catagoryController.getCategoryById);
router.put("/:id", catagoryController.updateCategory);
router.delete("/:id", catagoryController.deleteCategory);

module.exports = router;
