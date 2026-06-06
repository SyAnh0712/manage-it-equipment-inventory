const { sendSuccess, sendError } = require("../src/utils/responseHelper");

describe("responseHelper", () => {
  test("sendSuccess returns standard success payload", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendSuccess(res, 201, "Created", { id: 1 });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Created",
      data: { id: 1 },
    });
  });

  test("sendError returns standard failure payload", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendError(res, 400, "Invalid input", ["email is required"]);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid input",
      errors: ["email is required"],
    });
  });
});
