const express = require("express");

const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./categoryRouters");
const supplierRoutes = require("./supplierRouters");
const equipmentRoutes = require("./equipmentRouters");
const importRoutes = require("./importRoutes");
const exportRoutes = require("./exportRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const inventoryLogRoutes = require("./inventoryLogRoutes");
const healthRoutes = require("./healthRoutes");

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/imports", importRoutes);
router.use("/exports", exportRoutes);
router.use("/inventory-logs", inventoryLogRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
