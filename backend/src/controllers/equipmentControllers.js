const equipmentService = require("../services/equipment/equipmentServices");

const createEquipment = async (req, res, nextHandler) => {
  try {
    const equipmentData = {
      ...req.body,
      image_url: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image_url,
    };
    const equipment = await equipmentService.createEquipment(equipmentData);
    res.status(201).json(equipment);
  } catch (error) {
    next(error);
  }
};

const getAllEquipment = async (req, res, nextHandler) => {
  try {
    const equipment = await equipmentService.getAllEquipment(req.query);
    res.json(equipment);
  } catch (error) {
    next(error);
  }
};

const getEquipmentById = async (req, res, nextHandler) => {
  try {
    const equipmentId = req.params.id;
    const equipment = await equipmentService.getEquipmentById(equipmentId);
    if (equipment) {
      res.json(equipment);
    } else {
      const err = new Error("Equipment not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const updateEquipment = async (req, res, nextHandler) => {
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
      res.json(updatedEquipment);
    } else {
      const err = new Error("Equipment not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const deleteEquipment = async (req, res, nextHandler) => {
  try {
    const equipmentId = req.params.id;
    const result = await equipmentService.deleteEquipment(equipmentId);
    res.json(result);
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
