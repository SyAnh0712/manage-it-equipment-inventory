const Joi = require("joi");
const { sendError } = require("../utils/responseHelper");
const { deleteUploadIfExists } = require("../utils/fileHelper");

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

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required(),
  full_name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const equipmentSchema = Joi.object({
  code: Joi.string().trim().max(50).required(),
  name: Joi.string().trim().min(2).max(150).required(),
  category_id: Joi.number().integer().positive().required(),
  supplier_id: Joi.number().integer().positive().required(),
  unit: Joi.string().trim().max(30).required(),
  quantity: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().allow("", null),
  image_url: Joi.string().uri().allow("", null).optional(),
});

const equipmentUpdateSchema = Joi.object({
  code: Joi.string().trim().max(50),
  name: Joi.string().trim().min(2).max(150),
  category_id: Joi.number().integer().positive(),
  supplier_id: Joi.number().integer().positive(),
  unit: Joi.string().trim().max(30),
  quantity: Joi.number().integer().min(0),
  price: Joi.number().min(0),
  description: Joi.string().allow("", null),
  image_url: Joi.string().uri().allow("", null),
}).min(1);

const supplierSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  phone: Joi.string().trim().max(30).allow("", null),
  email: Joi.string().email().allow("", null),
  address: Joi.string().trim().allow("", null),
  note: Joi.string().allow("", null),
});

const categorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().allow("", null),
  image_url: Joi.string().uri().allow("", null).optional(),
});

const categoryUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().allow("", null),
  image_url: Joi.string().uri().allow("", null),
}).min(1);

const createUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required(),
  full_name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid("admin", "staff").default("staff"),
});

const updateUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50),
  full_name: Joi.string().trim().min(2).max(100),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(100),
  role: Joi.string().valid("admin", "staff"),
}).min(1);

const updateProfileSchema = Joi.object({
  full_name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).max(100).required(),
  newPassword: Joi.string().min(6).max(100).required(),
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).max(100).required(),
});

const adjustInventorySchema = Joi.object({
  equipment_id: Joi.number().integer().positive().required(),
  quantity_change: Joi.number().integer().invalid(0).required(),
  reference_code: Joi.string().trim().max(50).optional(),
});

const importOrderSchema = Joi.object({
  code: Joi.string().trim().max(50).optional(),
  supplier_id: Joi.number().integer().positive().required(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
  note: Joi.string().allow("", null),
  details: Joi.array()
    .items(
      Joi.object({
        equipment_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).required(),
        unit_price: Joi.number().min(0).optional(),
      }),
    )
    .min(1)
    .required(),
});

const exportOrderSchema = Joi.object({
  code: Joi.string().trim().max(50).optional(),
  department: Joi.string().trim().min(2).max(100).required(),
  receiver: Joi.string().trim().min(2).max(100).required(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
  note: Joi.string().allow("", null),
  details: Joi.array()
    .items(
      Joi.object({
        equipment_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const resendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verify2faSchema = Joi.object({
  tempToken: Joi.string().required(),
  code: Joi.string().min(6).max(20).required(),
});

const confirm2faSetupSchema = Joi.object({
  code: Joi.string().length(6).required(),
  secret: Joi.string().required(),
});

const disable2faSchema = Joi.object({
  password: Joi.string().required(),
});

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
