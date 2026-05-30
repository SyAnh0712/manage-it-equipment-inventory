const { createError, rethrowServiceError } = require("../src/utils/httpError");

describe("httpError utils", () => {
  describe("createError", () => {
    test("creates error with message and status", () => {
      const error = createError("Not found", 404);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Not found");
      expect(error.status).toBe(404);
    });

    test("defaults status to 500", () => {
      const error = createError("Server error");

      expect(error.status).toBe(500);
    });
  });

  describe("rethrowServiceError", () => {
    test("rethrows error with status unchanged", () => {
      const original = createError("Forbidden", 403);

      expect(() => rethrowServiceError(original, "Prefix")).toThrow("Forbidden");

      try {
        rethrowServiceError(original, "Prefix");
      } catch (error) {
        expect(error.status).toBe(403);
      }
    });

    test("wraps generic error with prefix", () => {
      const original = new Error("DB connection failed");

      expect(() =>
        rethrowServiceError(original, "Error fetching data"),
      ).toThrow("Error fetching data: DB connection failed");
    });
  });
});
