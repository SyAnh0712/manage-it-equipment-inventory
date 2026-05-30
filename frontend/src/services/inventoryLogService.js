import axiosClient from "./axiosClient";

const inventoryLogService = {
  getAllInventoryLogs: async (params) => {
    return axiosClient.get("/inventory-logs", { params });
  },

  adjustInventory: async (data) => {
    return axiosClient.post("/inventory-logs/adjust", data);
  },
};

export default inventoryLogService;
