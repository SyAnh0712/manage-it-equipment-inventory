const { sendError } = require("../utils/responseHelper");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return sendError(res, 401, "Unauthorized: No user found");
      }

      if (!allowedRoles.includes(user.role)) {
        return sendError(
          res,
          403,
          `Forbidden: This action requires one of these roles: ${allowedRoles.join(", ")}`,
        );
      }

      next();
    } catch (error) {
      return sendError(res, 500, "Error verifying role");
    }
  };
};

module.exports = roleMiddleware;
