const mockDb = {
  Equipment: {
    count: jest.fn(),
    sum: jest.fn(),
  },
  Category: {
    count: jest.fn(),
  },
  Supplier: {
    count: jest.fn(),
  },
  User: {
    count: jest.fn(),
  },
  ImportOrder: {
    count: jest.fn(),
  },
  ExportOrder: {
    count: jest.fn(),
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
});
