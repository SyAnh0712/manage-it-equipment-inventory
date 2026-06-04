"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("users");

    if (!Object.prototype.hasOwnProperty.call(table, "is_locked")) {
      await queryInterface.addColumn("users", "is_locked", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },
  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("users");

    if (Object.prototype.hasOwnProperty.call(table, "is_locked")) {
      await queryInterface.removeColumn("users", "is_locked");
    }
  },
};
