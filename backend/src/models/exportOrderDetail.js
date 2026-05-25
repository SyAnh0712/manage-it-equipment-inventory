"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExportOrderDetail extends Model {
    static associate(models) {}
  }
  ExportOrderDetail.init(
    {
      export_order_id: DataTypes.INTEGER,
      equipment_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ExportOrderDetail",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  return ExportOrderDetail;
};
