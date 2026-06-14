"use strict";

/**
 * User Response DTOs
 *
 * Các hàm serialize dữ liệu User trước khi trả về client.
 *
 * Loại bỏ các trường nội bộ/nhạy cảm:
 *   - password        (hash mật khẩu)
 *   - two_factor_secret  (secret TOTP đã mã hoá)
 *   - recovery_codes  (recovery codes đã hash)
 *   - token_version   (dùng để thu hồi token)
 *   - refresh_token_jti (JWT ID của refresh token)
 *   - deleted_at      (soft-delete timestamp nội bộ)
 */

/**
 * Serialize một User entity thành response object an toàn.
 * @param {object} user - Sequelize User instance hoặc plain object
 * @returns {object|null}
 */
const formatUser = (user) => {
  if (!user) return null;

  const data = user.toJSON ? user.toJSON() : { ...user };

  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    role: data.role,
    is_locked: data.is_locked ?? false,
    two_factor_enabled: data.two_factor_enabled ?? false,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Serialize danh sách User kèm thông tin phân trang.
 * @param {{ data: object[], pagination: object }} result
 * @returns {{ data: object[], pagination: object }}
 */
const formatUserList = ({ data, pagination }) => ({
  data: (data || []).map(formatUser),
  pagination,
});

module.exports = {
  formatUser,
  formatUserList,
};
