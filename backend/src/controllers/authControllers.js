const authService = require("../services/auth/authServices");

const login = async (req, res, nextHandler) => {
  try {
    const result = await authService.loginService(req.body);

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: result,
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
      message: "Đăng ký thành công",
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Register failed",
    });
  }
};
module.exports = {
  login,
  register,
};
