"use strict";
const { Model } = require("sequelize");
module.exports = function defineImportOrderDetail(sequelize, DataTypes) {
  class ImportOrderDetail extends Model {
    static associate(models) {
      ImportOrderDetail.belongsTo(models.ImportOrder, {
        foreignKey: "import_order_id",
        as: "importOrder",
      });
      ImportOrderDetail.belongsTo(models.Equipment, {
        foreignKey: "equipment_id",
        as: "equipment",
      });
    }
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
      tableName: "import_order_details",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    },
  );
  return ImportOrderDetail;
};
