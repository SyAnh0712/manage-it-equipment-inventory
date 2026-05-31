import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

const AdminRoute = ({ children, adminOnly = false }) => {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminRoute;
