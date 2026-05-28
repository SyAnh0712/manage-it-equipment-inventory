const catagoryService = require("../services/equipment/categoryServices");

const createCategory = async (req, res, nextHandler) => {
  try {
    const categoryData = req.body;
    const category = await catagoryService.createCategory(categoryData);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, nextHandler) => {
  try {
    const categories = await catagoryService.getAllCategories(req.query);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, nextHandler) => {
  try {
    const categoryId = req.params.id;
    const category = await catagoryService.getCategoryById(categoryId);
    if (category) {
      res.json(category);
    } else {
      const err = new Error("Category not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, nextHandler) => {
  try {
    const categoryId = req.params.id;
    const categoryData = req.body;
    const updatedCategory = await catagoryService.updateCategory(
      categoryId,
      categoryData,
    );
    if (updatedCategory) {
      res.json(updatedCategory);
    } else {
      const err = new Error("Category not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, nextHandler) => {
  try {
    const categoryId = req.params.id;
    const result = await catagoryService.deleteCategory(categoryId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
