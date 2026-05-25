"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExportOrderDetail extends Model {
    static associate(models) {}
  }
  ExportOrderDetail.init(
    {
      exportOrderId: DataTypes.INTEGER,
      equipmentId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ExportOrderDetail",
    },
  );
  return ExportOrderDetail;
};
