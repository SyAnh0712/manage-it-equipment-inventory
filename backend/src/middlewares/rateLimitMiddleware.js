const rateLimit = require("express-rate-limit");
const { sendError } = require("../utils/responseHelper");

const rateLimitHandler = (req, res) => {
  return sendError(
    res,
    429,
    "Quá nhiều yêu cầu, vui lòng thử lại sau",
  );
};

const createLimiter = (max, windowMs) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
  });

const authWindowMs =
  Number.parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || "900000", 10) ||
  900000;
const authMax =
  Number.parseInt(process.env.RATE_LIMIT_AUTH_MAX || "10", 10) || 10;
const otpMax =
  Number.parseInt(process.env.RATE_LIMIT_OTP_MAX || "10", 10) || 10;
const resendOtpMax =
  Number.parseInt(process.env.RATE_LIMIT_RESEND_OTP_MAX || "5", 10) || 5;

const loginRateLimiter = createLimiter(authMax, authWindowMs);
const verifyOtpRateLimiter = createLimiter(otpMax, authWindowMs);
const resendOtpRateLimiter = createLimiter(resendOtpMax, authWindowMs);
const verify2faRateLimiter = createLimiter(authMax, authWindowMs);

module.exports = {
  rateLimitHandler,
  loginRateLimiter,
  verifyOtpRateLimiter,
  resendOtpRateLimiter,
  verify2faRateLimiter,
};
