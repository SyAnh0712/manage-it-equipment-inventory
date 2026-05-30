const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const rethrowServiceError = (error, prefix) => {
  if (error.status) {
    throw error;
  }
  throw new Error(`${prefix}: ${error.message}`);
};

module.exports = {
  createError,
  rethrowServiceError,
};
