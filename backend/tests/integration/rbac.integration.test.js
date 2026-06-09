jest.mock("../../src/models", () => require("../helpers/mockDb")());
jest.mock("../../src/utils/socket", () => require("../helpers/mockSocket"));

const request = require("supertest");
const app = require("../../src/app");
const mockDb = require("../../src/models");
const { generateAccessToken } = require("../../src/utils/tokenHelper");

const staffUser = {
  id: 2,
  username: "staff1",
  full_name: "Staff User",
  email: "staff@test.com",
  role: "staff",
  is_locked: false,
  token_version: 0,
};

describe("RBAC API integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("staff cannot access admin user list", async () => {
    mockDb.User.findByPk.mockResolvedValueOnce(staffUser);

    const token = generateAccessToken(staffUser);
    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("staff can access current profile", async () => {
    mockDb.User.findByPk.mockResolvedValueOnce(staffUser);

    const token = generateAccessToken(staffUser);
    const response = await request(app)
      .get("/api/v1/users/profile/current")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(staffUser.id);
  });
});
