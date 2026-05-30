import axiosClient from "./axiosClient";

const authService = {
  login: async (credentials) => {
    const response = await axiosClient.post("/auth/login", {
      email: credentials.email || credentials.username,
      password: credentials.password,
    });

    return response.data;
  },

  register: async (data) => {
    const response = await axiosClient.post("/auth/register", data);

    return {
      token: response.data.token,
      user: response.data.user,
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
