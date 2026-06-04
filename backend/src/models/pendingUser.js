"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PendingUser extends Model {
    static associate(models) {}
  }

  PendingUser.init(
    {
      username: DataTypes.STRING,
      full_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      otp_hash: DataTypes.STRING,
      otp_expires_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PendingUser",
      tableName: "pending_users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return PendingUser;
};
