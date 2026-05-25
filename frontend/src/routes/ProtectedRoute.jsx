import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return null; // Sẽ redirect tại AppRoutes level
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null; // Sẽ redirect tại AppRoutes level
  }

  return children;
};
