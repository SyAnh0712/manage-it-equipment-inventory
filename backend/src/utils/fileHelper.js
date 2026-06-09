const fs = require("node:fs/promises");
const path = require("node:path");

const uploadsDir = path.join(__dirname, "../../uploads");

const toUploadPath = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  if (!imageUrl.startsWith("/uploads/")) {
    return null;
  }

  return path.join(uploadsDir, path.basename(imageUrl));
};

const deleteUploadIfExists = async (imageUrl) => {
  const filePath = toUploadPath(imageUrl);
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

module.exports = {
  uploadsDir,
  toUploadPath,
  deleteUploadIfExists,
};
