const { sendError } = require("../utils/responseHelper");
const { deleteUploadIfExists } = require("../utils/fileHelper");

/**
 * Validation Middleware
 *
 * File này chứa hàm validate() dùng chung cho toàn bộ routes và
 * re-export tất cả Joi schemas từ các Request DTO files.
 *
 * Các schemas được định nghĩa tại src/dto/<domain>/<domain>.request.dto.js
 * và được re-export ở đây để routes không cần thay đổi import path.
 */

const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      if (req.file?.filename) {
        try {
          await deleteUploadIfExists(`/uploads/${req.file.filename}`);
        } catch {
          // Ignore cleanup errors so validation response still returns.
        }
      }

      return sendError(
        res,
        400,
        "Dữ liệu không hợp lệ",
        error.details.map((item) => item.message),
      );
    }

    req[source] = value;
    next();
  };
};

// --- Re-export Request DTO schemas (backward-compatible) ---

const {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  verify2faSchema,
  confirm2faSetupSchema,
  disable2faSchema,
} = require("../dto/auth/auth.request.dto");

const {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema,
  resetPasswordSchema,
} = require("../dto/user/user.request.dto");

const {
  equipmentSchema,
  equipmentUpdateSchema,
} = require("../dto/equipment/equipment.request.dto");

const {
  categorySchema,
  categoryUpdateSchema,
} = require("../dto/category/category.request.dto");

const { supplierSchema } = require("../dto/supplier/supplier.request.dto");

const {
  importOrderSchema,
} = require("../dto/order/importOrder.request.dto");

const {
  exportOrderSchema,
} = require("../dto/order/exportOrder.request.dto");

const {
  adjustInventorySchema,
} = require("../dto/inventory/inventoryLog.request.dto");

module.exports = {
  validate,
  loginSchema,
  registerSchema,
  equipmentSchema,
  equipmentUpdateSchema,
  supplierSchema,
  categorySchema,
  categoryUpdateSchema,
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema,
  resetPasswordSchema,
  importOrderSchema,
  exportOrderSchema,
  adjustInventorySchema,
  verifyOtpSchema,
  resendOtpSchema,
  verify2faSchema,
  confirm2faSetupSchema,
  disable2faSchema,
};
