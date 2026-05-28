const jwt = require("jsonwebtoken");

const { accessTokenSecret } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Chưa đăng nhập",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, accessTokenSecret);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      message: "Token không hợp lệ",
    });
  }
};

const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện thao tác này",
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
