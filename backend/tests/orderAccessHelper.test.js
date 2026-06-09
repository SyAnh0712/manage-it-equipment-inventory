const {
  assertOrderReadAccess,
  buildStaffOwnershipFilter,
} = require("../src/utils/orderAccessHelper");

describe("orderAccessHelper", () => {
  describe("buildStaffOwnershipFilter", () => {
    test("returns created_by filter for staff", () => {
      expect(buildStaffOwnershipFilter({ id: 5, role: "staff" })).toEqual({
        created_by: 5,
      });
    });

    test("returns empty object for admin", () => {
      expect(buildStaffOwnershipFilter({ id: 1, role: "admin" })).toEqual({});
    });
  });

  describe("assertOrderReadAccess", () => {
    const order = { id: 1, created_by: 5 };

    test("allows admin to read any order", () => {
      expect(() =>
        assertOrderReadAccess(order, { id: 99, role: "admin" }, "Not found"),
      ).not.toThrow();
    });

    test("allows staff to read own order", () => {
      expect(() =>
        assertOrderReadAccess(order, { id: 5, role: "staff" }, "Not found"),
      ).not.toThrow();
    });

    test("denies staff from reading another users order", () => {
      expect(() =>
        assertOrderReadAccess(order, { id: 9, role: "staff" }, "Not found"),
      ).toThrow("Bạn không có quyền xem đơn hàng này");
    });

    test("throws 404 when order is missing", () => {
      try {
        assertOrderReadAccess(null, { id: 5, role: "staff" }, "Order missing");
      } catch (error) {
        expect(error.message).toBe("Order missing");
        expect(error.status).toBe(404);
      }
    });
  });
});
