const express = require("express");
const router = express.Router();

const authController = require("../controllers/authControllers");
const authMiddlewares = require("../middlewares/authMiddlewares");
const {
  validate,
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  verify2faSchema,
  confirm2faSetupSchema,
  disable2faSchema,
} = require("../middlewares/validationMiddleware");
const {
  loginRateLimiter,
  verifyOtpRateLimiter,
  resendOtpRateLimiter,
  verify2faRateLimiter,
} = require("../middlewares/rateLimitMiddleware");

router.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  authController.login,
);
router.post("/register", validate(registerSchema), authController.register);
router.post(
  "/verify-otp",
  verifyOtpRateLimiter,
  validate(verifyOtpSchema),
  authController.verifyOtp,
);
router.post(
  "/resend-otp",
  resendOtpRateLimiter,
  validate(resendOtpSchema),
  authController.resendOtp,
);
router.post(
  "/verify-2fa",
  verify2faRateLimiter,
  validate(verify2faSchema),
  authController.verify2fa,
);
router.post("/refresh", authController.refresh);
router.post("/setup-2fa", authMiddlewares, authController.setup2fa);
router.post(
  "/confirm-2fa-setup",
  authMiddlewares,
  validate(confirm2faSetupSchema),
  authController.confirm2faSetup,
);
router.post(
  "/disable-2fa",
  authMiddlewares,
  validate(disable2faSchema),
  authController.disable2fa,
);
router.post("/logout", authController.logout);
router.get("/me", authMiddlewares, authController.getMe);

module.exports = router;
