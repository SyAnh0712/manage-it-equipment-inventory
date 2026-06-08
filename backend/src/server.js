require("dotenv").config();

const server = require("./app");
const sequelize = require("./config/sequelize");

const PORT = process.env.PORT || 6969;

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
