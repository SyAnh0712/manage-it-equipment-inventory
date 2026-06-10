import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const CategoriesList = lazy(() => import("../pages/catagories/CategoriesList"));
const AddCategories = lazy(() => import("../pages/catagories/AddCategories"));
const EditCategories = lazy(() => import("../pages/catagories/EditCategories"));

const categoriesRoutes = [
  {
    path: "/categories",
    element: (
      <AdminRoute adminOnly={true}>
        <CategoriesList />
      </AdminRoute>
    ),
  },

  {
    path: "/categories/add",
    element: (
      <AdminRoute adminOnly={true}>
        <AddCategories />
      </AdminRoute>
    ),
  },

  {
    path: "/categories/:id/edit",
    element: (
      <AdminRoute adminOnly={true}>
        <EditCategories />
      </AdminRoute>
    ),
  },
];

export default categoriesRoutes;
