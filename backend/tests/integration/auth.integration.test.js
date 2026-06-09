jest.mock("../../src/models", () => require("../helpers/mockDb")());
jest.mock("../../src/utils/socket", () => require("../helpers/mockSocket"));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const mockDb = require("../../src/models");
const { hashPassword } = require("../../src/utils/passwordHelper");
const { refreshTokenSecret } = require("../../src/config/jwt");

describe("Auth API integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/v1/auth/login returns 400 for invalid payload", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "not-an-email", password: "123" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: "Dữ liệu không hợp lệ",
    });
  });

  test("POST /api/v1/auth/login returns 200 and sets auth cookies", async () => {
    const password = "123456";
    const hashedPassword = await hashPassword(password);
    const user = {
      id: 1,
      username: "admin",
      full_name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      is_locked: false,
      two_factor_enabled: false,
      token_version: 0,
      update: jest.fn().mockResolvedValue(undefined),
    };

    mockDb.User.findOne.mockResolvedValueOnce(user);

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@test.com", password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("admin@test.com");
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("access_token="),
        expect.stringContaining("refresh_token="),
      ]),
    );
    expect(user.update).toHaveBeenCalledWith({
      refresh_token_jti: expect.any(String),
    });
  });

  test("POST /api/v1/auth/logout revokes refresh token", async () => {
    const user = {
      id: 1,
      token_version: 0,
      refresh_token_jti: "active-jti",
      update: jest.fn(async function update(fields) {
        Object.assign(this, fields);
      }),
    };

    mockDb.User.findByPk.mockResolvedValueOnce(user);

    const refreshToken = jwt.sign(
      {
        id: 1,
        email: "admin@test.com",
        role: "admin",
        tokenVersion: 0,
        jti: "active-jti",
      },
      refreshTokenSecret,
      { expiresIn: "7d" },
    );

    const response = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", [`refresh_token=${refreshToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(user.update).toHaveBeenCalledWith({
      token_version: 1,
      refresh_token_jti: null,
    });
  });
});
