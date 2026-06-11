import { useEffect, useState } from "react";
import { Alert, Badge, Card, Col, Container, Row } from "react-bootstrap";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import EmptyState from "../../components/common/EmptyState";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../hooks/useAuth";
import axiosClient from "../../services/axiosClient";
import "./Dashboard.css";

const MotionCard = motion(Card);
const MotionLink = motion(Link);

const MonthlyImportExportChart = ({ data }) => {
  return (
    <Card className="dashboard-panel h-100 shadow-sm border-0">
      <Card.Header className="bg-white border-bottom-0 pt-3 pb-0">
        <span className="fw-bold text-secondary">
          <i className="bi bi-calendar-range me-2 text-primary"></i>
          Import/Export Volume (Last 6 Months)
        </span>
      </Card.Header>
      <Card.Body style={{ minHeight: "320px" }}>
        {data.length === 0 ? (
          <EmptyState icon="bi-calendar-range" title="No transaction history" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)" }}
                labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="import" name="Import" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="export" name="Export" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

const CategoryDistributionChart = ({ data }) => {
  const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

  return (
    <Card className="dashboard-panel h-100 shadow-sm border-0">
      <Card.Header className="bg-white border-bottom-0 pt-3 pb-0">
        <span className="fw-bold text-secondary">
          <i className="bi bi-pie-chart me-2 text-primary"></i>
          Category Distribution
        </span>
      </Card.Header>
      <Card.Body className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "320px" }}>
        {data.length === 0 ? (
          <EmptyState icon="bi-pie-chart" title="No category distribution data" />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [`${value} units (${props.payload.percentage}%)`, name]}
                  contentStyle={{ background: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="category-legend w-100 px-2 mt-2" style={{ maxHeight: "100px", overflowY: "auto" }}>
              <Row className="g-2">
                {data.map((item, index) => (
                  <Col xs={6} key={index} className="d-flex align-items-center text-truncate" style={{ fontSize: "0.78rem" }}>
                    <span
                      className="d-inline-block rounded-circle me-2"
                      style={{ width: "8px", height: "8px", backgroundColor: COLORS[index % COLORS.length], flexShrink: 0 }}
                    ></span>
                    <span className="text-muted text-truncate me-1" title={item.name}>{item.name}:</span>
                    <strong className="text-dark">{item.percentage}%</strong>
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

const TopEquipmentChart = ({ data }) => {
  return (
    <Card className="dashboard-panel h-100 shadow-sm border-0">
      <Card.Header className="bg-white border-bottom-0 pt-3 pb-0">
        <span className="fw-bold text-secondary">
          <i className="bi bi-bar-chart-steps me-2 text-primary"></i>
          Top Stock Equipment
        </span>
      </Card.Header>
      <Card.Body style={{ minHeight: "320px" }}>
        {data.length === 0 ? (
          <EmptyState icon="bi-bar-chart" title="No inventory items found" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#0f172a", fontSize: 11, fontWeight: "600" }}
                width={120}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => (value.length > 18 ? `${value.slice(0, 15)}...` : value)}
              />
              <Tooltip
                formatter={(value) => [`${value} units`, "Quantity"]}
                contentStyle={{ background: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              />
              <Bar dataKey="quantity" fill="#10b981" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

const RecentActivitiesTimeline = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case "import":
        return { icon: "bi-box-arrow-in-down", color: "#3b82f6", bg: "#eff6ff" };
      case "export":
        return { icon: "bi-box-arrow-up", color: "#db2777", bg: "#fce7f3" };
      case "equipment":
        return { icon: "bi-plus-circle", color: "#059669", bg: "#ecfdf5" };
      default:
        return { icon: "bi-activity", color: "#4b5563", bg: "#f3f4f6" };
    }
  };

  return (
    <Card className="dashboard-panel h-100 shadow-sm border-0">
      <Card.Header className="bg-white border-bottom-0 pt-3 pb-0">
        <span className="fw-bold text-secondary">
          <i className="bi bi-clock-history me-2 text-primary"></i>
          Recent Operations Timeline
        </span>
      </Card.Header>
      <Card.Body style={{ minHeight: "320px", maxHeight: "320px", overflowY: "auto" }} className="pt-3">
        {activities.length === 0 ? (
          <EmptyState icon="bi-clock-history" title="No recent operations logged" />
        ) : (
          <div className="timeline-container">
            {activities.map((act, index) => {
              const { icon, color, bg } = getIcon(act.type);
              const dateObj = new Date(act.time);
              const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

              return (
                <div className="timeline-item" key={index}>
                  <div className="timeline-badge" style={{ backgroundColor: bg, color: color }}>
                    <i className={`bi ${icon}`}></i>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-time text-muted">
                        {timeStr} <span className="timeline-date-sep">•</span> {dateStr}
                      </span>
                      {act.status && (
                        <Badge
                          bg={
                            act.status === "approved"
                              ? "success"
                              : act.status === "rejected"
                                ? "danger"
                                : "warning"
                          }
                          className="timeline-status-badge text-capitalize"
                        >
                          {act.status}
                        </Badge>
                      )}
                    </div>
                    <p className="timeline-message">{act.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};


const formatNumber = (value) => Number(value || 0).toLocaleString();

const StatCardContent = ({ icon, label, value, hint }) => (
  <Card.Body>
    <div className="dashboard-stat-top">
      <span className="dashboard-stat-icon">
        <i className={`bi ${icon}`}></i>
      </span>
      <span className="dashboard-stat-label">{label}</span>
    </div>
    <div className="dashboard-stat-value">{formatNumber(value)}</div>
    <div className="dashboard-stat-hint">{hint}</div>
  </Card.Body>
);

const StatCard = ({
  icon,
  label,
  value,
  hint,
  tone = "blue",
  delay = 0,
  to,
}) => {
  const className = `dashboard-stat dashboard-stat-${tone} ${
    to ? "dashboard-stat-link" : ""
  }`;

  if (to) {
    return (
      <MotionLink
        to={to}
        className={className}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.24, delay }}
      >
        <StatCardContent icon={icon} label={label} value={value} hint={hint} />
      </MotionLink>
    );
  }

  return (
    <MotionCard
      className={`dashboard-stat dashboard-stat-${tone}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, delay }}
    >
      <StatCardContent icon={icon} label={label} value={value} hint={hint} />
    </MotionCard>
  );
};

const CompactList = ({ title, icon, items = [], emptyTitle, renderMeta }) => (
  <Card className="dashboard-panel h-100">
    <Card.Header>
      <span>
        <i className={`bi ${icon} me-2`}></i>
        {title}
      </span>
      <Badge bg="light" text="dark">
        {items.length}
      </Badge>
    </Card.Header>
    <Card.Body>
      {items.length === 0 ? (
        <EmptyState
          icon={icon}
          title={emptyTitle}
          message="No attention needed right now."
        />
      ) : (
        <div className="dashboard-list">
          {items.map((item, index) => (
            <motion.div
              className="dashboard-list-item"
              key={item.id || `${item.code}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: index * 0.03 }}
            >
              <div>
                <strong>{item.code ? `${item.code} - ${item.name}` : item.name}</strong>
                {item.status && <small>Status: {item.status}</small>}
              </div>
              <span>{renderMeta ? renderMeta(item) : item.quantity}</span>
            </motion.div>
          ))}
        </div>
      )}
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [topEquipment, setTopEquipment] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(async () => {
      try {
        setLoading(true);
        const isAdmin = user?.role === "admin";

        const [
          statsRes,
          monthlyRes,
          categoryRes,
          topRes,
          activitiesRes,
        ] = await Promise.all([
          axiosClient.get("/dashboard/statistics"),
          axiosClient.get("/dashboard/monthly-report"),
          axiosClient.get("/dashboard/category-distribution"),
          axiosClient.get("/dashboard/top-equipment"),
          axiosClient.get("/dashboard/recent-activities"),
        ]);

        setStatistics(statsRes?.data || statsRes);
        setMonthlyReport(monthlyRes?.data || monthlyRes || []);
        setCategoryDistribution(categoryRes?.data || categoryRes || []);
        setTopEquipment(topRes?.data || topRes || []);
        setRecentActivities(activitiesRes?.data || activitiesRes || []);

        if (isAdmin) {
          const detailedRes = await axiosClient.get(
            "/dashboard/statistics/detailed",
          );
          setDetailedStats(detailedRes?.data || detailedRes);
        } else {
          setDetailedStats(null);
        }

        setError(null);
      } catch (err) {
        setError(err?.message || "Unable to load dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, [user?.role]);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const summary = statistics?.summary || {};
  const isAdmin = user?.role === "admin";
  const lowStock = detailedStats?.equipment?.lowStock || [];
  const outOfStock = detailedStats?.equipment?.outOfStock || [];
  const highStock = detailedStats?.equipment?.highStock || [];
  const pendingTotal =
    isAdmin
      ? Number(summary.pendingImportOrders || 0) +
        Number(summary.pendingExportOrders || 0)
      : Number(summary.myPendingOrders || 0);

  const renderVisuals = () => (
    <>
      <Row className="g-3 mb-4">
        <Col lg={8}>
          <MonthlyImportExportChart data={monthlyReport} />
        </Col>
        <Col lg={4}>
          <CategoryDistributionChart data={categoryDistribution} />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <TopEquipmentChart data={topEquipment} />
        </Col>
        <Col lg={6}>
          <RecentActivitiesTimeline activities={recentActivities} />
        </Col>
      </Row>
    </>
  );

  return (
    <Container fluid className="py-4 dashboard-page">
      <motion.section
        className="dashboard-hero shadow-sm mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div>
          <Badge bg={isAdmin ? "primary" : "success"} className="mb-2">
            {isAdmin ? "Admin workspace" : "Staff workspace"}
          </Badge>
          <h1>Inventory Overview</h1>
          <p className="mb-3">
            Welcome back, {user?.full_name || user?.username || "User"}. Track
            stock, approvals, and operational activity from one place.
          </p>
          <div className="dashboard-hero-actions d-flex flex-wrap gap-2">
            <Link to="/imports/add" className="btn btn-primary btn-sm px-3 py-2 fw-bold d-inline-flex align-items-center">
              <i className="bi bi-box-arrow-in-down me-2"></i> Create Import
            </Link>
            <Link to="/exports/add" className="btn btn-primary btn-sm px-3 py-2 fw-bold d-inline-flex align-items-center">
              <i className="bi bi-box-arrow-up me-2"></i> Create Export
            </Link>
            {isAdmin && (
              <Link to="/equipment/add" className="btn btn-light btn-sm px-3 py-2 fw-bold d-inline-flex align-items-center border">
                <i className="bi bi-plus-circle me-2 text-primary"></i> Add Equipment
              </Link>
            )}
          </div>
        </div>
        <div className="dashboard-hero-score">
          <span>{formatNumber(pendingTotal)}</span>
          <small>pending actions</small>
        </div>
      </motion.section>

      {isAdmin ? (
        <>
          <Row className="g-3 mb-4">
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-box-seam"
                label="Equipment"
                value={summary.equipment}
                hint="Total managed assets"
                tone="green"
                delay={0.02}
                to="/equipment"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-archive"
                label="Inventory Qty"
                value={summary.totalQuantity}
                hint="Units currently in stock"
                tone="cyan"
                delay={0.04}
                to="/equipment"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-hourglass-split"
                label="Pending Imports"
                value={summary.pendingImportOrders}
                hint="Waiting for approval"
                tone="amber"
                delay={0.06}
                to="/imports"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-box-arrow-up"
                label="Pending Exports"
                value={summary.pendingExportOrders}
                hint="Waiting for approval"
                tone="rose"
                delay={0.08}
                to="/exports"
              />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-people"
                label="Users"
                value={summary.users}
                hint="Active system accounts"
                tone="blue"
                to="/users"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-bookmark"
                label="Categories"
                value={summary.categories}
                hint="Equipment groups"
                tone="violet"
                to="/categories"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-truck"
                label="Suppliers"
                value={summary.suppliers}
                hint="Vendor records"
                tone="slate"
                to="/suppliers"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-calendar-check"
                label="This Month"
                value={
                  Number(detailedStats?.monthly?.imports || 0) +
                  Number(detailedStats?.monthly?.exports || 0)
                }
                hint={`${formatNumber(detailedStats?.monthly?.imports)} imports, ${formatNumber(detailedStats?.monthly?.exports)} exports`}
                tone="indigo"
                to="/inventory-logs"
              />
            </Col>
          </Row>

          {renderVisuals()}

          <Row className="g-3 mb-4">
            <Col lg={4}>
              <CompactList
                title="Low Stock"
                icon="bi-exclamation-triangle"
                items={lowStock}
                emptyTitle="Stock levels look healthy"
                renderMeta={(item) => `${formatNumber(item.quantity)} left`}
              />
            </Col>
            <Col lg={4}>
              <CompactList
                title="Out Of Stock"
                icon="bi-x-circle"
                items={outOfStock}
                emptyTitle="No equipment is out of stock"
                renderMeta={() => "0 left"}
              />
            </Col>
            <Col lg={4}>
              <CompactList
                title="High Stock"
                icon="bi-bar-chart"
                items={highStock}
                emptyTitle="No high-stock items yet"
                renderMeta={(item) => `${formatNumber(item.quantity)} units`}
              />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="g-3 mb-4">
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-file-earmark-text"
                label="My Orders"
                value={summary.myOrders}
                hint="Import and export requests"
                tone="blue"
                to="/imports"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-hourglass-split"
                label="Pending"
                value={summary.myPendingOrders}
                hint="Waiting for admin approval"
                tone="amber"
                to="/imports"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-box-seam"
                label="Equipment"
                value={summary.equipment}
                hint="Available inventory catalog"
                tone="green"
                to="/equipment"
              />
            </Col>
            <Col xl={3} md={6}>
              <StatCard
                icon="bi-archive"
                label="Inventory Qty"
                value={summary.totalQuantity}
                hint="Units currently in stock"
                tone="cyan"
                to="/equipment"
              />
            </Col>
          </Row>

          {renderVisuals()}
        </>
      )}
    </Container>
  );
};

export default Dashboard;
