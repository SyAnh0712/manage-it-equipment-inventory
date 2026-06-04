import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button as BSButton,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import ExportOrderTable from "../../components/ui/ExportOrderTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { useDebounce } from "../../hooks/useDebounce";
import exportOrderService from "../../services/exportOrderService";
import { listenToSocket } from "../../services/socketService";
import {
  exportExportOrdersToExcel,
  exportExportOrdersToPdf,
} from "../../utils/reportExport";
import { useAuth } from "../../hooks/useAuth";
import { extractPaginatedList } from "../../utils/apiResponse";

const ExportOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmType, setConfirmType] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { user } = useAuth();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await exportOrderService.getAllExportOrders({
        search: debouncedSearchTerm,
        department: department || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        page: currentPage,
        limit: 10,
      });
      const { data, pagination } = extractPaginatedList(response);
      setOrders(data);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load export orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [debouncedSearchTerm, department, dateFrom, dateTo, currentPage]);

  useEffect(() => {
    const removeCreatedListener = listenToSocket("export:created", fetchOrders);
    const removeApprovedListener = listenToSocket(
      "export:approved",
      fetchOrders,
    );

    return () => {
      removeCreatedListener();
      removeApprovedListener();
    };
  }, []);

  const handleDownloadExcel = () => {
    if (!orders.length) {
      toast.info("No export orders to export");
      return;
    }

    exportExportOrdersToExcel(orders);
  };

  const handleDownloadPdf = () => {
    if (!orders.length) {
      toast.info("No export orders to export");
      return;
    }

    exportExportOrdersToPdf(orders);
  };

  const handleAction = (order, type) => {
    setSelectedOrder(order);
    setConfirmType(type);
  };

  const handleConfirm = async () => {
    if (!selectedOrder || !confirmType) {
      return;
    }

    setConfirmLoading(true);
    try {
      if (confirmType === "approve") {
        await exportOrderService.approveExportOrder(selectedOrder.id);
        toast.success("Export order approved successfully");
      } else if (confirmType === "reject") {
        await exportOrderService.rejectExportOrder(selectedOrder.id);
        toast.success("Export order rejected successfully");
      } else if (confirmType === "delete") {
        await exportOrderService.deleteExportOrder(selectedOrder.id);
        toast.success("Export order deleted successfully");
      }
      setSelectedOrder(null);
      setConfirmType(null);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to complete action");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedOrder(null);
    setConfirmType(null);
  };

  const getConfirmMessage = () => {
    if (!selectedOrder || !confirmType) return "";

    if (confirmType === "approve") {
      return `Do you want to approve export order ${selectedOrder.code}?`;
    }

    if (confirmType === "reject") {
      return `Do you want to reject export order ${selectedOrder.code}?`;
    }

    if (confirmType === "delete") {
      return `Do you want to delete export order ${selectedOrder.code}? This action cannot be undone.`;
    }

    return "";
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Export Orders</h1>
          <p className="text-muted">
            Create, search, and approve export orders.
          </p>
        </Col>

        <Col className="text-end">
          <BSButton
            variant="outline-secondary"
            className="me-2"
            onClick={handleDownloadExcel}
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Export Excel
          </BSButton>
          <BSButton
            variant="outline-secondary"
            className="me-2"
            onClick={handleDownloadPdf}
          >
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Export PDF
          </BSButton>
          <Link to="/exports/add">
            <BSButton variant="primary">
              <i className="bi bi-plus-circle me-2"></i>
              New Export Order
            </BSButton>
          </Link>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <SearchBox
                placeholder="Tìm theo mã phiếu, bộ phận, người nhận..."
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">
                  Bộ phận nhận
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Lọc theo bộ phận"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">
                  Từ ngày
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">
                  Đến ngày
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={1} className="text-end">
              <small className="text-muted">
                Tổng: <strong>{orders.length}</strong>
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <ExportOrderTable
            orders={orders}
            onDelete={(order) => handleAction(order, "delete")}
            onApprove={(order) => handleAction(order, "approve")}
            onReject={(order) => handleAction(order, "reject")}
            currentUser={user}
          />

          <div className="d-flex justify-content-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={!!selectedOrder}
        title={
          confirmType
            ? `${confirmType.charAt(0).toUpperCase() + confirmType.slice(1)} Export Order`
            : "Confirm Action"
        }
        message={getConfirmMessage()}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={confirmLoading}
      />
    </Container>
  );
};

export default ExportOrdersList;
