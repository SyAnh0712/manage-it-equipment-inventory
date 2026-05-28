const db = require("../../models");

const DashboardService = {
  async getStatistics() {
    try {
      const [equipmentCount, categoryCount, supplierCount, userCount] =
        await Promise.all([
          db.Equipment.count(),
          db.Category.count(),
          db.Supplier.count(),
          db.User.count(),
        ]);

      const [importCount, exportCount, pendingImportCount, pendingExportCount] =
        await Promise.all([
          db.ImportOrder.count(),
          db.ExportOrder.count(),
          db.ImportOrder.count({ where: { status: "pending" } }),
          db.ExportOrder.count({ where: { status: "pending" } }),
        ]);

      const totalQuantity = (await db.Equipment.sum("quantity")) || 0;

      return {
        summary: {
          equipment: equipmentCount,
          categories: categoryCount,
          suppliers: supplierCount,
          users: userCount,
          importOrders: importCount,
          exportOrders: exportCount,
          pendingImportOrders: pendingImportCount,
          pendingExportOrders: pendingExportCount,
          totalQuantity,
        },
      };
    } catch (error) {
      throw new Error("Error fetching dashboard statistics: " + error.message);
    }
  },
};

module.exports = DashboardService;
