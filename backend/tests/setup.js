process.env.JWT_SECRET = process.env.JWT_SECRET || "integration-test-secret";
process.env.JWT_EXPIRES = process.env.JWT_EXPIRES || "15m";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "integration-test-refresh-secret";
process.env.JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";
process.env.NODE_ENV = "test";
