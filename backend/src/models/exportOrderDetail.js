"use strict";
const { Model } = require("sequelize");
module.exports = function defineExportOrderDetail(sequelize, DataTypes) {
  class ExportOrderDetail extends Model {
    static associate(models) {
      ExportOrderDetail.belongsTo(models.ExportOrder, {
        foreignKey: "export_order_id",
        as: "exportOrder",
      });
      ExportOrderDetail.belongsTo(models.Equipment, {
        foreignKey: "equipment_id",
        as: "equipment",
      });
    }
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
