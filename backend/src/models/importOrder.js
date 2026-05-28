"use strict";
const { Model } = require("sequelize");
module.exports = function defineImportOrder(sequelize, DataTypes) {
  class ImportOrder extends Model {
    static associate(models) {
      ImportOrder.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
        as: "supplier",
      });
      ImportOrder.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      ImportOrder.hasMany(models.ImportOrderDetail, {
        foreignKey: "import_order_id",
        as: "details",
      });
    }
  }
  ImportOrder.init(
    {
      code: DataTypes.STRING,
      supplier_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      status: DataTypes.ENUM("pending", "approved", "rejected"),
      note: DataTypes.TEXT,
      approved_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ImportOrder",
      tableName: "import_orders",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  return ImportOrder;
};
