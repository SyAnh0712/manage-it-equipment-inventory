jest.mock("../../src/models", () => require("../helpers/mockDb")());
jest.mock("../../src/utils/socket", () => require("../helpers/mockSocket"));

const request = require("supertest");
const app = require("../../src/app");
const mockDb = require("../../src/models");
const { generateAccessToken } = require("../../src/utils/tokenHelper");

const adminUser = {
  id: 1,
  username: "admin",
  full_name: "Admin User",
  email: "admin@test.com",
  role: "admin",
  is_locked: false,
  token_version: 0,
};

describe("Validation API integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/v1/users rejects invalid admin payload", async () => {
    mockDb.User.findByPk.mockResolvedValueOnce(adminUser);

    const token = generateAccessToken(adminUser);
    const response = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "ab", email: "invalid-email" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: "Dữ liệu không hợp lệ",
    });
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test("POST /api/v1/equipment rejects missing foreign keys", async () => {
    mockDb.User.findByPk.mockResolvedValueOnce(adminUser);
    mockDb.Category.findByPk.mockResolvedValueOnce(null);

    const token = generateAccessToken(adminUser);
    const response = await request(app)
      .post("/api/v1/equipment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "EQ-001",
        name: "Laptop",
        category_id: 99,
        supplier_id: 1,
        unit: "pcs",
        quantity: 1,
        price: 1000,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Category not found");
  });
});
