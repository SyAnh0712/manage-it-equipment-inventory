const authService = require("../services/auth/authServices");
const { setAuthCookie, clearAuthCookie } = require("../utils/cookieHelper");

const login = async (req, res, next) => {
  try {
    const result = await authService.loginService(req.body);

    if (result.requires2FA) {
      return res.status(200).json({
        success: true,
        message: "Yêu cầu xác thực 2FA",
        data: {
          requires2FA: true,
          tempToken: result.tempToken,
        },
      });
    }

    setAuthCookie(res, result.token);

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: { user: result.user },
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.registerService(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: { email: result.email, otp: result.otp },
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Register failed",
    });
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyOtpService(req.body);

    setAuthCookie(res, result.token);

    return res.status(200).json({
      success: true,
      message: "Xác minh email thành công",
      data: { user: result.user },
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "OTP verification failed",
    });
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const result = await authService.resendOtpService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: { otp: result.otp },
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Resend OTP failed",
    });
  }
};

const verify2fa = async (req, res, next) => {
  try {
    const result = await authService.verify2faService(req.body);

    setAuthCookie(res, result.token);

    return res.status(200).json({
      success: true,
      message: "Xác thực 2FA thành công",
      data: { user: result.user },
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "2FA verification failed",
    });
  }
};

const setup2fa = async (req, res, next) => {
  try {
    const result = await authService.setup2faService(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Tạo mã 2FA thành công",
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "2FA setup failed",
    });
  }
};

const confirm2faSetup = async (req, res, next) => {
  try {
    const result = await authService.confirm2faSetupService(
      req.user.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Bật 2FA thành công",
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "2FA confirmation failed",
    });
  }
};

const disable2fa = async (req, res, next) => {
  try {
    await authService.disable2faService(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Tắt 2FA thành công",
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Disable 2FA failed",
    });
  }
};

const logout = async (req, res, next) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
};

const getMe = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

module.exports = {
  login,
  register,
  verifyOtp,
  resendOtp,
  verify2fa,
  setup2fa,
  confirm2faSetup,
  disable2fa,
  logout,
  getMe,
};
