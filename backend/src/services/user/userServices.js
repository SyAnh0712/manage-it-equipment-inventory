const db = require("../../models");

const User = db.User;

const createUser = async (userData) => {
  try {
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.findAll();

    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);

    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

const updateUser = async (id, userData) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    await user.update(userData);

    return user;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy();

    return {
      message: "User deleted successfully",
    };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
