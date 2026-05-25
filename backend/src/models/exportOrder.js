"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExportOrder extends Model {
    static associate(models) {}
  }
  ExportOrder.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      email: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "staff"),
    },
    {
      sequelize,
      modelName: "ExportOrder",
      deletedAt: "deleted_at",
      paranoid: true,
    },
  );
  return ExportOrder;
};
