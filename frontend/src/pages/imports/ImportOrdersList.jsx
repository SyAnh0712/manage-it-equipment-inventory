import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import ImportOrderTable from "../../components/ui/ImportOrderTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { useDebounce } from "../../hooks/useDebounce";
import importOrderService from "../../services/importOrderService";
import { useAuth } from "../../hooks/useAuth";

const ImportOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmType, setConfirmType] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { user } = useAuth();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchOrders();
  }, [debouncedSearchTerm, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await importOrderService.getAllImportOrders({
        search: debouncedSearchTerm,
        page: currentPage,
        limit: 10,
      });
      setOrders(response?.data || []);
      setTotalPages(response?.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load import orders");
    } finally {
      setLoading(false);
    }
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
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <SearchBox
                placeholder="Search by order code, supplier, status or note..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Col>
            <Col md={6} className="text-end">
              <small className="text-muted">
                Total orders: <strong>{orders.length}</strong>
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
