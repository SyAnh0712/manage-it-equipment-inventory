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

import ImportOrderTable from "../../components/ui/ImportOrderTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { useDebounce } from "../../hooks/useDebounce";
import importOrderService from "../../services/importOrderService";
import suppliersService from "../../services/suppliersService";
import { listenToSocket } from "../../services/socketService";
import {
  exportImportOrdersToExcel,
  exportImportOrdersToPdf,
} from "../../utils/reportExport";
import { useAuth } from "../../hooks/useAuth";
import { extractPaginatedList } from "../../utils/apiResponse";

const ImportOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmType, setConfirmType] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { user } = useAuth();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    suppliersService
      .getAllSuppliers()
      .then((response) => setSuppliers(response?.data || response || []))
      .catch(() => {});
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await importOrderService.getAllImportOrders({
        search: debouncedSearchTerm,
        supplier_id: supplierId || undefined,
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
      toast.error("Failed to load import orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [debouncedSearchTerm, supplierId, dateFrom, dateTo, currentPage]);

  useEffect(() => {
    const removeCreatedListener = listenToSocket("import:created", fetchOrders);
    const removeApprovedListener = listenToSocket(
      "import:approved",
      fetchOrders,
    );

    return () => {
      removeCreatedListener();
      removeApprovedListener();
    };
  }, []);

  const handleDownloadExcel = () => {
    if (!orders.length) {
      toast.info("No import orders to export");
      return;
    }

    exportImportOrdersToExcel(orders);
  };

  const handleDownloadPdf = () => {
    if (!orders.length) {
      toast.info("No import orders to export");
      return;
    }

    exportImportOrdersToPdf(orders);
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
        await importOrderService.approveImportOrder(selectedOrder.id);
        toast.success("Import order approved successfully");
      } else if (confirmType === "reject") {
        await importOrderService.rejectImportOrder(selectedOrder.id);
        toast.success("Import order rejected successfully");
      } else if (confirmType === "delete") {
        await importOrderService.deleteImportOrder(selectedOrder.id);
        toast.success("Import order deleted successfully");
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
      return `Do you want to approve import order ${selectedOrder.code}?`;
    }

    if (confirmType === "reject") {
      return `Do you want to reject import order ${selectedOrder.code}?`;
    }

    if (confirmType === "delete") {
      return `Do you want to delete import order ${selectedOrder.code}? This action cannot be undone.`;
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
          <h1>Import Orders</h1>
          <p className="text-muted">
            Create, search, and approve import orders.
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
          <Link to="/imports/add">
            <BSButton variant="primary">
              <i className="bi bi-plus-circle me-2"></i>
              New Import Order
            </BSButton>
          </Link>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <SearchBox
                placeholder="Tìm theo mã phiếu, nhà cung cấp, trạng thái..."
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
                  Nhà cung cấp
                </Form.Label>
                <Form.Select
                  value={supplierId}
                  onChange={(e) => {
                    setSupplierId(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Tất cả nhà cung cấp</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </Form.Select>
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
          <ImportOrderTable
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
            ? `${confirmType.charAt(0).toUpperCase() + confirmType.slice(1)} Import Order`
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

export default ImportOrdersList;
