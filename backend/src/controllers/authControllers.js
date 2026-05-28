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
    next(error);
  }
};

const register = async (req, res, nextHandler) => {
  try {
    const result = await authService.registerService(req.body);

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  login,
  register,
};
