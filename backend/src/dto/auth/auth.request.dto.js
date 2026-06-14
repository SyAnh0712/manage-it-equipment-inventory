"use strict";

const Joi = require("joi");

/**
 * Auth Request DTOs
 *
 * Chứa các Joi schema dùng để validate dữ liệu đầu vào từ client
 * cho các endpoint xác thực (login, register, OTP, 2FA).
 */

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
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  verify2faSchema,
  confirm2faSetupSchema,
  disable2faSchema,
};
