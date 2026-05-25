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
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "staff"),
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ExportOrder",
    },
  );
  return ExportOrder;
};
