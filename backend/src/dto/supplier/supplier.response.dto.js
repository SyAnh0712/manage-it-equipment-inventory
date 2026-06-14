"use strict";

/**
 * Supplier Response DTOs
 *
 * Các hàm serialize dữ liệu Supplier trước khi trả về client.
 * Loại bỏ trường nội bộ: deleted_at.
 */

/**
 * Serialize một Supplier entity thành response object.
 * @param {object} supplier - Sequelize Supplier instance hoặc plain object
 * @returns {object|null}
 */
const formatSupplier = (supplier) => {
  if (!supplier) return null;

  const data = supplier.toJSON ? supplier.toJSON() : { ...supplier };

  return {
    id: data.id,
    name: data.name,
    phone: data.phone ?? null,
    email: data.email ?? null,
    address: data.address ?? null,
    note: data.note ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Serialize danh sách Supplier kèm thông tin phân trang.
 * @param {{ data: object[], pagination: object }} result
 * @returns {{ data: object[], pagination: object }}
 */
const formatSupplierList = ({ data, pagination }) => ({
  data: (data || []).map(formatSupplier),
  pagination,
});

module.exports = {
  formatSupplier,
  formatSupplierList,
};
