const jwt = require("jsonwebtoken");
const db = require("../models");
const { accessTokenSecret } = require("../config/jwt");

const extractSocketToken = (socket) => {
  const cookieToken = socket.handshake.headers.cookie
    ?.split(";")
    .find((item) => item.trim().startsWith("access_token="))
    ?.split("=")[1];

  return socket.handshake.auth?.token || cookieToken || null;
};

const authenticateSocketToken = async (token) => {
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  const decoded = jwt.verify(token, accessTokenSecret);

  if (decoded.purpose) {
    throw new Error("Invalid token");
  }

  const user = await db.User.findByPk(decoded.id);
  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  if (user.is_locked) {
    throw new Error("Account is locked");
  }

  if ((decoded.tokenVersion ?? 0) !== (user.token_version ?? 0)) {
    throw new Error("Token has been revoked");
  }

  return { decoded, user };
};

module.exports = {
  extractSocketToken,
  authenticateSocketToken,
};
