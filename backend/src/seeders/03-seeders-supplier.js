"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "suppliers",
      [
        {
          name: "FPT Distribution",
          phone: "0901234567",
          email: "fpt@gmail.com",
          address: "Ho Chi Minh",

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          name: "The Gioi Di Dong",
          phone: "0912345678",
          email: "tgdd@gmail.com",
          address: "Da Nang",

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          name: "Phong Vu",
          phone: "0923456789",
          email: "phongvu@gmail.com",
          address: "Ha Noi",

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {
        ignoreDuplicates: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("suppliers", null, {});
  },
};
