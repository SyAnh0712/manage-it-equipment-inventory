const db = require("../../models");

const Equipment = db.Equipment;

const createEquipment = async (equipmentData) => {
  try {
    const newEquipment = await Equipment.create(equipmentData);
    return newEquipment;
  } catch (error) {
    throw new Error("Error creating equipment: " + error.message);
  }
};

const getAllEquipment = async () => {
  try {
    const equipment = await Equipment.findAll();
    return equipment;
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
