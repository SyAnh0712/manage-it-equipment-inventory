require("dotenv").config();

module.exports = {
  accessTokenSecret: process.env.JWT_SECRET,
  accessTokenExpires: process.env.JWT_EXPIRES,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  refreshTokenExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
};
