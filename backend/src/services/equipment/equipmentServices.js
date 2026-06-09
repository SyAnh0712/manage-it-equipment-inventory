const db = require("../../models");
const { Op } = require("sequelize");
const { emitToAll } = require("../../utils/socket");
const { createError, rethrowServiceError } = require("../../utils/httpError");
const { deleteUploadIfExists } = require("../../utils/fileHelper");

const Equipment = db.Equipment;
const Category = db.Category;
const Supplier = db.Supplier;

const assertEquipmentRelations = async (equipmentData) => {
  if (equipmentData.category_id !== undefined) {
    const category = await Category.findByPk(equipmentData.category_id);
    if (!category) {
      throw createError("Category not found", 400);
    }
  }

  if (equipmentData.supplier_id !== undefined) {
    const supplier = await Supplier.findByPk(equipmentData.supplier_id);
    if (!supplier) {
      throw createError("Supplier not found", 400);
    }
  }
};

const createEquipment = async (equipmentData) => {
  try {
    await assertEquipmentRelations(equipmentData);
    const newEquipment = await Equipment.create(equipmentData);
    emitToAll("equipment:created", { equipment: newEquipment });
    emitToAll("notification", {
      type: "equipment",
      message: `Thiết bị ${newEquipment.name || "mới"} đã được tạo.`,
    });
    return newEquipment;
  } catch (error) {
    rethrowServiceError(error, "Error creating equipment");
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
      throw createError("Equipment not found", 404);
    }

    await assertEquipmentRelations(equipmentData);

    const previousImageUrl = equipment.image_url;
    await equipment.update(equipmentData);

    if (
      equipmentData.image_url &&
      previousImageUrl &&
      previousImageUrl !== equipmentData.image_url
    ) {
      await deleteUploadIfExists(previousImageUrl);
    }
    emitToAll("equipment:updated", { equipment });
    emitToAll("notification", {
      type: "equipment",
      message: `Thiết bị ${equipment.name || equipment.id} đã được cập nhật.`,
    });
    return equipment;
  } catch (error) {
    rethrowServiceError(error, "Error updating equipment");
  }
};

const deleteEquipment = async (id) => {
  try {
    const equipment = await Equipment.findByPk(id);
    if (!equipment) {
      throw createError("Equipment not found", 404);
    }

    const previousImageUrl = equipment.image_url;
    await equipment.destroy();

    if (previousImageUrl) {
      await deleteUploadIfExists(previousImageUrl);
    }
    emitToAll("equipment:deleted", { id });
    emitToAll("notification", {
      type: "equipment",
      message: `Thiết bị ${equipment.name || id} đã được xóa.`,
    });
    return { message: "Equipment deleted successfully" };
  } catch (error) {
    rethrowServiceError(error, "Error deleting equipment");
  }
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};
