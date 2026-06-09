"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }

  User.init(
    {
      username: DataTypes.STRING,

      password: DataTypes.STRING,

      full_name: DataTypes.STRING,

      email: DataTypes.STRING,

      role: DataTypes.ENUM("admin", "staff"),

      is_locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      two_factor_secret: DataTypes.STRING,

      recovery_codes: DataTypes.TEXT,

      token_version: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      refresh_token_jti: DataTypes.STRING,
    },
    {
      sequelize,

      modelName: "User",

      tableName: "users",

      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    },
  );

  return User;
};
