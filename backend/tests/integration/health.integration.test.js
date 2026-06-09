jest.mock("../../src/models", () => require("../helpers/mockDb")());
jest.mock("../../src/utils/socket", () => require("../helpers/mockSocket"));
jest.mock("../../src/config/sequelize", () => ({
  authenticate: jest.fn(),
}));

const request = require("supertest");
const app = require("../../src/app");
const sequelize = require("../../src/config/sequelize");

describe("Health API integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/v1/health returns 200 when database is connected", async () => {
    sequelize.authenticate.mockResolvedValueOnce(undefined);

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Service is healthy",
      data: {
        status: "ok",
        database: "connected",
      },
    });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });

  test("GET /api/health remains available as legacy alias", async () => {
    sequelize.authenticate.mockResolvedValueOnce(undefined);

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("GET /api/v1/health returns 503 when database is unavailable", async () => {
    sequelize.authenticate.mockRejectedValueOnce(new Error("DB down"));

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      success: false,
      message: "Service unavailable: database disconnected",
    });
  });
});
