"use strict";

const Joi = require("joi");

/**
 * Import Order Request DTOs
 *
 * Chứa Joi schema dùng để validate dữ liệu đầu vào từ client
 * cho các endpoint quản lý phiếu nhập kho.
 */

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

module.exports = {
  importOrderSchema,
};
