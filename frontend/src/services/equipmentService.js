import axiosClient from "./axiosClient";

const equipmentService = {
  getAllEquipments: async () => {
    const response = await axiosClient.get("/equipment");
    return response.data;
  },

  getEquipmentById: async (id) => {
    const response = await axiosClient.get(`/equipment/${id}`);
    return response.data;
  },

  createEquipment: async (data) => {
    const response = await axiosClient.post("/equipment", data);
    return response.data;
  },

  updateEquipment: async (id, data) => {
    const response = await axiosClient.put(`/equipment/${id}`, data);
    return response.data;
  },

  deleteEquipment: async (id) => {
    const response = await axiosClient.delete(`/equipment/${id}`);
    return response.data;
  },
};

export default equipmentService;
