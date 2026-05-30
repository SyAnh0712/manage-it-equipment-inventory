const mockDb = {
  InventoryLog: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  Equipment: {
    findByPk: jest.fn(),
  },
  User: {},
  sequelize: {
    transaction: jest.fn(async (fn) => fn({})),
  },
};

jest.mock("../src/models", () => mockDb);

const inventoryLogService = require("../src/services/inventory/inventoryLogServices");

describe("Inventory log service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("adjustInventory", () => {
    test("increases stock and creates adjust log", async () => {
      const equipment = {
        id: 1,
        quantity: 10,
        update: jest.fn(),
      };
      mockDb.Equipment.findByPk.mockResolvedValueOnce(equipment);
      mockDb.InventoryLog.create.mockResolvedValueOnce({ id: 100 });

      const result = await inventoryLogService.adjustInventory(
        { equipment_id: 1, quantity_change: 5 },
        99,
      );

      expect(equipment.update).toHaveBeenCalledWith(
        { quantity: 15 },
        expect.any(Object),
      );
      expect(mockDb.InventoryLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          equipment_id: 1,
          action_type: "adjust",
          quantity_before: 10,
          quantity_changed: 5,
          quantity_after: 15,
          created_by: 99,
        }),
        expect.any(Object),
      );
      expect(result).toEqual({ id: 100 });
    });

    test("rejects adjustment that makes quantity negative", async () => {
      mockDb.Equipment.findByPk.mockResolvedValueOnce({
        id: 1,
        quantity: 3,
        update: jest.fn(),
      });

      await expect(
        inventoryLogService.adjustInventory(
          { equipment_id: 1, quantity_change: -10 },
          1,
        ),
      ).rejects.toThrow(/không được âm/);
    });

    test("rejects zero quantity change", async () => {
      await expect(
        inventoryLogService.adjustInventory(
          { equipment_id: 1, quantity_change: 0 },
          1,
        ),
      ).rejects.toThrow(/phải khác 0/);
    });

    test("rejects missing equipment_id", async () => {
      await expect(
        inventoryLogService.adjustInventory({ quantity_change: 5 }, 1),
      ).rejects.toThrow(/Thiếu equipment_id/);
    });
  });

  describe("getAllInventoryLogs", () => {
    test("returns paginated logs", async () => {
      mockDb.InventoryLog.findAndCountAll.mockResolvedValueOnce({
        count: 25,
        rows: [{ id: 1 }, { id: 2 }],
      });

      const result = await inventoryLogService.getAllInventoryLogs({
        page: 2,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
    });
  });
});
