const db = require("../../models");
const { Op } = require("sequelize");

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
      throw new Error("Category not found");
    }
    await category.update(categoryData);
    return category;
  } catch (error) {
    throw new Error("Error updating category: " + error.message);
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error("Category not found");
    }
    await category.destroy();
    return { message: "Category deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting category: " + error.message);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
