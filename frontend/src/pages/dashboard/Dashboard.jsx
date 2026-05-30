import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import axiosClient from "../../services/axiosClient";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const isAdmin = user?.role === "admin";

      const statsRes = await axiosClient.get("/dashboard/statistics");
      setStatistics(statsRes?.data || statsRes);

      if (isAdmin) {
        const detailedRes = await axiosClient.get("/dashboard/statistics/detailed");
        setDetailedStats(detailedRes?.data || detailedRes);
      } else {
        setDetailedStats(null);
      }

      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu dashboard");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const summary = statistics?.summary || {};

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>
            Bảng Điều Khiển
            <Badge bg="info" className="ms-2">
              {user?.role === "admin" ? "Quản Trị Viên" : "Nhân Viên"}
            </Badge>
          </h1>
          <p className="text-muted">Xin chào, {user?.full_name}!</p>
        </Col>
      </Row>

      {/* Admin Dashboard */}
      {user?.role === "admin" && (
        <>
          {/* Main Statistics Cards */}
          <Row className="g-4 mb-4">
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-box text-success"></i>
                  </h3>
                  <h6 className="text-muted">Thiết Bị</h6>
                  <h2 className="text-success">{summary.equipment || 0}</h2>
                  <small className="text-muted">Tổng số thiết bị</small>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-people text-primary"></i>
                  </h3>
                  <h6 className="text-muted">Người Dùng</h6>
                  <h2 className="text-primary">{summary.users || 0}</h2>
                  <small className="text-muted">Tổng số người dùng</small>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-bookmark text-warning"></i>
                  </h3>
                  <h6 className="text-muted">Danh Mục</h6>
                  <h2 className="text-warning">{summary.categories || 0}</h2>
                  <small className="text-muted">Danh mục thiết bị</small>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-truck text-info"></i>
                  </h3>
                  <h6 className="text-muted">Nhà Cung Cấp</h6>
                  <h2 className="text-info">{summary.suppliers || 0}</h2>
                  <small className="text-muted">Nhà cung cấp</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Pending Orders Alert */}
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card
                className={`stat-card ${(summary.pendingImportOrders || 0) > 0 ? "border-warning" : ""}`}
              >
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-inbox text-warning"></i>
                  </h3>
                  <h6 className="text-muted">Phiếu Nhập Chờ Duyệt</h6>
                  <h2 className="text-warning">
                    {summary.pendingImportOrders || 0}
                  </h2>
                  <small className="text-muted">Cần xử lý</small>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card
                className={`stat-card ${(summary.pendingExportOrders || 0) > 0 ? "border-danger" : ""}`}
              >
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-box-seam text-danger"></i>
                  </h3>
                  <h6 className="text-muted">Phiếu Xuất Chờ Duyệt</h6>
                  <h2 className="text-danger">
                    {summary.pendingExportOrders || 0}
                  </h2>
                  <small className="text-muted">Cần xử lý</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Inventory Info */}
          <Row className="g-4 mb-4">
            <Col md={12}>
              <Card className="stat-card info-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-archive text-info"></i>
                  </h3>
                  <h6 className="text-muted">Tồn Kho Hiện Tại</h6>
                  <h2 className="text-info">{summary.totalQuantity || 0}</h2>
                  <small className="text-muted">Tổng số lượng tồn kho</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Detailed Alerts */}
          {detailedStats && (
            <>
              {/* Low Stock Warning */}
              {detailedStats?.equipment?.lowStock?.length > 0 && (
                <Row className="mb-4">
                  <Col md={12}>
                    <Alert
                      variant="warning"
                      className="d-flex align-items-start"
                    >
                      <i className="bi bi-exclamation-triangle me-2 mt-1"></i>
                      <div>
                        <h5>⚠️ Thiết Bị Sắp Hết Hàng</h5>
                        <p className="mb-2">
                          Những thiết bị dưới đây còn ít hàng, vui lòng nhập
                          thêm:
                        </p>
                        <ul className="mb-0">
                          {detailedStats.equipment.lowStock.map((item) => (
                            <li key={item.id}>
                              {item.name} - Còn lại: {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Alert>
                  </Col>
                </Row>
              )}

              {/* Out of Stock */}
              {detailedStats?.equipment?.outOfStock?.length > 0 && (
                <Row className="mb-4">
                  <Col md={12}>
                    <Alert
                      variant="danger"
                      className="d-flex align-items-start"
                    >
                      <i className="bi bi-x-circle me-2 mt-1"></i>
                      <div>
                        <h5>❌ Thiết Bị Hết Hàng</h5>
                        <p className="mb-2">
                          Những thiết bị này hiện đã hết hàng:
                        </p>
                        <ul className="mb-0">
                          {detailedStats.equipment.outOfStock.map((item) => (
                            <li key={item.id}>{item.name}</li>
                          ))}
                        </ul>
                      </div>
                    </Alert>
                  </Col>
                </Row>
              )}
            </>
          )}
        </>
      )}

      {/* Staff Dashboard */}
      {user?.role === "staff" && (
        <>
          <Row className="g-4 mb-4">
            <Col md={4} sm={6}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-file-earmark text-primary"></i>
                  </h3>
                  <h6 className="text-muted">Phiếu Của Tôi</h6>
                  <h2 className="text-primary">
                    {summary.myOrders ?? 0}
                  </h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} sm={6}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-hourglass-split text-warning"></i>
                  </h3>
                  <h6 className="text-muted">Phiếu Chờ Duyệt</h6>
                  <h2 className="text-warning">
                    {summary.myPendingOrders ?? 0}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col md={4} sm={6}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-box text-success"></i>
                  </h3>
                  <h6 className="text-muted">Thiết Bị Có Sẵn</h6>
                  <h2 className="text-success">{summary.equipment || 0}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} sm={6}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <h3>
                    <i className="bi bi-archive text-info"></i>
                  </h3>
                  <h6 className="text-muted">Tồn Kho</h6>
                  <h2 className="text-info">{summary.totalQuantity || 0}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={12}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Hướng Dẫn Nhanh</h5>
                </Card.Header>
                <Card.Body>
                  <p>Các chức năng chính của bạn:</p>
                  <ul>
                    <li>Xem thiết bị và kiểm kê tồn kho</li>
                    <li>Tạo phiếu nhập kho</li>
                    <li>Tạo phiếu xuất kho</li>
                    <li>Quản lý tài khoản cá nhân</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
