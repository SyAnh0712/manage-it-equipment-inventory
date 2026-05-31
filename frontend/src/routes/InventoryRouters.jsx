import InventoryLogs from "../pages/inventory/InventoryLogs";
import AdminRoute from "./AdminRouters";

const inventoryRoutes = [
  {
    path: "/inventory-logs",
    element: (
      <AdminRoute adminOnly={true}>
        <InventoryLogs />
      </AdminRoute>
    ),
  },
];

export default inventoryRoutes;
