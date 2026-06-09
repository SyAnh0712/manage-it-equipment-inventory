const db = require("../../models");
const { Op } = require("sequelize");
const { createError, rethrowServiceError } = require("../../utils/httpError");
const { deleteUploadIfExists } = require("../../utils/fileHelper");

const Category = db.Category;

const createCategory = async (categoryData) => {
  try {
    const newCategory = await Category.create(categoryData);
    return newCategory;
  } catch (error) {
    throw new Error("Error creating category: " + error.message);
  }
};

const getAllCategories = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const search = (query.search || "").trim();

    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Category.findAndCountAll({
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
    throw new Error("Error fetching categories: " + error.message);
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await Category.findByPk(id);
    return category;
  } catch (error) {
    throw new Error("Error fetching category: " + error.message);
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw createError("Category not found", 404);
    }

    const previousImageUrl = category.image_url;
    await category.update(categoryData);

    if (
      categoryData.image_url &&
      previousImageUrl &&
      previousImageUrl !== categoryData.image_url
    ) {
      await deleteUploadIfExists(previousImageUrl);
    }

    return category;
  } catch (error) {
    rethrowServiceError(error, "Error updating category");
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw createError("Category not found", 404);
    }

    const previousImageUrl = category.image_url;
    await category.destroy();

    if (previousImageUrl) {
      await deleteUploadIfExists(previousImageUrl);
    }

    return { message: "Category deleted successfully" };
  } catch (error) {
    rethrowServiceError(error, "Error deleting category");
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
