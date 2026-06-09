const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../src/utils/tokenHelper");
const { accessTokenSecret, refreshTokenSecret } = require("../src/config/jwt");

describe("tokenHelper", () => {
  test("generateRefreshToken creates a valid refresh token", () => {
    const user = {
      id: 7,
      email: "staff@test.com",
      role: "staff",
      token_version: 0,
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, "test-jti");

    expect(typeof accessToken).toBe("string");
    expect(typeof refreshToken).toBe("string");

    expect(jwt.verify(accessToken, accessTokenSecret)).toMatchObject({
      id: 7,
      role: "staff",
      tokenVersion: 0,
    });
    expect(jwt.verify(refreshToken, refreshTokenSecret)).toMatchObject({
      id: 7,
      role: "staff",
      tokenVersion: 0,
      jti: "test-jti",
    });
  });
});
