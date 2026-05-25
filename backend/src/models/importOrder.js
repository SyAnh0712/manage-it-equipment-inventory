"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImportOrder extends Model {
    static associate(models) {}
  }
  ImportOrder.init(
    {
      code: DataTypes.STRING,
      supplierId: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
      status: DataTypes.ENUM("pending", "approved", "rejected"),
      note: DataTypes.TEXT,
      approvedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ImportOrder",
    },
  );
  return ImportOrder;
};
