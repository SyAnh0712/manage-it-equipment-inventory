"use strict";
const { Model } = require("sequelize");
module.exports = function defineExportOrder(sequelize, DataTypes) {
  class ExportOrder extends Model {
    static associate(models) {
      ExportOrder.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      ExportOrder.hasMany(models.ExportOrderDetail, {
        foreignKey: "export_order_id",
        as: "details",
      });
    }
  }
  ExportOrder.init(
    {
      code: DataTypes.STRING,
      department: DataTypes.STRING,
      receiver: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      note: DataTypes.TEXT,
      approved_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ExportOrder",
      tableName: "export_orders",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    },
  );
  return ExportOrder;
};
