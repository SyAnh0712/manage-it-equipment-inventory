jest.mock("../src/models", () => require("./helpers/mockDb")());

const jwt = require("jsonwebtoken");
const mockDb = require("../src/models");
const { accessTokenSecret } = require("../src/config/jwt");
const {
  extractSocketToken,
  authenticateSocketToken,
} = require("../src/utils/socketAuth");

describe("socketAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("extractSocketToken reads token from handshake auth", () => {
    const token = extractSocketToken({
      handshake: {
        auth: { token: "abc123" },
        headers: {},
      },
    });

    expect(token).toBe("abc123");
  });

  test("authenticateSocketToken rejects revoked tokens", async () => {
    mockDb.User.findByPk.mockResolvedValueOnce({
      id: 1,
      is_locked: false,
      token_version: 2,
    });

    const token = jwt.sign(
      { id: 1, tokenVersion: 1 },
      accessTokenSecret,
      { expiresIn: "15m" },
    );

    await expect(authenticateSocketToken(token)).rejects.toThrow(
      "Token has been revoked",
    );
  });

  test("authenticateSocketToken accepts valid token", async () => {
    mockDb.User.findByPk.mockResolvedValueOnce({
      id: 1,
      is_locked: false,
      token_version: 0,
    });

    const token = jwt.sign(
      { id: 1, tokenVersion: 0 },
      accessTokenSecret,
      { expiresIn: "15m" },
    );

    const result = await authenticateSocketToken(token);
    expect(result.user.id).toBe(1);
  });
});
