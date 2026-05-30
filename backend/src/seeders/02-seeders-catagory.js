"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("categories", [
      {
        name: "Laptop",
        description: "Danh mục laptop",
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",

        created_at: new Date(),

        deleted_at: null,
      },

      {
        name: "Máy in",
        description: "Danh mục máy in",
        image_url:
          "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6",
        created_at: new Date(),

        deleted_at: null,
      },

      {
        name: "Thiết bị mạng",
        description: "Router, Switch",
        image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
        created_at: new Date(),

        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("categories", null, {});
  },
};
