const jwt = require("jsonwebtoken");
const db = require("../models");
const { accessTokenSecret } = require("../config/jwt");
const { sendError } = require("../utils/responseHelper");

const authMiddlewares = async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return sendError(res, 401, "Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, accessTokenSecret);

    if (decoded.purpose) {
      return sendError(res, 401, "Invalid token");
    }

    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      return sendError(res, 401, "Unauthorized: User not found");
    }

    if (user.is_locked) {
      return sendError(res, 403, "Account is locked");
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
      return sendError(res, 401, "Token expired");
    }

    return sendError(res, 401, "Invalid token");
  }
};

module.exports = authMiddlewares;
