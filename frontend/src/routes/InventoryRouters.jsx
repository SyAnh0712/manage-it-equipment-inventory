import InventoryLogs from "../pages/inventory/InventoryLogs";
import AdminRoute from "./AdminRouters";

const inventoryRoutes = [
  {
    path: "/inventory-logs",
    element: (
      <AdminRoute>
        <InventoryLogs />
      </AdminRoute>
    ),
  },
];

export default inventoryRoutes;
