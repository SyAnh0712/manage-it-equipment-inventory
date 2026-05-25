"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InventoryLog extends Model {
    static associate(models) {}
  }
  InventoryLog.init(
    {
      equipment_id: DataTypes.INTEGER,
      action_type: DataTypes.ENUM("import", "export", "adjust"),
      quantity_before: DataTypes.INTEGER,
      quantity_changed: DataTypes.INTEGER,
      quantity_after: DataTypes.INTEGER,
      reference_code: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "InventoryLog",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  return InventoryLog;
};
