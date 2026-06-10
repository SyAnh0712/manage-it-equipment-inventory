import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const EditEquipments = lazy(() => import("../pages/equipment/EditEquipments"));
const EquipmentsList = lazy(() => import("../pages/equipment/EquipmentsList"));
const AddEquipments = lazy(() => import("../pages/equipment/AddEquipments"));

const equipmentRoutes = [
  {
    path: "/equipment",
    element: (
      <AdminRoute>
        <EquipmentsList />
      </AdminRoute>
    ),
  },

  {
    path: "/equipment/add",
    element: (
      <AdminRoute adminOnly={true}>
        <AddEquipments />
      </AdminRoute>
    ),
  },

  {
    path: "/equipment/:id/edit",
    element: (
      <AdminRoute adminOnly={true}>
        <EditEquipments />
      </AdminRoute>
    ),
  },
];

export default equipmentRoutes;
