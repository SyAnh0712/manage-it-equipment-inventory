import Dashboard from "../pages/dashboard/Dashboard";
import AdminRoute from "./AdminRouters";

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
