import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

const dashboardRoutes = [
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
  },
];

export default dashboardRoutes;
