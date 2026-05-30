import axiosClient from "./axiosClient";

const inventoryLogService = {
  getAllInventoryLogs: async (params) => {
    const response = await axiosClient.get("/inventory-logs", { params });
    return response.data;
  },

  adjustInventory: async (data) => {
    const response = await axiosClient.post("/inventory-logs/adjust", data);
    return response.data;
  },
};

export default inventoryLogService;
