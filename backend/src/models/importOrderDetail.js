"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImportOrderDetail extends Model {
    static associate(models) {}
  }
  ImportOrderDetail.init(
    {
      importOrderId: DataTypes.INTEGER,
      equipmentId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      unitPrice: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "ImportOrderDetail",
    },
  );
  return ImportOrderDetail;
};
