import CategoriesList from "../pages/catagories/CategoriesList";
import AddCategories from "../pages/catagories/AddCategories";
import EditCategories from "../pages/catagories/EditCategories";

import AdminRoute from "./AdminRouters";

const categoriesRoutes = [
  {
    path: "/categories",
    element: (
      <AdminRoute>
        <CategoriesList />
      </AdminRoute>
    ),
  },

  {
    path: "/categories/add",
    element: (
      <AdminRoute>
        <AddCategories />
      </AdminRoute>
    ),
  },

  {
    path: "/categories/:id/edit",
    element: (
      <AdminRoute>
        <EditCategories />
      </AdminRoute>
    ),
  },
];

export default categoriesRoutes;
