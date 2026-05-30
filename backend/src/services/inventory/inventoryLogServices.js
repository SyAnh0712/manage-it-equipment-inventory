const db = require("../../models");
const { Op } = require("sequelize");

const InventoryLog = db.InventoryLog;
const Equipment = db.Equipment;

const generateAdjustCode = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ADJ-${yyyy}${mm}${dd}-${random}`;
};

const buildDateRangeFilter = (dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) {
    return {};
  }

  const range = {};
  if (dateFrom) {
    range[Op.gte] = new Date(`${dateFrom}T00:00:00`);
  }
  if (dateTo) {
    range[Op.lte] = new Date(`${dateTo}T23:59:59`);
  }

  return { created_at: range };
};

const getAllInventoryLogs = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const search = (query.search || "").trim();
    const actionType = (query.action_type || "").trim();

    const where = {
      ...buildDateRangeFilter(query.date_from, query.date_to),
    };

    if (actionType && ["import", "export", "adjust"].includes(actionType)) {
      where.action_type = actionType;
    }

    if (search) {
      where[Op.or] = [
        { action_type: { [Op.like]: `%${search}%` } },
        { reference_code: { [Op.like]: `%${search}%` } },
        { "$equipment.name$": { [Op.like]: `%${search}%` } },
        { "$equipment.code$": { [Op.like]: `%${search}%` } },
        { "$creator.username$": { [Op.like]: `%${search}%` } },
        { "$creator.full_name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await InventoryLog.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
      subQuery: false,
      distinct: true,
      include: [
        {
          model: db.Equipment,
          as: "equipment",
          attributes: ["id", "code", "name"],
          required: false,
        },
        {
          model: db.User,
          as: "creator",
          attributes: ["id", "username", "full_name"],
          required: false,
        },
      ],
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    throw new Error("Error fetching inventory logs: " + error.message);
  }
};

const adjustInventory = async (adjustData, userId) => {
  try {
    const equipmentId = adjustData.equipment_id;
    const quantityChange = Number(adjustData.quantity_change);

    if (!equipmentId) {
      throw new Error("Thiếu equipment_id");
    }

    if (!Number.isFinite(quantityChange) || quantityChange === 0) {
      throw new Error("Số lượng điều chỉnh phải khác 0");
    }

    const result = await db.sequelize.transaction(async (transaction) => {
      const equipment = await Equipment.findByPk(equipmentId, { transaction });
      if (!equipment) {
        throw new Error(`Không tìm thấy thiết bị với id ${equipmentId}`);
      }

      const quantityBefore = Number(equipment.quantity || 0);
      const quantityAfter = quantityBefore + quantityChange;

      if (quantityAfter < 0) {
        throw new Error(
          `Số lượng sau điều chỉnh không được âm (hiện tại: ${quantityBefore})`,
        );
      }

      await equipment.update({ quantity: quantityAfter }, { transaction });

      const log = await InventoryLog.create(
        {
          equipment_id: equipmentId,
          action_type: "adjust",
          quantity_before: quantityBefore,
          quantity_changed: quantityChange,
          quantity_after: quantityAfter,
          reference_code: adjustData.reference_code || generateAdjustCode(),
          created_by: userId || null,
        },
        { transaction },
      );

      return log;
    });

    return result;
  } catch (error) {
    throw new Error("Error adjusting inventory: " + error.message);
  }
};

module.exports = {
  getAllInventoryLogs,
  adjustInventory,
};
