import axiosClient from "./axiosClient";

const authService = {
  login: async (credentials) => {
    const response = await axiosClient.post("/auth/login", {
      email: credentials.email || credentials.username,
      password: credentials.password,
    });
    const authData = response.data;

    return {
      token: authData.token,
      user: {
        id: authData.user.id,
        username: authData.user.username,
        full_name: authData.user.full_name || authData.user.fullname,
        email: authData.user.email,
        role: authData.user.role,
      },
    };
  },

  register: async (data) => {
    const response = await axiosClient.post("/auth/register", data);

    // response is { success, message, data: { token, user } }
    const userData = response.data;

    return {
      token: userData.token,
      user: {
        id: userData.user.id,
        username: userData.user.username,
        full_name: userData.user.full_name,
        email: userData.user.email,
        role: userData.user.role,
      },
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
