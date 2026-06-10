import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const SuppliersList = lazy(() => import("../pages/suppliers/SuppliersList"));
const AddSupplier = lazy(() => import("../pages/suppliers/AddSuppliers"));
const EditSupplier = lazy(() => import("../pages/suppliers/EditSuppliers"));

const suppliersRoutes = [
  {
    path: "/suppliers",
    element: (
      <AdminRoute adminOnly={true}>
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
