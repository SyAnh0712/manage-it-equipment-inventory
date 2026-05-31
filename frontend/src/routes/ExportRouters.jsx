import ExportOrdersList from "../pages/exports/ExportOrdersList";
import AddExportOrder from "../pages/exports/AddExportOrder";
import ExportOrderDetails from "../pages/exports/ExportOrderDetails";
import EditExportOrder from "../pages/exports/EditExportOrder";
import AdminRoute from "./AdminRouters";

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
