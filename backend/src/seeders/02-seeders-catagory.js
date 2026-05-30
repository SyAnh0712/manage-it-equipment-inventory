"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("categories", [
      {
        name: "Laptop",
        description: "Danh mục máy tính xách tay",
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        name: "PC",
        description: "Máy tính để bàn",
        image_url:
          "https://images.unsplash.com/photo-1587831990711-23ca6441447b",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        name: "Linh kiện",
        description: "Thiết bị linh kiện máy tính",
        image_url:
          "https://images.unsplash.com/photo-1518770660439-4636190af475",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        name: "Thiết bị mạng",
        description: "Router, Switch, Access Point",
        image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        name: "Thiết bị văn phòng",
        description: "Máy in, máy scan",
        image_url:
          "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("categories", null, {});
  },
};
