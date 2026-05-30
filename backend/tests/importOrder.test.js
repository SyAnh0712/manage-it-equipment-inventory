const mockDb = {
  ImportOrder: {
    findByPk: jest.fn(),
  },
  ImportOrderDetail: {
    findAll: jest.fn(),
  },
  Equipment: {
    findByPk: jest.fn(),
  },
  InventoryLog: {
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(async (fn) => {
      return await fn({});
    }),
  },
};

const modelsPath = require.resolve("../../src/models");
jest.mock(modelsPath, () => mockDb);

const importService = require("../../src/services/inventory/importOrderServices");

describe("Import order approve flow", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("approveImportOrder updates equipment quantity and sets status", async () => {
    const importOrder = {
      id: 1,
      code: "IMP-1",
      status: "pending",
      update: jest.fn(),
    };
    mockDb.ImportOrder.findByPk.mockResolvedValueOnce(importOrder);

    const detail = { equipment_id: 10, quantity: 5 };
    mockDb.ImportOrderDetail.findAll.mockResolvedValueOnce([detail]);

    const equipment = { id: 10, quantity: 3, update: jest.fn() };
    mockDb.Equipment.findByPk.mockResolvedValueOnce(equipment);

    mockDb.InventoryLog.create.mockResolvedValueOnce({});

    const result = await importService.approveImportOrder(1, 99);

    expect(mockDb.ImportOrder.findByPk).toHaveBeenCalledWith(
      1,
      expect.any(Object),
    );
    expect(mockDb.ImportOrderDetail.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { import_order_id: importOrder.id } }),
    );
    expect(mockDb.Equipment.findByPk).toHaveBeenCalledWith(
      detail.equipment_id,
      expect.any(Object),
    );
    expect(equipment.update).toHaveBeenCalledWith(
      { quantity: 8 },
      expect.any(Object),
    );
    expect(importOrder.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "approved" }),
      expect.any(Object),
    );
    expect(result).toBe(importOrder);
  });

  test("approveImportOrder throws when import order not found", async () => {
    mockDb.ImportOrder.findByPk.mockResolvedValueOnce(null);
    await expect(importService.approveImportOrder(999, 1)).rejects.toThrow(
      "Import order not found",
    );
  });
});
