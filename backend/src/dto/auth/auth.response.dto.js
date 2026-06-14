"use strict";

/**
 * Auth Response DTOs
 *
 * Các hàm serialize dữ liệu người dùng trả về sau các thao tác xác thực
 * (login, register, refresh token, 2FA).
 *
 * Chỉ trả ra các trường cần thiết, không lộ thông tin nội bộ như
 * password, token_version, refresh_token_jti, two_factor_secret, recovery_codes.
 */

/**
 * Serialize thông tin user dùng cho các response xác thực.
 * @param {object} user - Sequelize User instance hoặc plain object
 * @returns {{ id, username, full_name, email, role, two_factor_enabled }}
 */
const formatAuthUser = (user) => {
  if (!user) return null;

  const data = user.toJSON ? user.toJSON() : { ...user };

  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    role: data.role,
    two_factor_enabled: data.two_factor_enabled ?? false,
  };
};

module.exports = {
  formatAuthUser,
};
