const jwt = require("jsonwebtoken");

const { accessTokenSecret, accessTokenExpires } = require("../config/jwt");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpires,
  });
};

module.exports = {
  generateAccessToken,
};
