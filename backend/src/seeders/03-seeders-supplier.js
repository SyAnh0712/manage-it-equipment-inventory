"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("suppliers", [
      {
        name: "Dell Việt Nam",

        phone: "0901234567",

        email: "dell@gmail.com",

        address: "Hồ Chí Minh",

        created_at: new Date(),

        deleted_at: null,
      },

      {
        name: "HP Distributor",

        phone: "0912345678",

        email: "hp@gmail.com",

        address: "Hà Nội",

        created_at: new Date(),

        deleted_at: null,
      },

      {
        name: "Cisco Supplier",

        phone: "0987654321",

        email: "cisco@gmail.com",

        address: "Đà Nẵng",

        created_at: new Date(),

        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("suppliers", null, {});
  },
};
