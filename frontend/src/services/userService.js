import axiosClient from "./axiosClient";

const userService = {
  getAllUsers: (params) => {
    return axiosClient.get("/users", { params });
  },

  getUserById: (id) => {
    return axiosClient.get(`/users/${id}`);
  },

  createUser: (data) => {
    return axiosClient.post("/users", data);
  },

  updateUser: (id, data) => {
    return axiosClient.put(`/users/${id}`, data);
  },

  deleteUser: (id) => {
    return axiosClient.delete(`/users/${id}`);
  },

  lockUser: (id) => {
    return axiosClient.post(`/users/${id}/lock`);
  },

  unlockUser: (id) => {
    return axiosClient.post(`/users/${id}/unlock`);
  },
};

export default userService;
