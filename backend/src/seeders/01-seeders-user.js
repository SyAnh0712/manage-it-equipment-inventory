"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        username: "admin",
        password: "123456",
        full_name: "Administrator",
        email: "admin@gmail.com",
        role: "admin",

        created_at: new Date(),
        updated_at: new Date(),

        deleted_at: null,
      },

      {
        username: "staff01",
        password: "123456",
        full_name: "Nguyen Van A",
        email: "staff01@gmail.com",
        role: "staff",

        created_at: new Date(),
        updated_at: new Date(),

        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
