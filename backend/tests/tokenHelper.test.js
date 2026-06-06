const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../src/utils/tokenHelper");
const { accessTokenSecret, refreshTokenSecret } = require("../src/config/jwt");

describe("tokenHelper", () => {
  test("generateRefreshToken creates a valid refresh token", () => {
    const payload = { id: 7, role: "staff" };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    expect(typeof accessToken).toBe("string");
    expect(typeof refreshToken).toBe("string");

    expect(jwt.verify(accessToken, accessTokenSecret)).toMatchObject(payload);
    expect(jwt.verify(refreshToken, refreshTokenSecret)).toMatchObject(payload);
  });
});
