import axiosClient from "./axiosClient";

const buildFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    formData.append(key, value);
  });
  return formData;
};

const equipmentService = {
  getAllEquipments: (params) => {
    return axiosClient.get("/equipment", { params });
  },

  getEquipmentById: async (id) => {
    return axiosClient.get(`/equipment/${id}`);
  },

  createEquipment: async (data) => {
    if (data.image instanceof File) {
      const formData = buildFormData(data);
      return axiosClient.post("/equipment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return axiosClient.post("/equipment", data);
  },

  updateEquipment: async (id, data) => {
    if (data.image instanceof File) {
      const formData = buildFormData(data);
      return axiosClient.put(`/equipment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return axiosClient.put(`/equipment/${id}`, data);
  },

  deleteEquipment: async (id) => {
    const response = await axiosClient.delete(`/equipment/${id}`);
    return response.data;
  },
};

export default equipmentService;
