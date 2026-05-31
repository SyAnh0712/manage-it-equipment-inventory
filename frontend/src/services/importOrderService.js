import axiosClient from "./axiosClient";

const importOrderService = {
  getAllImportOrders: async (params) => {
    return axiosClient.get("/imports", { params });
  },

  getImportOrderById: async (id) => {
    return axiosClient.get(`/imports/${id}`);
  },

  createImportOrder: async (data) => {
    return axiosClient.post("/imports", data);
  },

  updateImportOrder: async (id, data) => {
    return axiosClient.put(`/imports/${id}`, data);
  },

  deleteImportOrder: async (id) => {
    return axiosClient.delete(`/imports/${id}`);
  },

  approveImportOrder: async (id) => {
    return axiosClient.post(`/imports/${id}/approve`);
  },

  rejectImportOrder: async (id) => {
    return axiosClient.post(`/imports/${id}/reject`);
  },
};

export default importOrderService;
