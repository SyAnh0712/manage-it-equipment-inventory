const db = require("../../models");
const { Op } = require("sequelize");

const InventoryLog = db.InventoryLog;

const getAllInventoryLogs = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const search = (query.search || "").trim();

    const where = search
      ? {
          [Op.or]: [
            { action_type: { [Op.like]: `%${search}%` } },
            { reference_code: { [Op.like]: `%${search}%` } },
            { "$equipment.name$": { [Op.like]: `%${search}%` } },
            { "$equipment.code$": { [Op.like]: `%${search}%` } },
            { "$creator.username$": { [Op.like]: `%${search}%` } },
            { "$creator.full_name$": { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await InventoryLog.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
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

module.exports = {
  getAllInventoryLogs,
};
