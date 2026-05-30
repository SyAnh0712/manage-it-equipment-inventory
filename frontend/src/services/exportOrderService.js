import axiosClient from "./axiosClient";

const exportOrderService = {
  getAllExportOrders: async (params) => {
    return axiosClient.get("/exports", { params });
  },

  getExportOrderById: async (id) => {
    return axiosClient.get(`/exports/${id}`);
  },

  createExportOrder: async (data) => {
    return axiosClient.post("/exports", data);
  },

  updateExportOrder: async (id, data) => {
    return axiosClient.put(`/exports/${id}`, data);
  },

  deleteExportOrder: async (id) => {
    return axiosClient.delete(`/exports/${id}`);
  },

  approveExportOrder: async (id) => {
    return axiosClient.post(`/exports/${id}/approve`);
  },

  rejectExportOrder: async (id) => {
    return axiosClient.post(`/exports/${id}/reject`);
  },
};

export default exportOrderService;
