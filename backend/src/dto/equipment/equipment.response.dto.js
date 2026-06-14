"use strict";

/**
 * Equipment Response DTOs
 *
 * Các hàm serialize dữ liệu Equipment trước khi trả về client.
 * Loại bỏ trường nội bộ: deleted_at.
 */

/**
 * Serialize một Equipment entity thành response object.
 * @param {object} equipment - Sequelize Equipment instance hoặc plain object
 * @returns {object|null}
 */
const formatEquipment = (equipment) => {
  if (!equipment) return null;

  const data = equipment.toJSON ? equipment.toJSON() : { ...equipment };

  return {
    id: data.id,
    code: data.code,
    name: data.name,
    category_id: data.category_id,
    supplier_id: data.supplier_id,
    unit: data.unit,
    quantity: data.quantity,
    price: data.price,
    image_url: data.image_url ?? null,
    description: data.description ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Serialize danh sách Equipment kèm thông tin phân trang.
 * @param {{ data: object[], pagination: object }} result
 * @returns {{ data: object[], pagination: object }}
 */
const formatEquipmentList = ({ data, pagination }) => ({
  data: (data || []).map(formatEquipment),
  pagination,
});

module.exports = {
  formatEquipment,
  formatEquipmentList,
};
