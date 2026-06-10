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
      <div className="px-3 mb-3">
        <h5 className="text-white mb-0">
          <span className="badge bg-primary">EIM</span> System
        </h5>
      </div>

      <Nav className="flex-column px-2 sidebar-nav">
        <Nav.Link as={Link} to="/dashboard" className="text-light nav-item">
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Nav.Link>

        {isAdmin && (
          <Nav.Link as={Link} to="/users" className="text-light nav-item">
            <i className="bi bi-people me-2"></i> Users
          </Nav.Link>
        )}

        <hr className="bg-secondary my-2" />
        <div className="sidebar-section-label">Management</div>

        <Nav.Link as={Link} to="/equipment" className="text-light nav-item">
          <i className="bi bi-inbox me-2"></i>{" "}
          {isAdmin ? "Equipment" : "Inventory"}
        </Nav.Link>

        {isAdmin && (
          <>
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

        <Nav.Link as={Link} to="/imports" className="text-light nav-item">
          <i className="bi bi-box-arrow-in-down me-2"></i> Import Orders
        </Nav.Link>

        <Nav.Link as={Link} to="/exports" className="text-light nav-item">
          <i className="bi bi-box-arrow-up me-2"></i> Export Orders
        </Nav.Link>

        {isAdmin && (
          <Nav.Link
            as={Link}
            to="/inventory-logs"
            className="text-light nav-item"
          >
            <i className="bi bi-journal-text me-2"></i> Inventory History
          </Nav.Link>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
