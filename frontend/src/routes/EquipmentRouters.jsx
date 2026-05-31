import EditEquipments from "../pages/equipment/EditEquipments";
import EquipmentsList from "../pages/equipment/EquipmentsList";
import AddEquipments from "../pages/equipment/AddEquipments";

import AdminRoute from "./AdminRouters";

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
