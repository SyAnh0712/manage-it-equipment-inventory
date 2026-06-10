import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const CategoriesList = lazy(() => import("../pages/categories/CategoriesList"));
const AddCategories = lazy(() => import("../pages/categories/AddCategories"));
const EditCategories = lazy(() => import("../pages/categories/EditCategories"));

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
