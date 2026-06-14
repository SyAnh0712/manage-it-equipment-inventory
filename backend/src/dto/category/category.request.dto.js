"use strict";

const Joi = require("joi");

/**
 * Category Request DTOs
 *
 * Chứa các Joi schema dùng để validate dữ liệu đầu vào từ client
 * cho các endpoint quản lý danh mục thiết bị.
 */

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

module.exports = {
  categorySchema,
  categoryUpdateSchema,
};
