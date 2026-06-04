"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "two_factor_enabled", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("users", "two_factor_secret", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "recovery_codes", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "two_factor_enabled");
    await queryInterface.removeColumn("users", "two_factor_secret");
    await queryInterface.removeColumn("users", "recovery_codes");
  },
};
