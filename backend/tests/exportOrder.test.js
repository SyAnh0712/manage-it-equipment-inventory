const mockDb = {
  ExportOrder: {
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  ExportOrderDetail: {
    findAll: jest.fn(),
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

const exportService = require("../src/services/inventory/exportOrderServices");

describe("Export order service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("approveExportOrder", () => {
    test("decreases equipment quantity and sets status to approved", async () => {
      const exportOrder = {
        id: 1,
        code: "EXP-1",
        status: "pending",
        created_by: 3,
        update: jest.fn(),
      };
      mockDb.ExportOrder.findByPk.mockResolvedValueOnce(exportOrder);

      const detail = { equipment_id: 10, quantity: 4 };
      mockDb.ExportOrderDetail.findAll.mockResolvedValueOnce([detail]);

      const equipment = { id: 10, name: "Laptop", quantity: 10, update: jest.fn() };
      mockDb.Equipment.findByPk.mockResolvedValueOnce(equipment);
      mockDb.InventoryLog.create.mockResolvedValueOnce({});

      const result = await exportService.approveExportOrder(1, 99);

      expect(equipment.update).toHaveBeenCalledWith(
        { quantity: 6 },
        expect.any(Object),
      );
      expect(exportOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: "approved" }),
        expect.any(Object),
      );
      expect(result).toBe(exportOrder);
    });

    test("throws when export order not found", async () => {
      mockDb.ExportOrder.findByPk.mockResolvedValueOnce(null);

      await expect(exportService.approveExportOrder(999, 1)).rejects.toThrow(
        "Export order not found",
      );
    });

    test("throws when insufficient stock during approval", async () => {
      const exportOrder = {
        id: 1,
        code: "EXP-1",
        status: "pending",
        update: jest.fn(),
      };
      mockDb.ExportOrder.findByPk.mockResolvedValueOnce(exportOrder);
      mockDb.ExportOrderDetail.findAll.mockResolvedValueOnce([
        { equipment_id: 10, quantity: 20 },
      ]);
      mockDb.Equipment.findByPk.mockResolvedValueOnce({
        id: 10,
        name: "Monitor",
        quantity: 5,
        update: jest.fn(),
      });

      await expect(exportService.approveExportOrder(1, 1)).rejects.toThrow(
        /Không đủ số lượng tồn kho/,
      );
    });
  });

  describe("getAllExportOrders", () => {
    test("scopes list to staff own orders", async () => {
      mockDb.ExportOrder.findAndCountAll.mockResolvedValueOnce({
        count: 0,
        rows: [],
      });

      await exportService.getAllExportOrders({}, { id: 7, role: "staff" });

      expect(mockDb.ExportOrder.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ created_by: 7 }),
        }),
      );
    });
  });

  describe("getExportOrderById", () => {
    test("denies staff from viewing another users order", async () => {
      mockDb.ExportOrder.findByPk.mockResolvedValueOnce({
        id: 1,
        created_by: 2,
      });

      await expect(
        exportService.getExportOrderById(1, { id: 5, role: "staff" }),
      ).rejects.toThrow("Bạn không có quyền xem đơn hàng này");
    });
  });

  describe("deleteExportOrder", () => {
    test("allows admin to delete any pending order", async () => {
      const exportOrder = {
        id: 1,
        status: "pending",
        created_by: 2,
        destroy: jest.fn(),
      };
      mockDb.ExportOrder.findByPk.mockResolvedValueOnce(exportOrder);

      await exportService.deleteExportOrder(1, { id: 99, role: "admin" });

      expect(exportOrder.destroy).toHaveBeenCalled();
    });

    test("denies staff from deleting another users order", async () => {
      mockDb.ExportOrder.findByPk.mockResolvedValueOnce({
        id: 1,
        status: "pending",
        created_by: 2,
      });

      await expect(
        exportService.deleteExportOrder(1, { id: 5, role: "staff" }),
      ).rejects.toThrow("Bạn không có quyền cập nhật đơn hàng này");
    });
  });
});
