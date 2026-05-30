import axiosClient from "./axiosClient";

const importOrderService = {
  getAllImportOrders: async (params) => {
    const response = await axiosClient.get("/imports", { params });
    return response.data;
  },

  getImportOrderById: async (id) => {
    const response = await axiosClient.get(`/imports/${id}`);
    return response.data;
  },

  createImportOrder: async (data) => {
    const response = await axiosClient.post("/imports", data);
    return response.data;
  },

  updateImportOrder: async (id, data) => {
    const response = await axiosClient.put(`/imports/${id}`, data);
    return response.data;
  },

  deleteImportOrder: async (id) => {
    const response = await axiosClient.delete(`/imports/${id}`);
    return response.data;
  },

  approveImportOrder: async (id) => {
    const response = await axiosClient.post(`/imports/${id}/approve`);
    return response.data;
  },

  rejectImportOrder: async (id) => {
    const response = await axiosClient.post(`/imports/${id}/reject`);
    return response.data;
  },
};

export default importOrderService;
