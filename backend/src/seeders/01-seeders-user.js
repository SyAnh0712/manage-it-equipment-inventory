"use strict";

const { hashPassword } = require("../utils/passwordHelper");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password = await hashPassword("123456");

    return queryInterface.bulkInsert(
      "users",
      [
        {
          username: "admin",
          password,
          full_name: "Administrator",
          email: "admin@gmail.com",
          role: "admin",
          is_locked: false,
          two_factor_enabled: false,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          username: "staff01",
          password,
          full_name: "Nguyen Van A",
          email: "staff01@gmail.com",
          role: "staff",
          is_locked: false,
          two_factor_enabled: false,
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

  async down(queryInterface) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
