const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const logger = require("./utils/logger");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev", { stream: logger.stream }));
app.use("/uploads", express.static("uploads"));

app.use("/api/v1", routes);
app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;
