require("dotenv").config();

module.exports = {
  accessTokenSecret: process.env.JWT_SECRET,
  accessTokenExpires: process.env.JWT_EXPIRES,
};
