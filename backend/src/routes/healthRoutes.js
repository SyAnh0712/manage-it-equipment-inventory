const express = require("express");
const sequelize = require("../config/sequelize");
const { sendSuccess, sendError } = require("../utils/responseHelper");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();

    return sendSuccess(res, 200, "Service is healthy", {
      status: "ok",
      uptime: process.uptime(),
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return sendError(res, 503, "Service unavailable: database disconnected");
  }
});

module.exports = router;
