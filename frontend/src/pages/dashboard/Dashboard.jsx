import { useEffect, useState } from "react";
import { Alert, Badge, Card, Col, Container, Row } from "react-bootstrap";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import EmptyState from "../../components/common/EmptyState";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../hooks/useAuth";
import axiosClient from "../../services/axiosClient";
import "./Dashboard.css";

const MotionCard = motion(Card);
const MotionLink = motion(Link);

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(async () => {
      try {
        setLoading(true);
        const isAdmin = user?.role === "admin";

        const statsRes = await axiosClient.get("/dashboard/statistics");
        setStatistics(statsRes?.data || statsRes);

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
  const recentImports = detailedStats?.recentActivities?.imports || [];
  const recentExports = detailedStats?.recentActivities?.exports || [];
  const pendingTotal =
    isAdmin
      ? Number(summary.pendingImportOrders || 0) +
        Number(summary.pendingExportOrders || 0)
      : Number(summary.myPendingOrders || 0);

  return (
    <Container fluid className="py-4 dashboard-page">
      <motion.section
        className="dashboard-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div>
          <Badge bg={isAdmin ? "primary" : "success"} className="mb-2">
            {isAdmin ? "Admin workspace" : "Staff workspace"}
          </Badge>
          <h1>Inventory Overview</h1>
          <p>
            Welcome back, {user?.full_name || user?.username || "User"}. Track
            stock, approvals, and operational activity from one place.
          </p>
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

          <Row className="g-3">
            <Col lg={6}>
              <CompactList
                title="Recent Import Orders"
                icon="bi-box-arrow-in-down"
                items={recentImports}
                emptyTitle="No recent imports"
                renderMeta={(item) => item.status || "-"}
              />
            </Col>
            <Col lg={6}>
              <CompactList
                title="Recent Export Orders"
                icon="bi-box-arrow-up"
                items={recentExports}
                emptyTitle="No recent exports"
                renderMeta={(item) => item.status || "-"}
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

          <Card className="dashboard-panel">
            <Card.Header>
              <span>
                <i className="bi bi-lightning-charge me-2"></i>
                Quick Actions
              </span>
            </Card.Header>
            <Card.Body>
              <div className="dashboard-action-grid">
                <div>
                  <strong>Create import request</strong>
                  <small>Record incoming equipment and send it for approval.</small>
                </div>
                <div>
                  <strong>Create export request</strong>
                  <small>Request stock for a department or receiver.</small>
                </div>
                <div>
                  <strong>Review inventory</strong>
                  <small>Check equipment details, quantity, and availability.</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
