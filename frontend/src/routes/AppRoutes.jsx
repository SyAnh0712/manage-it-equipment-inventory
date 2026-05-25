import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import UsersList from "../pages/users/UsersList";
import AddUsers from "../pages/users/AddUsers";
import EditUsers from "../pages/users/EditUsers";
import NotFound from "../pages/errors/NotFound";

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* User Management Routes - Admin only */}
        <Route
          path="/users"
          element={
            isAuthenticated && isAdmin ? (
              <AdminLayout>
                <UsersList />
              </AdminLayout>
            ) : isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/users/add"
          element={
            isAuthenticated && isAdmin ? (
              <AdminLayout>
                <AddUsers />
              </AdminLayout>
            ) : isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/users/:id/edit"
          element={
            isAuthenticated && isAdmin ? (
              <AdminLayout>
                <EditUsers />
              </AdminLayout>
            ) : isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
