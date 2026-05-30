const roleMiddleware = require("../src/middlewares/roleMiddleware");

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("roleMiddleware", () => {
  test("calls next when user has allowed role", () => {
    const middleware = roleMiddleware("admin");
    const req = { user: { id: 1, role: "admin" } };
    const res = createMockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("returns 401 when user is missing", () => {
    const middleware = roleMiddleware("admin");
    const req = {};
    const res = createMockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when staff accesses admin-only route", () => {
    const middleware = roleMiddleware("admin");
    const req = { user: { id: 2, role: "staff" } };
    const res = createMockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("admin"),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("accepts multiple allowed roles", () => {
    const middleware = roleMiddleware("admin", "staff");
    const req = { user: { id: 2, role: "staff" } };
    const res = createMockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
