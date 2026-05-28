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
      <AdminRoute adminOnly>
        <AddEquipments />
      </AdminRoute>
    ),
  },

  {
    path: "/equipment/:id/edit",
    element: (
      <AdminRoute adminOnly>
        <EditEquipments />
      </AdminRoute>
    ),
  },
];

export default equipmentRoutes;
