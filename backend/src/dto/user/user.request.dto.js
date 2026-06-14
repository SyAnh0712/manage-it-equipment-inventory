"use strict";

const Joi = require("joi");

/**
 * User Request DTOs
 *
 * Chứa các Joi schema dùng để validate dữ liệu đầu vào từ client
 * cho các endpoint quản lý người dùng.
 */

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

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema,
  resetPasswordSchema,
};
