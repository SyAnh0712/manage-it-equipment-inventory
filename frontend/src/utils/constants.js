export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
};

export const ROLE_LABELS = {
  admin: "Administrator",
  staff: "Staff",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
  },
  USERS: {
    GET_ALL: "/users",
    GET_ONE: "/users/:id",
    CREATE: "/users",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
  },
};
