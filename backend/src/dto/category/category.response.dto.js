"use strict";

/**
 * Category Response DTOs
 *
 * Các hàm serialize dữ liệu Category trước khi trả về client.
 * Loại bỏ trường nội bộ: deleted_at.
 */

/**
 * Serialize một Category entity thành response object.
 * @param {object} category - Sequelize Category instance hoặc plain object
 * @returns {object|null}
 */
const formatCategory = (category) => {
  if (!category) return null;

  const data = category.toJSON ? category.toJSON() : { ...category };

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? null,
    image_url: data.image_url ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Serialize danh sách Category kèm thông tin phân trang.
 * @param {{ data: object[], pagination: object }} result
 * @returns {{ data: object[], pagination: object }}
 */
const formatCategoryList = ({ data, pagination }) => ({
  data: (data || []).map(formatCategory),
  pagination,
});

module.exports = {
  formatCategory,
  formatCategoryList,
};
