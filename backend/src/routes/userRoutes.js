const express = require("express");

const router = express.Router();

const userController = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  validate,
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema,
  resetPasswordSchema,
} = require("../middlewares/validationMiddleware");

router.use(authMiddleware);

router.get("/profile/current", userController.getCurrentUser);
router.put(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile,
);
router.put(
  "/profile/change-password",
  validate(changePasswordSchema),
  userController.changePassword,
);

router.post(
  "/",
  roleMiddleware("admin"),
  validate(createUserSchema),
  userController.createUser,
);
router.get("/", roleMiddleware("admin"), userController.getAllUsers);
router.get("/:id", roleMiddleware("admin"), userController.getUserById);
router.put(
  "/:id",
  roleMiddleware("admin"),
  validate(updateUserSchema),
  userController.updateUser,
);
router.delete("/:id", roleMiddleware("admin"), userController.deleteUser);
router.post("/:id/lock", roleMiddleware("admin"), userController.lockUser);
router.post("/:id/unlock", roleMiddleware("admin"), userController.unlockUser);
router.post(
  "/:id/reset-password",
  roleMiddleware("admin"),
  validate(resetPasswordSchema),
  userController.resetPassword,
);

module.exports = router;
