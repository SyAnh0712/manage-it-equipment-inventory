const {
  hashPassword,
  comparePassword,
} = require("../src/utils/passwordHelper");

describe("passwordHelper", () => {
  test("hashes password and compare returns true for correct password", async () => {
    const plain = "123456";
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    expect(await comparePassword(plain, hashed)).toBe(true);
  });

  test("compare returns false for wrong password", async () => {
    const hashed = await hashPassword("correct-password");

    expect(await comparePassword("wrong-password", hashed)).toBe(false);
  });
});
