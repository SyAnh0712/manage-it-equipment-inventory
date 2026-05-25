const authService = require("../services/auth/authServices");

const login = async (req, res) => {
  try {
    const result = await authService.loginService(req.body);

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const result = await authService.registerService(req.body);

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  login,
  register,
};
