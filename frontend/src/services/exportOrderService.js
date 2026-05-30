import axiosClient from "./axiosClient";

const exportOrderService = {
  getAllExportOrders: async (params) => {
    const response = await axiosClient.get("/exports", { params });
    return response.data;
  },

  getExportOrderById: async (id) => {
    const response = await axiosClient.get(`/exports/${id}`);
    return response.data;
  },

  createExportOrder: async (data) => {
    const response = await axiosClient.post("/exports", data);
    return response.data;
  },

  updateExportOrder: async (id, data) => {
    const response = await axiosClient.put(`/exports/${id}`, data);
    return response.data;
  },

  deleteExportOrder: async (id) => {
    const response = await axiosClient.delete(`/exports/${id}`);
    return response.data;
  },

  approveExportOrder: async (id) => {
    const response = await axiosClient.post(`/exports/${id}/approve`);
    return response.data;
  },

  rejectExportOrder: async (id) => {
    const response = await axiosClient.post(`/exports/${id}/reject`);
    return response.data;
  },
};

export default exportOrderService;
