const express = require("express");

const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./catagoryRouters");
const supplierRoutes = require("./supplierRouters");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);

module.exports = router;
