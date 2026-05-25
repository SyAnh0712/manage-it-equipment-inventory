"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    static associate(models) {}
  }
  Equipment.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      supplier_id: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
      image_url: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Equipment",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  return Equipment;
};
