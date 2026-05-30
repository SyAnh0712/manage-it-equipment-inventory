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
      paranoid: false,

      deletedAt: "deleted_at",
    },
  );

  return User;
};
