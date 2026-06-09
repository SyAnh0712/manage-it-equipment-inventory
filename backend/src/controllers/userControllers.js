const userService = require("../services/user/userServices.js");
const { sendSuccess, sendError } = require("../utils/responseHelper");

const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    return sendSuccess(res, 201, "User created successfully", user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    return sendSuccess(res, 200, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (user) {
      return sendSuccess(res, 200, "User fetched successfully", user);
    } else {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = await userService.updateUser(userId, userData);
    return sendSuccess(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await userService.deleteUser(userId);
    return sendSuccess(res, 200, "User deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { full_name, email } = req.body;
    const result = await userService.updateUser(userId, {
      full_name,
      email,
    });
    return sendSuccess(res, 200, "Profile updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const result = await userService.changePassword(
      userId,
      oldPassword,
      newPassword,
    );
    return sendSuccess(res, 200, "Password changed successfully", result);
  } catch (error) {
    next(error);
  }
};

const lockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (String(req.user?.id) === String(userId)) {
      return sendError(res, 400, "You cannot lock your own account");
    }

    const result = await userService.lockUser(userId);
    return sendSuccess(res, 200, "User locked successfully", result);
  } catch (error) {
    next(error);
  }
};

const unlockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await userService.unlockUser(userId);
    return sendSuccess(res, 200, "User unlocked successfully", result);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;
    const result = await userService.resetPassword(userId, newPassword);
    return sendSuccess(res, 200, "Password reset successfully", result);
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    return sendSuccess(res, 200, "Current user fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateProfile,
  deleteUser,
  changePassword,
  lockUser,
  unlockUser,
  resetPassword,
  getCurrentUser,
};
