const { sendError } = require("../src/utils/responseHelper");
const { rateLimitHandler } = require("../src/middlewares/rateLimitMiddleware");

jest.mock("../src/utils/responseHelper", () => ({
  sendError: jest.fn(),
}));

describe("rateLimitMiddleware", () => {
  test("rateLimitHandler returns standard 429 error payload", () => {
    const res = {};

    rateLimitHandler({}, res);

    expect(sendError).toHaveBeenCalledWith(
      res,
      429,
      "Quá nhiều yêu cầu, vui lòng thử lại sau",
    );
  });
});
