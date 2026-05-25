"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventory_logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      equipment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "equipment",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      action_type: {
        type: Sequelize.ENUM("import", "export", "adjust"),
        allowNull: false,
      },

      quantity_before: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      quantity_changed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      quantity_after: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      reference_code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("inventory_logs");
  },
};
