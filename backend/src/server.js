require("dotenv").config();

const http = require("node:http");
const app = require("./app");
const sequelize = require("./config/sequelize");
const { initSocket } = require("./utils/socket");

const PORT = process.env.PORT || 6969;
const server = http.createServer(app);

initSocket(server);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
