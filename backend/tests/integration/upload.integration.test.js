jest.mock("../../src/models", () => require("../helpers/mockDb")());
jest.mock("../../src/utils/socket", () => require("../helpers/mockSocket"));

const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
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

describe("Upload API integration", () => {
  let tempFilePath;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
      tempFilePath = null;
    }
  });

  test("POST /api/categories rejects non-image uploads", async () => {
    mockDb.User.findByPk.mockResolvedValueOnce(adminUser);
    tempFilePath = path.join(os.tmpdir(), `upload-test-${Date.now()}.txt`);
    await fs.writeFile(tempFilePath, "not an image");

    const token = generateAccessToken(adminUser);
    const response = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Network")
      .attach("image", tempFilePath);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Only image files are allowed");
  });
});
