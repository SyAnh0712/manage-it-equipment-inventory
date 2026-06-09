const catagoryService = require("../services/equipment/categoryServices");
const { sendSuccess } = require("../utils/responseHelper");

const createCategory = async (req, res, next) => {
  try {
    const categoryData = {
      ...req.body,
      image_url: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image_url,
    };
    const category = await catagoryService.createCategory(categoryData);
    return sendSuccess(res, 201, "Category created successfully", category);
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await catagoryService.getAllCategories(req.query);
    return sendSuccess(res, 200, "Categories fetched successfully", categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await catagoryService.getCategoryById(categoryId);
    if (category) {
      return sendSuccess(res, 200, "Category fetched successfully", category);
    } else {
      const err = new Error("Category not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const categoryData = {
      ...req.body,
      image_url: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image_url,
    };
    const updatedCategory = await catagoryService.updateCategory(
      categoryId,
      categoryData,
    );
    if (updatedCategory) {
      return sendSuccess(
        res,
        200,
        "Category updated successfully",
        updatedCategory,
      );
    } else {
      const err = new Error("Category not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const result = await catagoryService.deleteCategory(categoryId);
    return sendSuccess(res, 200, "Category deleted successfully", result);
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
