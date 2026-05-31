"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "export_order_details",
      [
        {
          export_order_id: 1,
          equipment_id: 1,
          quantity: 2,

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          export_order_id: 2,
          equipment_id: 7,
          quantity: 1,

          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          export_order_id: 3,
          equipment_id: 4,
          quantity: 5,

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
    return queryInterface.bulkDelete("export_order_details", null, {});
  },
};
