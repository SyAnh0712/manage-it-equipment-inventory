import axiosClient from "./axiosClient";

const authService = {
  login: async (credentials) => {
    const response = await axiosClient.post("/auth/login", {
      email: credentials.email || credentials.username,
      password: credentials.password,
    });

    return response?.data || response;
  },

  register: async (data) => {
    const response = await axiosClient.post("/auth/register", data);
    const payload = response?.data || response;

    return {
      token: payload.token,
      user: payload.user,
    };
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  setAuthToken: (token) => {
    localStorage.setItem("authToken", token);
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getAuthToken: () => {
    return localStorage.getItem("authToken");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};

export default authService;
