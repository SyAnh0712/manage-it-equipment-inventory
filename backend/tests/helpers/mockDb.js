const createMockDb = () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  PendingUser: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Equipment: {
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Category: {
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Supplier: {
    findByPk: jest.fn(),
  },
  ImportOrder: {
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  ExportOrder: {
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  InventoryLog: {
    findAndCountAll: jest.fn(),
    create: jest.fn(),
  },
  sequelize: {
    authenticate: jest.fn(),
    transaction: jest.fn(async (callback) => callback({})),
  },
});

module.exports = createMockDb;
