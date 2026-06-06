const jwt = require("jsonwebtoken");

const {
  accessTokenSecret,
  accessTokenExpires,
  refreshTokenSecret,
  refreshTokenExpires,
} = require("../config/jwt");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpires,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpires,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
