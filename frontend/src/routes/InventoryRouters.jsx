import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const InventoryLogs = lazy(() => import("../pages/inventory/InventoryLogs"));

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
