"use strict";

const Joi = require("joi");

/**
 * Inventory Log Request DTOs
 *
 * Chứa Joi schema dùng để validate dữ liệu đầu vào từ client
 * cho các endpoint quản lý lịch sử kho (điều chỉnh tồn kho).
 */

const adjustInventorySchema = Joi.object({
  equipment_id: Joi.number().integer().positive().required(),
  quantity_change: Joi.number().integer().invalid(0).required(),
  reference_code: Joi.string().trim().max(50).optional(),
});

module.exports = {
  adjustInventorySchema,
};
