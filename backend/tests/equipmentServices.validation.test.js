const mockDb = {
  Equipment: {
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Category: {
    findByPk: jest.fn(),
  },
  Supplier: {
    findByPk: jest.fn(),
  },
};

jest.mock("../src/models", () => mockDb);
jest.mock("../src/utils/socket", () => require("./helpers/mockSocket"));

const equipmentService = require("../src/services/equipment/equipmentServices");

describe("equipmentServices validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createEquipment rejects unknown category", async () => {
    mockDb.Category.findByPk.mockResolvedValueOnce(null);

    await expect(
      equipmentService.createEquipment({
        code: "EQ-1",
        name: "Laptop",
        category_id: 99,
        supplier_id: 1,
        unit: "pcs",
        quantity: 1,
        price: 100,
      }),
    ).rejects.toMatchObject({
      message: "Category not found",
      status: 400,
    });
  });
});
