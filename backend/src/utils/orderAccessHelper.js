const { createError } = require("./httpError");

const assertOrderReadAccess = (order, user, notFoundMessage) => {
  if (!order) {
    throw createError(notFoundMessage, 404);
  }

  if (user?.role === "admin") {
    return;
  }

  if (String(order.created_by) !== String(user?.id)) {
    throw createError("Bạn không có quyền xem đơn hàng này", 403);
  }
};

const buildStaffOwnershipFilter = (user) => {
  if (user?.role === "staff") {
    return { created_by: user.id };
  }

  return {};
};

module.exports = {
  assertOrderReadAccess,
  buildStaffOwnershipFilter,
};
