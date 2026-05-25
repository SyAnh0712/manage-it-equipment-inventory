"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImportOrder extends Model {
    static associate(models) {}
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
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  return ImportOrder;
};
