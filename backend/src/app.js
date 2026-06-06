const express = require("express");
const http = require("node:http");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const logger = require("./utils/logger");
const { initSocket } = require("./utils/socket");

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev", { stream: logger.stream }));
app.use("/uploads", express.static("uploads"));

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = server;
