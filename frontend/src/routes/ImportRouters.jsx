import ImportOrdersList from "../pages/imports/ImportOrdersList";
import AddImportOrder from "../pages/imports/AddImportOrder";
import ImportOrderDetails from "../pages/imports/ImportOrderDetails";
import EditImportOrder from "../pages/imports/EditImportOrder";
import AdminRoute from "./AdminRouters";

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
