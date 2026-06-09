const multer = require("multer");
const logger = require("../utils/logger");
const { sendError } = require("../utils/responseHelper");
const { deleteUploadIfExists } = require("../utils/fileHelper");

const resolveErrorStatus = (err) => {
  if (err.status) {
    return err.status;
  }

  if (err instanceof multer.MulterError) {
    return 400;
  }

  if (err.message === "Only image files are allowed") {
    return 400;
  }

  return 500;
};

const resolveErrorMessage = (err) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return "File size exceeds 5MB limit";
  }

  return err.message || "Internal server error";
};

const errorMiddleware = async (err, req, res, next) => {
  const status = resolveErrorStatus(err);
  const message = resolveErrorMessage(err);

  if (req.file?.filename) {
    try {
      await deleteUploadIfExists(`/uploads/${req.file.filename}`);
    } catch (cleanupError) {
      logger.error("Failed to cleanup uploaded file after error", {
        message: cleanupError.message,
      });
    }
  }

  logger.error(`${req.method} ${req.originalUrl} -> ${message}`, {
    stack: err.stack,
    status,
  });

  return sendError(res, status, message);
};

module.exports = errorMiddleware;
