const userService = require("../services/user/userServices.js");

const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (user) {
      res.json({
        success: true,
        data: user,
      });
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
    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await userService.deleteUser(userId);
    res.json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
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
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
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
    res.json({
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const lockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // Prevent admin from locking themselves
    if (String(req.user?.id) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot lock your own account",
      });
    }

    const result = await userService.lockUser(userId);
    res.json({
      success: true,
      message: "User locked successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const unlockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await userService.unlockUser(userId);
    res.json({
      success: true,
      message: "User unlocked successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;
    const result = await userService.resetPassword(userId, newPassword);
    res.json({
      success: true,
      message: "Password reset successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: user,
    });
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
