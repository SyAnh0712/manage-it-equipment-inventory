import SuppliersList from "../pages/suppliers/SuppliersList";
import AddSupplier from "../pages/suppliers/AddSuppliers";
import EditSupplier from "../pages/suppliers/EditSuppliers";

import AdminRoute from "./AdminRouters";

const suppliersRoutes = [
  {
    path: "/suppliers",
    element: (
      <AdminRoute>
        <SuppliersList />
      </AdminRoute>
    ),
  },

  {
    path: "/suppliers/add",
    element: (
      <AdminRoute adminOnly={true}>
        <AddSupplier />
      </AdminRoute>
    ),
  },

  {
    path: "/suppliers/:id/edit",
    element: (
      <AdminRoute adminOnly={true}>
        <EditSupplier />
      </AdminRoute>
    ),
  },
];

export default suppliersRoutes;
