import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/css/layout/Sidebar.css";

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div
      className="sidebar bg-dark py-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <div className="px-3 mb-4">
        <h5 className="text-white mb-0">
          <span className="badge bg-primary">EIM</span> System
        </h5>
      </div>

      <Nav className="flex-column gap-2 px-2">
        <Nav.Link as={Link} to="/dashboard" className="text-light nav-item">
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Nav.Link>

        {isAdmin && (
          <>
            <hr className="bg-secondary" />
            <div className="text-muted small px-2 mb-2">MANAGEMENT</div>

            <Nav.Link as={Link} to="/users" className="text-light nav-item">
              <i className="bi bi-people me-2"></i> Users
            </Nav.Link>

            <Nav.Link as={Link} to="/equipment" className="text-light nav-item">
              <i className="bi bi-inbox me-2"></i> Equipment
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/categories"
              className="text-light nav-item"
            >
              <i className="bi bi-bookmark me-2"></i> Categories
            </Nav.Link>

            <Nav.Link as={Link} to="/suppliers" className="text-light nav-item">
              <i className="bi bi-truck me-2"></i> Suppliers
            </Nav.Link>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
