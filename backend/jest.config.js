module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.integration.test.js"],
  clearMocks: true,
  testTimeout: 10000,
  forceExit: true,
};
