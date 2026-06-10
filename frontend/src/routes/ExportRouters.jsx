import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const ExportOrdersList = lazy(() => import("../pages/exports/ExportOrdersList"));
const AddExportOrder = lazy(() => import("../pages/exports/AddExportOrder"));
const ExportOrderDetails = lazy(() => import("../pages/exports/ExportOrderDetails"));
const EditExportOrder = lazy(() => import("../pages/exports/EditExportOrder"));

const exportRoutes = [
  {
    path: "/exports",
    element: (
      <AdminRoute>
        <ExportOrdersList />
      </AdminRoute>
    ),
  },
  {
    path: "/exports/add",
    element: (
      <AdminRoute>
        <AddExportOrder />
      </AdminRoute>
    ),
  },
  {
    path: "/exports/:id",
    element: (
      <AdminRoute>
        <ExportOrderDetails />
      </AdminRoute>
    ),
  },
  {
    path: "/exports/:id/edit",
    element: (
      <AdminRoute>
        <EditExportOrder />
      </AdminRoute>
    ),
  },
];

export default exportRoutes;
