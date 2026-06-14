"use strict";

/**
 * Export Order Response DTOs
 *
 * Các hàm serialize dữ liệu ExportOrder trước khi trả về client.
 *
 * Đảm bảo:
 *  - Thông tin creator chỉ trả { id, username, full_name } — không lộ password, tokens.
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
 * Serialize chi tiết dòng trong phiếu xuất.
 * @param {object} detail
 * @returns {object|null}
 */
const formatExportOrderDetail = (detail) => {
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
  };
};

/**
 * Serialize một ExportOrder entity thành response object.
 * @param {object} order - Sequelize ExportOrder instance hoặc plain object
 * @returns {object|null}
 */
const formatExportOrder = (order) => {
  if (!order) return null;

  const data = order.toJSON ? order.toJSON() : { ...order };

  return {
    id: data.id,
    code: data.code,
    department: data.department,
    receiver: data.receiver,
    created_by: data.created_by,
    creator: formatOrderCreator(data.creator),
    status: data.status,
    note: data.note ?? null,
    approved_at: data.approved_at ?? null,
    details: Array.isArray(data.details)
      ? data.details.map(formatExportOrderDetail)
      : undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Serialize danh sách ExportOrder kèm thông tin phân trang.
 * @param {{ data: object[], pagination: object }} result
 * @returns {{ data: object[], pagination: object }}
 */
const formatExportOrderList = ({ data, pagination }) => ({
  data: (data || []).map(formatExportOrder),
  pagination,
});

module.exports = {
  formatExportOrder,
  formatExportOrderList,
};
