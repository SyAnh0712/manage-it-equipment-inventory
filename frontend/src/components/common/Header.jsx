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
      <div className="container-fluid d-flex align-items-center">
        <div className="d-flex align-items-center gap-2 ms-auto">
          <span>Welcome,</span>
          <strong>{user?.full_name}</strong>
        </div>
      </div>
    </header>
  );
};

export default Header;
