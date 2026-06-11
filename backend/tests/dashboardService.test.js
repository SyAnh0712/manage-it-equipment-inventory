const mockDb = {
  Equipment: {
    count: jest.fn(),
    sum: jest.fn(),
    findAll: jest.fn(),
  },
  Category: {
    count: jest.fn(),
    findAll: jest.fn(),
  },
  Supplier: {
    count: jest.fn(),
  },
  User: {
    count: jest.fn(),
  },
  ImportOrder: {
    count: jest.fn(),
    findAll: jest.fn(),
  },
  ExportOrder: {
    count: jest.fn(),
    findAll: jest.fn(),
  },
  InventoryLog: {
    findAll: jest.fn(),
  },
};

jest.mock("../src/models", () => mockDb);

const dashboardService = require("../src/services/dashboard/dashboardServices");

describe("Dashboard service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.Equipment.count.mockResolvedValue(50);
    mockDb.Category.count.mockResolvedValue(8);
    mockDb.Supplier.count.mockResolvedValue(12);
    mockDb.User.count.mockResolvedValue(5);
    mockDb.Equipment.sum.mockResolvedValue(320);
  });

  test("returns full summary for admin", async () => {
    mockDb.ImportOrder.count
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(3);
    mockDb.ExportOrder.count
      .mockResolvedValueOnce(15)
      .mockResolvedValueOnce(2);

    const result = await dashboardService.getStatistics({
      id: 1,
      role: "admin",
    });

    expect(result.summary).toEqual({
      equipment: 50,
      categories: 8,
      suppliers: 12,
      users: 5,
      importOrders: 20,
      exportOrders: 15,
      totalQuantity: 320,
      pendingImportOrders: 3,
      pendingExportOrders: 2,
    });
    expect(mockDb.User.count).toHaveBeenCalled();
  });

  test("returns limited summary for staff", async () => {
    mockDb.ImportOrder.count
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(1);
    mockDb.ExportOrder.count
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);

    const result = await dashboardService.getStatistics({
      id: 10,
      role: "staff",
    });

    expect(result.summary.users).toBe(0);
    expect(result.summary.myOrders).toBe(6);
    expect(result.summary.myPendingOrders).toBe(2);
    expect(result.summary.pendingImportOrders).toBeUndefined();
    expect(mockDb.User.count).not.toHaveBeenCalled();
    expect(mockDb.ImportOrder.count).toHaveBeenCalledWith({
      where: { created_by: 10 },
    });
  });

  describe("getMonthlyReport", () => {
    test("returns aggregated monthly import/export quantities", async () => {
      mockDb.InventoryLog.findAll.mockResolvedValue([
        { action_type: "import", quantity_changed: 120, created_at: new Date() },
        { action_type: "export", quantity_changed: -80, created_at: new Date() },
      ]);
      const result = await dashboardService.getMonthlyReport();
      expect(result).toHaveLength(6);
      const currentMonthIndex = 5;
      expect(result[currentMonthIndex].import).toBe(120);
      expect(result[currentMonthIndex].export).toBe(80);
    });
  });

  describe("getCategoryDistribution", () => {
    test("returns category distribution based on quantity", async () => {
      mockDb.Category.findAll.mockResolvedValue([
        { id: 1, name: "Laptop" },
        { id: 2, name: "Monitor" },
      ]);
      mockDb.Equipment.findAll.mockResolvedValue([
        { category_id: 1, quantity: 40 },
        { category_id: 2, quantity: 60 },
      ]);

      const result = await dashboardService.getCategoryDistribution();
      expect(result).toEqual([
        { name: "Laptop", value: 40, percentage: 40 },
        { name: "Monitor", value: 60, percentage: 60 },
      ]);
    });
  });

  describe("getTopEquipment", () => {
    test("returns top stock equipment", async () => {
      const mockEquipments = [
        { name: "Dell Latitude", quantity: 120, code: "EQ001" },
      ];
      mockDb.Equipment.findAll.mockResolvedValue(mockEquipments);
      const result = await dashboardService.getTopEquipment();
      expect(result).toEqual(mockEquipments);
    });
  });

  describe("getRecentActivities", () => {
    test("returns combined recent activities log", async () => {
      mockDb.ImportOrder.findAll.mockResolvedValue([
        { code: "IMP001", status: "approved", created_at: new Date("2026-06-12T02:00:00Z"), creator: { full_name: "Admin" } },
      ]);
      mockDb.ExportOrder.findAll.mockResolvedValue([
        { code: "EXP003", status: "pending", created_at: new Date("2026-06-12T03:00:00Z"), creator: { username: "Staff" } },
      ]);
      mockDb.Equipment.findAll.mockResolvedValue([
        { code: "EQ015", name: "Dell", created_at: new Date("2026-06-12T01:00:00Z") },
      ]);

      const result = await dashboardService.getRecentActivities();
      expect(result).toHaveLength(3);
      expect(result[0].message).toContain("Staff created Export #EXP003");
      expect(result[1].message).toContain("Admin approved Import #IMP001");
      expect(result[2].message).toContain("Added Equipment EQ015 (Dell)");
    });
  });
});
