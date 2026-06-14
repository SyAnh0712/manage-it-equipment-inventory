"use strict";

/**
 * Import Order Response DTOs
 *
 * Các hàm serialize dữ liệu ImportOrder trước khi trả về client.
 *
 * Đảm bảo:
 *  - Thông tin creator chỉ trả { id, username, full_name } — không lộ password, tokens.
 *  - Thông tin supplier trả đầy đủ các trường công khai.
 *  - Loại bỏ deleted_at.
 */

/**
 * Serialize thông tin creator (User) trong context đơn hàng.
 * @param {object|null} creator
 * @returns {object|null}
 */
const formatOrderCreator = (creator) => {
  if (!creator) return null;

  const data = creator.toJSON ? creator.toJSON() : { ...creator };

  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name,
  };
};

/**
 * Serialize thông tin supplier trong context đơn hàng.
 * @param {object|null} supplier
 * @returns {object|null}
 */
const formatOrderSupplier = (supplier) => {
  if (!supplier) return null;

  const data = supplier.toJSON ? supplier.toJSON() : { ...supplier };

  return {
    id: data.id,
    name: data.name,
    phone: data.phone ?? null,
    email: data.email ?? null,
  };
};

/**
 * Serialize chi tiết dòng trong phiếu nhập.
 * @param {object} detail
 * @returns {object}
 */
const formatImportOrderDetail = (detail) => {
  if (!detail) return null;

  const data = detail.toJSON ? detail.toJSON() : { ...detail };

  return {
    id: data.id,
    equipment_id: data.equipment_id,
    equipment: data.equipment
      ? {
          id: data.equipment.id,
          code: data.equipment.code,
          name: data.equipment.name,
          unit: data.equipment.unit,
        }
      : null,
    quantity: data.quantity,
    unit_price: data.unit_price,
  };
};

/**
 * Serialize một ImportOrder entity thành response object.
 * @param {object} order - Sequelize ImportOrder instance hoặc plain object
 * @returns {object|null}
 */
const formatImportOrder = (order) => {
  if (!order) return null;

  const data = order.toJSON ? order.toJSON() : { ...order };

  return {
    id: data.id,
    code: data.code,
    supplier_id: data.supplier_id,
    supplier: formatOrderSupplier(data.supplier),
    created_by: data.created_by,
    creator: formatOrderCreator(data.creator),
    status: data.status,
    note: data.note ?? null,
    approved_at: data.approved_at ?? null,
    details: Array.isArray(data.details)
      ? data.details.map(formatImportOrderDetail)
      : undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Serialize danh sách ImportOrder kèm thông tin phân trang.
 * @param {{ data: object[], pagination: object }} result
 * @returns {{ data: object[], pagination: object }}
 */
const formatImportOrderList = ({ data, pagination }) => ({
  data: (data || []).map(formatImportOrder),
  pagination,
});

module.exports = {
  formatImportOrder,
  formatImportOrderList,
};
