"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("equipment", [
      {
        code: "EQ001",
        name: "Laptop Dell Inspiron 15",
        category_id: 1,
        supplier_id: 1,
        unit: "Cái",
        quantity: 20,
        price: 18500000,
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        description: "Laptop văn phòng Dell",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        code: "EQ002",
        name: "Laptop Asus Vivobook",
        category_id: 1,
        supplier_id: 2,
        unit: "Cái",
        quantity: 15,
        price: 17000000,
        image_url:
          "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
        description: "Laptop học tập Asus",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        code: "EQ003",
        name: "PC Gaming RTX 4060",
        category_id: 2,
        supplier_id: 3,
        unit: "Bộ",
        quantity: 5,
        price: 32000000,
        image_url:
          "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
        description: "PC Gaming hiệu năng cao",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        code: "EQ004",
        name: "RAM Kingston 16GB",
        category_id: 3,
        supplier_id: 1,
        unit: "Thanh",
        quantity: 50,
        price: 1200000,
        image_url: "https://images.unsplash.com/photo-1562976540-1502c2145186",
        description: "RAM DDR4 Kingston",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        code: "EQ005",
        name: "SSD Samsung 1TB",
        category_id: 3,
        supplier_id: 2,
        unit: "Ổ",
        quantity: 30,
        price: 2500000,
        image_url:
          "https://images.unsplash.com/photo-1591488320449-011701bb6704",
        description: "SSD NVMe Samsung",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        code: "EQ006",
        name: "Router TP-Link AX3000",
        category_id: 4,
        supplier_id: 3,
        unit: "Cái",
        quantity: 12,
        price: 2100000,
        image_url:
          "https://images.unsplash.com/photo-1647427060118-4911c9821b82",
        description: "Router Wifi 6",

        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        code: "EQ007",
        name: "Máy in Canon LBP2900",
        category_id: 5,
        supplier_id: 1,
        unit: "Cái",
        quantity: 8,
        price: 3500000,
        image_url:
          "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6",
        description: "Máy in laser Canon",

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
