"use strict";

const Joi = require("joi");

/**
 * Supplier Request DTOs
 *
 * Chứa Joi schema dùng để validate dữ liệu đầu vào từ client
 * cho các endpoint quản lý nhà cung cấp.
 */

const supplierSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  phone: Joi.string().trim().max(30).allow("", null),
  email: Joi.string().email().allow("", null),
  address: Joi.string().trim().allow("", null),
  note: Joi.string().allow("", null),
});

module.exports = {
  supplierSchema,
};
