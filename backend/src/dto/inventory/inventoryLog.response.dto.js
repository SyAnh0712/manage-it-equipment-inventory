"use strict";

/**
 * Inventory Log Response DTOs
 *
 * Các hàm serialize dữ liệu InventoryLog trước khi trả về client.
 *
 * Đảm bảo:
 *  - Thông tin creator chỉ trả { id, username, full_name }.
 *  - Thông tin equipment chỉ trả { id, code, name }.
 *  - Loại bỏ deleted_at.
 */

/**
 * Serialize một InventoryLog entity thành response object.
 * @param {object} log - Sequelize InventoryLog instance hoặc plain object
 * @returns {object|null}
 */
const formatInventoryLog = (log) => {
  if (!log) return null;

  const data = log.toJSON ? log.toJSON() : { ...log };

  return {
    id: data.id,
    equipment_id: data.equipment_id,
    equipment: data.equipment
      ? {
          id: data.equipment.id,
          code: data.equipment.code,
          name: data.equipment.name,
        }
      : null,
    action_type: data.action_type,
    quantity_before: data.quantity_before,
    quantity_changed: data.quantity_changed,
    quantity_after: data.quantity_after,
    reference_code: data.reference_code ?? null,
    created_by: data.created_by,
    creator: data.creator
      ? {
          id: data.creator.id,
          username: data.creator.username,
          full_name: data.creator.full_name,
        }
      : null,
    created_at: data.created_at,
  };
};

/**
 * Serialize danh sách InventoryLog kèm thông tin phân trang.
 * @param {{ data: object[], pagination: object }} result
 * @returns {{ data: object[], pagination: object }}
 */
const formatInventoryLogList = ({ data, pagination }) => ({
  data: (data || []).map(formatInventoryLog),
  pagination,
});

module.exports = {
  formatInventoryLog,
  formatInventoryLogList,
};
