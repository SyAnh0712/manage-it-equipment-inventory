import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/css/layout/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header bg-white shadow-sm py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h5 mb-0">Equipment Inventory Management</h1>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div>
            <span className="me-2">Welcome,</span>
            <strong>{user?.full_name}</strong>
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
