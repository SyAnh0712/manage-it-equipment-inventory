"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImportOrderDetail extends Model {
    static associate(models) {}
  }
  ImportOrderDetail.init(
    {
      import_order_id: DataTypes.INTEGER,
      equipment_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      unit_price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "ImportOrderDetail",
    },
  );
  return ImportOrderDetail;
};
