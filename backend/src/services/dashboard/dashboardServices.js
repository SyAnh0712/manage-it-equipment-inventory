const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

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

  async getDetailedStatistics() {
    try {
      const totalEquipment = await db.Equipment.count();
      const lowStockEquipment = await db.Equipment.findAll({
        where: {
          quantity: { [Op.lte]: 5 },
        },
        attributes: ["id", "code", "name", "quantity"],
        limit: 10,
      });

      const outOfStockEquipment = await db.Equipment.findAll({
        where: {
          quantity: 0,
        },
        attributes: ["id", "code", "name"],
      });

      const highStockEquipment = await db.Equipment.findAll({
        where: {
          quantity: { [Op.gte]: 50 },
        },
        attributes: ["id", "code", "name", "quantity"],
        limit: 10,
        order: [["quantity", "DESC"]],
      });

      const currentMonth = new Date();
      currentMonth.setDate(1);

      const monthlyImports = await db.ImportOrder.count({
        where: {
          created_at: {
            [Op.gte]: currentMonth,
          },
          status: "approved",
        },
      });

      const monthlyExports = await db.ExportOrder.count({
        where: {
          created_at: {
            [Op.gte]: currentMonth,
          },
          status: "approved",
        },
      });

      const recentImports = await db.ImportOrder.findAll({
        attributes: ["id", "code", "status", "created_at"],
        order: [["created_at", "DESC"]],
        limit: 5,
      });

      const recentExports = await db.ExportOrder.findAll({
        attributes: ["id", "code", "status", "created_at"],
        order: [["created_at", "DESC"]],
        limit: 5,
      });

      return {
        equipment: {
          total: totalEquipment,
          lowStock: lowStockEquipment,
          outOfStock: outOfStockEquipment,
          highStock: highStockEquipment,
        },
        monthly: {
          imports: monthlyImports,
          exports: monthlyExports,
        },
        recentActivities: {
          imports: recentImports,
          exports: recentExports,
        },
      };
    } catch (error) {
      throw new Error("Error fetching detailed statistics: " + error.message);
    }
  },

  async getInventoryTrends(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const trends = await db.InventoryLog.findAll({
        where: {
          created_at: {
            [Op.gte]: startDate,
          },
        },
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("created_at")), "date"],
          [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalQuantity"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "transactionCount"],
        ],
        group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
        order: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "ASC"]],
        subQuery: false,
      });

      return trends;
    } catch (error) {
      throw new Error("Error fetching inventory trends: " + error.message);
    }
  },
};

module.exports = DashboardService;
