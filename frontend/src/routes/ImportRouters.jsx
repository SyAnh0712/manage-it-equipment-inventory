import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const ImportOrdersList = lazy(() => import("../pages/imports/ImportOrdersList"));
const AddImportOrder = lazy(() => import("../pages/imports/AddImportOrder"));
const ImportOrderDetails = lazy(() => import("../pages/imports/ImportOrderDetails"));
const EditImportOrder = lazy(() => import("../pages/imports/EditImportOrder"));

const importRoutes = [
  {
    path: "/imports",
    element: (
      <AdminRoute>
        <ImportOrdersList />
      </AdminRoute>
    ),
  },
  {
    path: "/imports/add",
    element: (
      <AdminRoute>
        <AddImportOrder />
      </AdminRoute>
    ),
  },
  {
    path: "/imports/:id",
    element: (
      <AdminRoute>
        <ImportOrderDetails />
      </AdminRoute>
    ),
  },
  {
    path: "/imports/:id/edit",
    element: (
      <AdminRoute>
        <EditImportOrder />
      </AdminRoute>
    ),
  },
];

export default importRoutes;
