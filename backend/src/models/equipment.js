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
      categoryId: DataTypes.INTEGER,
      supplierId: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
      description: DataTypes.TEXT,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Equipment",
    },
  );
  return Equipment;
};
