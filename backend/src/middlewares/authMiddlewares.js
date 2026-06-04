const jwt = require("jsonwebtoken");
const db = require("../models");

const authMiddlewares = async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    if (user.is_locked) {
      return res.status(403).json({
        success: false,
        message: "Account is locked",
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_locked: user.is_locked,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddlewares;
