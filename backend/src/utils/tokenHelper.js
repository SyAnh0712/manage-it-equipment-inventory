const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");

const {
  accessTokenSecret,
  accessTokenExpires,
  refreshTokenSecret,
  refreshTokenExpires,
} = require("../config/jwt");

const buildAccessPayload = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  tokenVersion: user.token_version ?? 0,
});

const buildRefreshPayload = (user, jti) => ({
  ...buildAccessPayload(user),
  jti,
});

const generateAccessToken = (payloadOrUser) => {
  const payload =
    payloadOrUser.id !== undefined && payloadOrUser.tokenVersion !== undefined
      ? payloadOrUser
      : buildAccessPayload(payloadOrUser);

  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpires,
  });
};

const generateRefreshToken = (payloadOrUser, jti = crypto.randomUUID()) => {
  const payload =
    payloadOrUser.jti !== undefined
      ? payloadOrUser
      : buildRefreshPayload(payloadOrUser, jti);

  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpires,
  });
};

const createRefreshJti = () => crypto.randomUUID();

module.exports = {
  buildAccessPayload,
  buildRefreshPayload,
  generateAccessToken,
  generateRefreshToken,
  createRefreshJti,
};
