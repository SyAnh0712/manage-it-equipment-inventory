const express = require("express");

const router = express.Router();

const authController = require("../controllers/authControllers");
const {
  validate,
  loginSchema,
  registerSchema,
} = require("../middlewares/validationMiddleware");

router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);

module.exports = router;
