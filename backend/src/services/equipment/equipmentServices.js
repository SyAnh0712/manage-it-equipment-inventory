const db = require("../../models");
const { Op } = require("sequelize");
const { emitToAll } = require("../../utils/socket");

const Equipment = db.Equipment;

const createEquipment = async (equipmentData) => {
  try {
    const newEquipment = await Equipment.create(equipmentData);
    emitToAll("equipment:created", { equipment: newEquipment });
    emitToAll("notification", {
      type: "equipment",
      message: `Thiết bị ${newEquipment.name || "mới"} đã được tạo.`,
    });
    return newEquipment;
  } catch (error) {
    throw new Error("Error creating equipment: " + error.message);
  }
};

const getAllEquipment = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const search = (query.search || "").trim();

    const where = search
      ? {
          [Op.or]: [
            { code: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } },
            { unit: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Equipment.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
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
    throw new Error("Error fetching equipment: " + error.message);
  }
};

const getEquipmentById = async (id) => {
  try {
    const equipment = await Equipment.findByPk(id);
    return equipment;
  } catch (error) {
    throw new Error("Error fetching equipment: " + error.message);
  }
};

const updateEquipment = async (id, equipmentData) => {
  try {
    const equipment = await Equipment.findByPk(id);
    if (!equipment) {
      throw new Error("Equipment not found");
    }
    await equipment.update(equipmentData);
    emitToAll("equipment:updated", { equipment });
    emitToAll("notification", {
      type: "equipment",
      message: `Thiết bị ${equipment.name || equipment.id} đã được cập nhật.`,
    });
    return equipment;
  } catch (error) {
    throw new Error("Error updating equipment: " + error.message);
  }
};

const deleteEquipment = async (id) => {
  try {
    const equipment = await Equipment.findByPk(id);
    if (!equipment) {
      throw new Error("Equipment not found");
    }
    await equipment.destroy();
    emitToAll("equipment:deleted", { id });
    emitToAll("notification", {
      type: "equipment",
      message: `Thiết bị ${equipment.name || id} đã được xóa.`,
    });
    return { message: "Equipment deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting equipment: " + error.message);
  }
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};
