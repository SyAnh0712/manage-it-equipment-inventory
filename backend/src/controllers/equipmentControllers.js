const equipmentService = require("../services/equipment/equipmentServices");
const { sendSuccess } = require("../utils/responseHelper");

const createEquipment = async (req, res, next) => {
  try {
    const equipmentData = {
      ...req.body,
      image_url: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image_url,
    };
    const equipment = await equipmentService.createEquipment(equipmentData);
    return sendSuccess(res, 201, "Equipment created successfully", equipment);
  } catch (error) {
    next(error);
  }
};

const getAllEquipment = async (req, res, next) => {
  try {
    const equipment = await equipmentService.getAllEquipment(req.query);
    return sendSuccess(res, 200, "Equipment fetched successfully", equipment);
  } catch (error) {
    next(error);
  }
};

const getEquipmentById = async (req, res, next) => {
  try {
    const equipmentId = req.params.id;
    const equipment = await equipmentService.getEquipmentById(equipmentId);
    if (equipment) {
      return sendSuccess(res, 200, "Equipment fetched successfully", equipment);
    } else {
      const err = new Error("Equipment not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const updateEquipment = async (req, res, next) => {
  try {
    const equipmentId = req.params.id;
    const equipmentData = {
      ...req.body,
      image_url: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image_url,
    };
    const updatedEquipment = await equipmentService.updateEquipment(
      equipmentId,
      equipmentData,
    );
    if (updatedEquipment) {
      return sendSuccess(
        res,
        200,
        "Equipment updated successfully",
        updatedEquipment,
      );
    } else {
      const err = new Error("Equipment not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const deleteEquipment = async (req, res, next) => {
  try {
    const equipmentId = req.params.id;
    const result = await equipmentService.deleteEquipment(equipmentId);
    return sendSuccess(res, 200, "Equipment deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};
