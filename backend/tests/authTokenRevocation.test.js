const jwt = require("jsonwebtoken");

const mockUser = {
  id: 1,
  username: "admin",
  full_name: "Admin",
  email: "admin@test.com",
  role: "admin",
  token_version: 0,
  refresh_token_jti: null,
  update: jest.fn(async function update(fields) {
    Object.assign(this, fields);
    return this;
  }),
};

const mockDb = {
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
  },
};

jest.mock("../src/models", () => mockDb);

const { refreshTokenSecret } = require("../src/config/jwt");
const authService = require("../src/services/auth/authServices");

describe("auth token revocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.token_version = 0;
    mockUser.refresh_token_jti = null;
    mockUser.update.mockClear();
  });

  test("logoutService revokes refresh token by incrementing token_version", async () => {
    mockUser.refresh_token_jti = "active-jti";
    mockDb.User.findByPk.mockResolvedValueOnce(mockUser);

    const refreshToken = jwt.sign(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        tokenVersion: 0,
        jti: "active-jti",
      },
      refreshTokenSecret,
      { expiresIn: "7d" },
    );

    await authService.logoutService(refreshToken);

    expect(mockUser.update).toHaveBeenCalledWith({
      token_version: 1,
      refresh_token_jti: null,
    });
  });

  test("refreshTokenService rejects reused refresh token", async () => {
    mockUser.refresh_token_jti = "current-jti";
    mockDb.User.findByPk.mockResolvedValueOnce(mockUser);

    const reusedRefreshToken = jwt.sign(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        tokenVersion: 0,
        jti: "old-jti",
      },
      refreshTokenSecret,
      { expiresIn: "7d" },
    );

    await expect(
      authService.refreshTokenService(reusedRefreshToken),
    ).rejects.toThrow("Refresh token không hợp lệ hoặc đã bị thu hồi");

    expect(mockUser.update).toHaveBeenCalledWith({
      token_version: 1,
      refresh_token_jti: null,
    });
  });

  test("refreshTokenService rotates refresh token on success", async () => {
    mockUser.refresh_token_jti = "current-jti";
    mockDb.User.findByPk.mockResolvedValueOnce(mockUser);

    const refreshToken = jwt.sign(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        tokenVersion: 0,
        jti: "current-jti",
      },
      refreshTokenSecret,
      { expiresIn: "7d" },
    );

    const result = await authService.refreshTokenService(refreshToken);

    expect(result.token).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.refreshToken).not.toBe(refreshToken);
    expect(mockUser.update).toHaveBeenCalledWith({
      refresh_token_jti: expect.any(String),
    });
    expect(mockUser.refresh_token_jti).not.toBe("current-jti");
  });
});
