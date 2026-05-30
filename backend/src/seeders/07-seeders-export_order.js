"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("export_orders", [
      {
        code: "EXP001",
        department: "Phong IT",
        receiver: "Nguyen Van A",
        created_by: 2,
        status: "approved",
        note: "Xuất laptop cho nhân viên",

        created_at: new Date(),
        approved_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },

      {
        code: "EXP002",
        department: "Phong Ke Toan",
        receiver: "Tran Thi B",
        created_by: 1,
        status: "approved",
        note: "Xuất máy in",

        created_at: new Date(),
        approved_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },

      {
        code: "EXP003",
        department: "Phong Ky Thuat",
        receiver: "Le Van C",
        created_by: 2,
        status: "pending",
        note: "Xuất RAM nâng cấp máy",

        created_at: new Date(),
        approved_at: null,
        updated_at: new Date(),
        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("export_orders", null, {});
  },
};
