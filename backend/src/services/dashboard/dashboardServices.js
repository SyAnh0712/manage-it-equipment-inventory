const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

const DashboardService = {
  async getStatistics(user) {
    try {
      const isStaff = user?.role === "staff";
      const ownOrdersWhere = isStaff ? { created_by: user.id } : {};

      const [equipmentCount, categoryCount, supplierCount, userCount] =
        await Promise.all([
          db.Equipment.count(),
          db.Category.count(),
          db.Supplier.count(),
          isStaff ? Promise.resolve(0) : db.User.count(),
        ]);

      const [importCount, exportCount, pendingImportCount, pendingExportCount] =
        await Promise.all([
          db.ImportOrder.count({ where: ownOrdersWhere }),
          db.ExportOrder.count({ where: ownOrdersWhere }),
          db.ImportOrder.count({
            where: { ...ownOrdersWhere, status: "pending" },
          }),
          db.ExportOrder.count({
            where: { ...ownOrdersWhere, status: "pending" },
          }),
        ]);

      const totalQuantity = (await db.Equipment.sum("quantity")) || 0;

      const summary = {
        equipment: equipmentCount,
        categories: categoryCount,
        suppliers: supplierCount,
        users: userCount,
        importOrders: importCount,
        exportOrders: exportCount,
        totalQuantity,
      };

      if (isStaff) {
        const [approvedImportCount, approvedExportCount] = await Promise.all([
          db.ImportOrder.count({
            where: { created_by: user.id, status: "approved" },
          }),
          db.ExportOrder.count({
            where: { created_by: user.id, status: "approved" },
          }),
        ]);

        summary.myOrders = importCount + exportCount;
        summary.myPendingOrders = pendingImportCount + pendingExportCount;
        summary.myImportOrders = importCount;
        summary.myExportOrders = exportCount;
        summary.myApprovedOrders = approvedImportCount + approvedExportCount;
      } else {
        summary.pendingImportOrders = pendingImportCount;
        summary.pendingExportOrders = pendingExportCount;
      }

      return { summary };
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

  async getMonthlyReport() {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0, 0, 0, 0);

      const logs = await db.InventoryLog.findAll({
        where: {
          action_type: { [Op.in]: ["import", "export"] },
          created_at: { [Op.gte]: sixMonthsAgo },
        },
        attributes: ["action_type", "quantity_changed", "created_at"],
      });

      const monthsList = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString("en-US", { month: "short" });
        const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthsList.push({ month: monthName, key: yearMonth, import: 0, export: 0 });
      }

      logs.forEach((log) => {
        const logDate = new Date(log.created_at);
        const logKey = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, "0")}`;
        const monthObj = monthsList.find((m) => m.key === logKey);
        if (monthObj) {
          const val = Math.abs(log.quantity_changed);
          if (log.action_type === "import") {
            monthObj.import += val;
          } else if (log.action_type === "export") {
            monthObj.export += val;
          }
        }
      });

      return monthsList.map(({ month, import: imp, export: exp }) => ({
        month,
        import: imp,
        export: exp,
      }));
    } catch (error) {
      throw new Error("Error fetching monthly report: " + error.message);
    }
  },

  async getCategoryDistribution() {
    try {
      const [categories, equipments] = await Promise.all([
        db.Category.findAll({ attributes: ["id", "name"] }),
        db.Equipment.findAll({ attributes: ["category_id", "quantity"] }),
      ]);

      const totalQuantityAll = equipments.reduce((sum, eq) => sum + (eq.quantity || 0), 0);
      const catMap = {};
      categories.forEach((c) => {
        catMap[c.id] = { name: c.name, value: 0 };
      });

      equipments.forEach((eq) => {
        if (catMap[eq.category_id]) {
          catMap[eq.category_id].value += (eq.quantity || 0);
        }
      });

      const distribution = Object.values(catMap)
        .filter((item) => item.value > 0)
        .map((item) => ({
          name: item.name,
          value: item.value,
          percentage: totalQuantityAll > 0 ? Math.round((item.value / totalQuantityAll) * 100) : 0,
        }));

      return distribution;
    } catch (error) {
      throw new Error("Error fetching category distribution: " + error.message);
    }
  },

  async getTopEquipment() {
    try {
      const topEquipment = await db.Equipment.findAll({
        attributes: ["name", "quantity", "code"],
        order: [["quantity", "DESC"]],
        limit: 5,
      });
      return topEquipment;
    } catch (error) {
      throw new Error("Error fetching top equipment: " + error.message);
    }
  },

  async getRecentActivities() {
    try {
      const [imports, exports, equipments] = await Promise.all([
        db.ImportOrder.findAll({
          limit: 5,
          order: [["created_at", "DESC"]],
          include: [{ model: db.User, as: "creator", attributes: ["full_name", "username", "role"] }],
        }),
        db.ExportOrder.findAll({
          limit: 5,
          order: [["created_at", "DESC"]],
          include: [{ model: db.User, as: "creator", attributes: ["full_name", "username", "role"] }],
        }),
        db.Equipment.findAll({
          limit: 5,
          order: [["created_at", "DESC"]],
        }),
      ]);

      const activities = [];

      imports.forEach((imp) => {
        const time = imp.created_at;
        const creatorName = imp.creator ? (imp.creator.full_name || imp.creator.username) : "System";
        let message = "";
        if (imp.status === "approved") {
          message = `${creatorName} approved Import #${imp.code}`;
        } else if (imp.status === "rejected") {
          message = `${creatorName} rejected Import #${imp.code}`;
        } else {
          message = `${creatorName} created Import #${imp.code}`;
        }
        activities.push({
          time,
          message,
          type: "import",
          status: imp.status,
        });
      });

      exports.forEach((exp) => {
        const time = exp.created_at;
        const creatorName = exp.creator ? (exp.creator.full_name || exp.creator.username) : "System";
        let message = "";
        if (exp.status === "approved") {
          message = `${creatorName} approved Export #${exp.code}`;
        } else if (exp.status === "rejected") {
          message = `${creatorName} rejected Export #${exp.code}`;
        } else {
          message = `${creatorName} created Export #${exp.code}`;
        }
        activities.push({
          time,
          message,
          type: "export",
          status: exp.status,
        });
      });

      equipments.forEach((eq) => {
        const time = eq.created_at;
        const message = `Added Equipment ${eq.code} (${eq.name})`;
        activities.push({
          time,
          message,
          type: "equipment",
        });
      });

      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      return activities.slice(0, 10);
    } catch (error) {
      throw new Error("Error fetching recent activities: " + error.message);
    }
  },

  async getMyRecentOrders(userId) {
    try {
      const [imports, exports] = await Promise.all([
        db.ImportOrder.findAll({
          where: { created_by: userId },
          attributes: ["id", "code", "status", "created_at"],
          order: [["created_at", "DESC"]],
          limit: 5,
        }),
        db.ExportOrder.findAll({
          where: { created_by: userId },
          attributes: ["id", "code", "status", "created_at"],
          order: [["created_at", "DESC"]],
          limit: 5,
        }),
      ]);

      const combined = [
        ...imports.map((o) => ({ ...o.toJSON(), orderType: "import" })),
        ...exports.map((o) => ({ ...o.toJSON(), orderType: "export" })),
      ];
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return combined.slice(0, 8);
    } catch (error) {
      throw new Error("Error fetching my recent orders: " + error.message);
    }
  },

  async getMyActivities(userId) {
    try {
      const [imports, exports] = await Promise.all([
        db.ImportOrder.findAll({
          where: { created_by: userId },
          attributes: ["id", "code", "status", "created_at"],
          order: [["created_at", "DESC"]],
          limit: 8,
        }),
        db.ExportOrder.findAll({
          where: { created_by: userId },
          attributes: ["id", "code", "status", "created_at"],
          order: [["created_at", "DESC"]],
          limit: 8,
        }),
      ]);

      const activities = [];

      imports.forEach((imp) => {
        activities.push({
          time: imp.created_at,
          message: `Created Import #${imp.code}`,
          type: "import",
          status: imp.status,
        });
      });

      exports.forEach((exp) => {
        activities.push({
          time: exp.created_at,
          message: `Created Export #${exp.code}`,
          type: "export",
          status: exp.status,
        });
      });

      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      return activities.slice(0, 10);
    } catch (error) {
      throw new Error("Error fetching my activities: " + error.message);
    }
  },
};

module.exports = DashboardService;
