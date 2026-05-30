"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("import_order_details", [
      {
        import_order_id: 1,
        equipment_id: 1,
        quantity: 10,
        unit_price: 18000000,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },

      {
        import_order_id: 2,
        equipment_id: 2,
        quantity: 5,
        unit_price: 16500000,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },

      {
        import_order_id: 2,
        equipment_id: 5,
        quantity: 20,
        unit_price: 2400000,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },

      {
        import_order_id: 3,
        equipment_id: 6,
        quantity: 10,
        unit_price: 2000000,

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("import_order_details", null, {});
  },
};
