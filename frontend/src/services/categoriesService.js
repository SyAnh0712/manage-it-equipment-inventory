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

const categoriesService = {
  getAllCategories: () => {
    return axiosClient.get("/categories");
  },

  getCategoryById: (id) => {
    return axiosClient.get(`/categories/${id}`);
  },

  createCategory: (data) => {
    if (data.image instanceof File) {
      const formData = buildFormData(data);
      return axiosClient.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return axiosClient.post("/categories", data);
  },

  updateCategory: (id, data) => {
    if (data.image instanceof File) {
      const formData = buildFormData(data);
      return axiosClient.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return axiosClient.put(`/categories/${id}`, data);
  },

  deleteCategory: (id) => {
    return axiosClient.delete(`/categories/${id}`);
  },
};

export default categoriesService;
