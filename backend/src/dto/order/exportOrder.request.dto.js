"use strict";

const Joi = require("joi");

/**
 * Export Order Request DTOs
 *
 * Chứa Joi schema dùng để validate dữ liệu đầu vào từ client
 * cho các endpoint quản lý phiếu xuất kho.
 */

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
  exportOrderSchema,
};
