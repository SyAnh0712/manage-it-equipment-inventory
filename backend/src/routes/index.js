const express = require("express");

const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./catagoryRouters");
const supplierRoutes = require("./supplierRouters");
const equipmentRoutes = require("./equipmentRouters");
const importRoutes = require("./importRoutes");
const exportRoutes = require("./exportRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/imports", importRoutes);
router.use("/exports", exportRoutes);

module.exports = router;
