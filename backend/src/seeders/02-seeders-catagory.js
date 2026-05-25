"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("categories", [
      {
        name: "Laptop",
        description: "Danh mục laptop",

        created_at: new Date(),

        deleted_at: null,
      },

      {
        name: "Máy in",
        description: "Danh mục máy in",

        created_at: new Date(),

        deleted_at: null,
      },

      {
        name: "Thiết bị mạng",
        description: "Router, Switch",

        created_at: new Date(),

        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("categories", null, {});
  },
};
