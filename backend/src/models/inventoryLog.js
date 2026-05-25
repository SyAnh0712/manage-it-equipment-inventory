"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InventoryLog extends Model {
    static associate(models) {}
  }
  InventoryLog.init(
    {
      equipmentId: DataTypes.INTEGER,
      actionType: DataTypes.ENUM("import", "export", "adjust"),
      quantityBefore: DataTypes.INTEGER,
      quantityChanged: DataTypes.INTEGER,
      quantityAfter: DataTypes.INTEGER,
      referenceCode: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "InventoryLog",
    },
  );
  return InventoryLog;
};
