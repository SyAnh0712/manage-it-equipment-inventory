const authService = require("../services/auth/authServices");
const { sendSuccess, sendError } = require("../utils/responseHelper");
const {
  setAuthCookie,
  setRefreshCookie,
  clearAuthCookie,
  clearRefreshCookie,
} = require("../utils/cookieHelper");

const login = async (req, res, next) => {
  try {
    const result = await authService.loginService(req.body);

    if (result.requires2FA) {
      return sendSuccess(res, 200, "Yêu cầu xác thực 2FA", {
        requires2FA: true,
        tempToken: result.tempToken,
      });
    }

    setAuthCookie(res, result.token);
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess(res, 200, "Đăng nhập thành công", { user: result.user });
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "Login failed");
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.registerService(req.body);

    return sendSuccess(res, 201, result.message, {
      email: result.email,
      otp: result.otp,
    });
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "Register failed");
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyOtpService(req.body);

    setAuthCookie(res, result.token);
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess(res, 200, "Xác minh email thành công", { user: result.user });
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "OTP verification failed");
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const result = await authService.resendOtpService(req.body);

    return sendSuccess(res, 200, result.message, { otp: result.otp });
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "Resend OTP failed");
  }
};

const verify2fa = async (req, res, next) => {
  try {
    const result = await authService.verify2faService(req.body);

    setAuthCookie(res, result.token);
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess(res, 200, "Xác thực 2FA thành công", { user: result.user });
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "2FA verification failed");
  }
};

const setup2fa = async (req, res, next) => {
  try {
    const result = await authService.setup2faService(req.user.id);

    return sendSuccess(res, 200, "Tạo mã 2FA thành công", result);
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "2FA setup failed");
  }
};

const confirm2faSetup = async (req, res, next) => {
  try {
    const result = await authService.confirm2faSetupService(
      req.user.id,
      req.body,
    );

    return sendSuccess(res, 200, "Bật 2FA thành công", result);
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "2FA confirmation failed");
  }
};

const disable2fa = async (req, res, next) => {
  try {
    await authService.disable2faService(req.user.id, req.body);

    return sendSuccess(res, 200, "Tắt 2FA thành công");
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "Disable 2FA failed");
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await authService.refreshTokenService(
      req.cookies?.refresh_token || req.body?.refreshToken,
    );

    setAuthCookie(res, result.token);
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess(res, 200, "Refresh token thành công", { user: result.user });
  } catch (error) {
    return sendError(res, error.status || 400, error.message || "Refresh token failed");
  }
};

const logout = async (req, res, next) => {
  clearAuthCookie(res);
  clearRefreshCookie(res);

  return sendSuccess(res, 200, "Đăng xuất thành công");
};

const getMe = async (req, res, next) => {
  return sendSuccess(res, 200, "User profile fetched successfully", { user: req.user });
};

module.exports = {
  login,
  register,
  verifyOtp,
  resendOtp,
  verify2fa,
  refresh,
  setup2fa,
  confirm2faSetup,
  disable2fa,
  logout,
  getMe,
};
