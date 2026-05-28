const equipmentService = require("../services/equipment/equipmentServices");

const createEquipment = async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
};

const getAllEquipment = async (req, res) => {
  try {
    const equipment = await equipmentService.getAllEquipment(req.query);
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEquipmentById = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const equipment = await equipmentService.getEquipmentById(equipmentId);
    if (equipment) {
      res.json(equipment);
    } else {
      res.status(404).json({ error: "Equipment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEquipment = async (req, res) => {
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
      res.status(404).json({ error: "Equipment not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const result = await equipmentService.deleteEquipment(equipmentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};
