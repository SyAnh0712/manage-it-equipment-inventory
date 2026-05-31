import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner, Container } from "react-bootstrap";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, initialLoading, user } = useAuth();

  if (initialLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
