const logger = require("../utils/logger");
const { sendError } = require("../utils/responseHelper");

const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;

  logger.error(`${req.method} ${req.originalUrl} -> ${err.message}`, {
    stack: err.stack,
    status,
  });

  return sendError(res, status, err.message || "Internal server error");
};

module.exports = errorMiddleware;
