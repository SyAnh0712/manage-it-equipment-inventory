const express = require("express");

const router = express.Router();

const userController = require("../controllers/userControllers");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddlewares");

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
