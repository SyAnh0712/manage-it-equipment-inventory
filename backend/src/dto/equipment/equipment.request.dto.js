"use strict";

const Joi = require("joi");

/**
 * Equipment Request DTOs
 *
 * Chứa các Joi schema dùng để validate dữ liệu đầu vào từ client
 * cho các endpoint quản lý thiết bị.
 */

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

module.exports = {
  equipmentSchema,
  equipmentUpdateSchema,
};
