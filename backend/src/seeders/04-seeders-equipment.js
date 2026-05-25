"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("equipment", [
      {
        code: "EQ001",
        name: "Dell Latitude 5540",

        category_id: 1,
        supplier_id: 1,

        unit: "Cái",

        quantity: 10,

        price: 25000000,

        description: "Laptop văn phòng Dell",

        created_at: new Date(),
        updated_at: new Date(),

        deleted_at: null,
      },

      {
        code: "EQ002",
        name: "HP LaserJet Pro",

        category_id: 2,
        supplier_id: 1,

        unit: "Cái",

        quantity: 5,

        price: 7000000,

        description: "Máy in laser HP",

        created_at: new Date(),
        updated_at: new Date(),

        deleted_at: null,
      },

      {
        code: "EQ003",
        name: "Cisco Switch 24 Port",

        category_id: 3,
        supplier_id: 1,

        unit: "Cái",

        quantity: 3,

        price: 12000000,

        description: "Switch mạng Cisco",

        created_at: new Date(),
        updated_at: new Date(),

        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("equipment", null, {});
  },
};
