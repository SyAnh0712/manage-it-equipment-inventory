const Joi = require("joi");

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        status: 400,
        errors: error.details.map((item) => item.message),
      });
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
  image_url: Joi.string().uri().optional(),
});

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

module.exports = {
  validate,
  loginSchema,
  registerSchema,
  equipmentSchema,
  supplierSchema,
  categorySchema,
  importOrderSchema,
  exportOrderSchema,
  adjustInventorySchema,
};
