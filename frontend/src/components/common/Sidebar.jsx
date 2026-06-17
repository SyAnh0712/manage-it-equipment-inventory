import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/css/layout/Sidebar.css";

/* ─── Icon helper ─────────────────────────────────────────── */
const MatIcon = ({ name, filled = false, className = "" }) => (
  <span
    className={`material-symbols-outlined sb-icon ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

/* ─── Nav Link item ───────────────────────────────────────── */
const NavItem = ({ to, icon, label, filled = false }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={`sb-nav-item${isActive ? " sb-nav-item--active" : ""}`}
    >
      <MatIcon name={icon} filled={isActive || filled} />
      <span className="sb-nav-label">{label}</span>
      {isActive && <span className="sb-nav-item__indicator" />}
    </Link>
  );
};

/* ─── Section group label ─────────────────────────────────── */
const NavGroup = ({ label, children }) => (
  <div className="sb-nav-group">
    <h3 className="sb-nav-group__label">{label}</h3>
    <div className="sb-nav-group__items">{children}</div>
  </div>
);

/* ─── Sidebar Component ───────────────────────────────────── */
const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /* Derive display name / initials */
  const displayName = user?.full_name || user?.username || "User";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const roleLabel = isAdmin ? "System Admin" : "Staff";

  return (
    <aside className="sb-root" id="main-sidebar">
      {/* ── Branding ───────────────────────────── */}
      <div className="sb-brand">
        <div className="sb-brand__icon-wrap">
          <MatIcon name="dns" className="sb-brand__icon" />
        </div>
        <div className="sb-brand__text">
          <span className="sb-brand__name">EIM System</span>
          <div className="sb-brand__meta">
            <span className="sb-brand__version">v2.4.0</span>
            <span className="sb-brand__status">
              <span className="sb-brand__dot" />
              Production
            </span>
          </div>
        </div>
      </div>

      {/* ── Scrollable Navigation ──────────────── */}
      <nav className="sb-nav" aria-label="Main navigation">
        {/* Solo: Dashboard */}
        <div className="sb-nav-solo">
          <NavItem to="/dashboard" icon="dashboard" label="Dashboard" filled />
        </div>

        {/* Administration — admin only */}
        {isAdmin && (
          <NavGroup label="Administration">
            <NavItem to="/users" icon="group" label="Users" />
          </NavGroup>
        )}

        {/* Management */}
        <NavGroup label="Management">
          <NavItem
            to="/equipment"
            icon="inventory_2"
            label={isAdmin ? "Equipment" : "Inventory"}
          />
          {isAdmin && (
            <>
              <NavItem to="/categories" icon="sell" label="Categories" />
              <NavItem
                to="/suppliers"
                icon="local_shipping"
                label="Suppliers"
              />
            </>
          )}
        </NavGroup>

        {/* Operations */}
        <NavGroup label="Operations">
          <NavItem to="/imports" icon="download" label="Import Orders" />
          <NavItem to="/exports" icon="upload" label="Export Orders" />
        </NavGroup>

        {/* Reports — admin only */}
        {isAdmin && (
          <NavGroup label="Reports">
            <NavItem
              to="/inventory-logs"
              icon="history"
              label="Inventory History"
            />
          </NavGroup>
        )}
      </nav>

      {/* ── Add Asset CTA ──────────────────────── */}
      {isAdmin && (
        <div className="sb-cta">
          <Link to="/equipment/add" className="sb-cta__btn">
            <MatIcon name="add_circle" className="sb-cta__icon" />
            Add Asset
          </Link>
        </div>
      )}

      {/* ── User Panel Footer ──────────────────── */}
      <div className="sb-footer">
        <div className="sb-user">
          {/* Avatar */}
          <div className="sb-user__avatar-wrap">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="sb-user__avatar"
              />
            ) : (
              <div className="sb-user__avatar-initials">{initials}</div>
            )}
            <span className="sb-user__status-dot" />
          </div>

          {/* Info */}
          <div className="sb-user__info">
            <p className="sb-user__name">{displayName}</p>
            <p className="sb-user__role">{roleLabel}</p>
          </div>

          {/* Settings shortcut */}
          <Link
            to="/profile"
            className="sb-user__settings"
            aria-label="Profile settings"
          >
            <MatIcon name="settings" />
          </Link>
        </div>

        {/* Logout */}
        <button
          className="sb-logout"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <MatIcon name="logout" className="sb-logout__icon" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
