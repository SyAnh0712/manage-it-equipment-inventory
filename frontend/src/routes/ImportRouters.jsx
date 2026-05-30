import ImportOrdersList from "../pages/imports/ImportOrdersList";
import AddImportOrder from "../pages/imports/AddImportOrder";
import EditImportOrder from "../pages/imports/EditImportOrder";
import ProtectedRoute from "./ProtectedRoute";

const importRoutes = [
  {
    path: "/imports",
    element: (
      <ProtectedRoute>
        <ImportOrdersList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/imports/add",
    element: (
      <ProtectedRoute>
        <AddImportOrder />
      </ProtectedRoute>
    ),
  },
  {
    path: "/imports/:id/edit",
    element: (
      <ProtectedRoute>
        <EditImportOrder />
      </ProtectedRoute>
    ),
  },
];

export default importRoutes;
