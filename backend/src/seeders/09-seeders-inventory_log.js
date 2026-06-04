"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "inventory_logs",
      [
        {
          equipment_id: 1,
          action_type: "import",

          quantity_before: 10,
          quantity_changed: 10,
          quantity_after: 20,

          reference_code: "IMP001",
          created_by: 1,

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          equipment_id: 5,
          action_type: "import",

          quantity_before: 10,
          quantity_changed: 20,
          quantity_after: 30,

          reference_code: "IMP002",
          created_by: 2,

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          equipment_id: 1,
          action_type: "export",

          quantity_before: 20,
          quantity_changed: -2,
          quantity_after: 18,

          reference_code: "EXP001",
          created_by: 2,

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          equipment_id: 7,
          action_type: "export",

          quantity_before: 9,
          quantity_changed: -1,
          quantity_after: 8,

          reference_code: "EXP002",
          created_by: 1,

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          equipment_id: 4,
          action_type: "adjust",

          quantity_before: 45,
          quantity_changed: 5,
          quantity_after: 50,

          reference_code: "ADJ001",
          created_by: 1,

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
    return queryInterface.bulkDelete("inventory_logs", null, {});
  },
};
