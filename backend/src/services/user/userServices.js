const db = require("../../models");
const { Op } = require("sequelize");
const { hashPassword, comparePassword } = require("../../utils/passwordHelper");
const { emitToUser } = require("../../utils/socket");

const User = db.User;

const removePasswordField = (user) => {
  if (!user) {
    return user;
  }

  const sanitized = user.toJSON ? user.toJSON() : { ...user };
  delete sanitized.password;
  return sanitized;
};

const createUser = async (userData) => {
  try {
    const payload = { ...userData };
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    const newUser = await User.create(payload);

    return removePasswordField(newUser);
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

const getAllUsers = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const search = (query.search || "").trim();

    const where = search
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { full_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["password"] },
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
    throw new Error("Error fetching users: " + error.message);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

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

    const payload = { ...userData };
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    } else {
      delete payload.password;
    }

    await user.update(payload);

    return removePasswordField(user);
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

const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    if (!oldPassword || !newPassword) {
      throw new Error("Old password and new password are required");
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Old password is incorrect");
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({ password: hashedPassword });

    return removePasswordField(user);
  } catch (error) {
    throw new Error("Error changing password: " + error.message);
  }
};

const lockUser = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ is_locked: true });
    emitToUser(user.id, "user:locked", {
      user: { id: user.id, is_locked: true },
      message: "Tài khoản của bạn đã bị khóa.",
    });

    return removePasswordField(user);
  } catch (error) {
    throw new Error("Error locking user: " + error.message);
  }
};

const unlockUser = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ is_locked: false });
    emitToUser(user.id, "user:unlocked", {
      user: { id: user.id, is_locked: false },
      message: "Tài khoản của bạn đã được mở khóa.",
    });

    return removePasswordField(user);
  } catch (error) {
    throw new Error("Error unlocking user: " + error.message);
  }
};

const resetPassword = async (id, newPassword) => {
  try {
    if (!newPassword) {
      throw new Error("New password is required");
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({ password: hashedPassword });

    return removePasswordField(user);
  } catch (error) {
    throw new Error("Error resetting password: " + error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  lockUser,
  unlockUser,
  resetPassword,
};
