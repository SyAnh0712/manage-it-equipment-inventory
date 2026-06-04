const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;
