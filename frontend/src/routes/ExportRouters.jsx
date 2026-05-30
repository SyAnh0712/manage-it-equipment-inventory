import ExportOrdersList from "../pages/exports/ExportOrdersList";
import AddExportOrder from "../pages/exports/AddExportOrder";
import EditExportOrder from "../pages/exports/EditExportOrder";
import ProtectedRoute from "./ProtectedRoute";

const exportRoutes = [
  {
    path: "/exports",
    element: (
      <ProtectedRoute>
        <ExportOrdersList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exports/add",
    element: (
      <ProtectedRoute>
        <AddExportOrder />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exports/:id/edit",
    element: (
      <ProtectedRoute>
        <EditExportOrder />
      </ProtectedRoute>
    ),
  },
];

export default exportRoutes;
