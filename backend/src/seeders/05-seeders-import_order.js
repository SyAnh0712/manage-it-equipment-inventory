"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "import_orders",
      [
        {
          code: "IMP001",
          supplier_id: 1,
          created_by: 1,
          status: "approved",
          note: "Nhập lô laptop Dell",

          created_at: new Date(),
          approved_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          code: "IMP002",
          supplier_id: 2,
          created_by: 2,
          status: "approved",
          note: "Nhập SSD và Laptop Asus",

          created_at: new Date(),
          approved_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          code: "IMP003",
          supplier_id: 3,
          created_by: 1,
          status: "pending",
          note: "Nhập thiết bị mạng",

          created_at: new Date(),
          approved_at: null,
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
    return queryInterface.bulkDelete("import_orders", null, {});
  },
};
