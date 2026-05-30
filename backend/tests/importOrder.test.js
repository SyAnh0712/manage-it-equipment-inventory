const mockDb = {
  ImportOrder: {
    findByPk: jest.fn(),
  },
  ImportOrderDetail: {
    findAll: jest.fn(),
    destroy: jest.fn(),
    create: jest.fn(),
  },
  Equipment: {
    findByPk: jest.fn(),
  },
  InventoryLog: {
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(async (fn) => fn({})),
  },
};

jest.mock("../src/models", () => mockDb);

const importService = require("../src/services/inventory/importOrderServices");

describe("Import order service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("approveImportOrder", () => {
    test("updates equipment quantity and sets status to approved", async () => {
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

    test("throws when import order not found", async () => {
      mockDb.ImportOrder.findByPk.mockResolvedValueOnce(null);

      await expect(importService.approveImportOrder(999, 1)).rejects.toThrow(
        "Import order not found",
      );
    });

    test("throws when order is not pending", async () => {
      mockDb.ImportOrder.findByPk.mockResolvedValueOnce({
        id: 1,
        status: "approved",
      });

      await expect(importService.approveImportOrder(1, 1)).rejects.toThrow(
        "Chỉ có thể duyệt đơn ở trạng thái pending",
      );
    });
  });

  describe("deleteImportOrder", () => {
    test("allows staff to delete their own pending order", async () => {
      const importOrder = {
        id: 1,
        status: "pending",
        created_by: 5,
        destroy: jest.fn(),
      };
      mockDb.ImportOrder.findByPk.mockResolvedValueOnce(importOrder);

      const result = await importService.deleteImportOrder(1, {
        id: 5,
        role: "staff",
      });

      expect(importOrder.destroy).toHaveBeenCalled();
      expect(result.message).toMatch(/deleted successfully/i);
    });

    test("denies staff from deleting another users order", async () => {
      mockDb.ImportOrder.findByPk.mockResolvedValueOnce({
        id: 1,
        status: "pending",
        created_by: 2,
      });

      await expect(
        importService.deleteImportOrder(1, { id: 5, role: "staff" }),
      ).rejects.toThrow("Bạn không có quyền cập nhật đơn hàng này");
    });
  });

  describe("rejectImportOrder", () => {
    test("sets status to rejected for pending order", async () => {
      const importOrder = {
        id: 1,
        status: "pending",
        update: jest.fn(),
      };
      mockDb.ImportOrder.findByPk.mockResolvedValueOnce(importOrder);

      const result = await importService.rejectImportOrder(1, 99);

      expect(importOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: "rejected" }),
      );
      expect(result).toBe(importOrder);
    });
  });
});
