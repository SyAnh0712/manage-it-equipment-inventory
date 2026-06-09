const fs = require("node:fs/promises");
const path = require("node:path");
const {
  uploadsDir,
  toUploadPath,
  deleteUploadIfExists,
} = require("../src/utils/fileHelper");

describe("fileHelper", () => {
  test("toUploadPath resolves upload URLs to disk paths", () => {
    const filePath = toUploadPath("/uploads/example.png");
    expect(filePath).toBe(path.join(uploadsDir, "example.png"));
    expect(toUploadPath("https://cdn.example.com/a.png")).toBeNull();
  });

  test("deleteUploadIfExists removes files safely", async () => {
    const filename = `test-${Date.now()}.png`;
    const imageUrl = `/uploads/${filename}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, "test");
    await deleteUploadIfExists(imageUrl);

    await expect(fs.access(filePath)).rejects.toThrow();
    await expect(deleteUploadIfExists(imageUrl)).resolves.toBeUndefined();
  });
});
