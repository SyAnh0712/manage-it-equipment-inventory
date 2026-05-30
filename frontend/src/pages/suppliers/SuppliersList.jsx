import { useState, useEffect } from "react";
import { Container, Row, Col, Button as BSButton, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import SuppliersTable from "../../components/ui/SuppliersTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";

import suppliersService from "../../services/suppliersService";

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      supplier.contact_person
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const pagination = usePagination(filteredSuppliers, 10);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await suppliersService.getAllSuppliers();
      setSuppliers(response || []);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await suppliersService.deleteSupplier(deleteId);
      setSuppliers(suppliers.filter((s) => s.id !== deleteId));
      setDeleteId(null);
      pagination.reset();
      toast.success("Supplier deleted successfully");
    } catch (error) {
      toast.error("Failed to delete supplier");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (loading) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Suppliers Management</h1>
        </Col>
        {isAdmin && (
          <Col className="text-end">
            <Link to="/suppliers/add">
              <BSButton variant="primary">
                <i className="bi bi-plus-circle me-2"></i>{" "}
                Add New Supplier
              </BSButton>
            </Link>
          </Col>
        )}
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <SearchBox
                placeholder="Search by supplier name, contact or email..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Col>
            <Col md={6} className="text-end">
              <small className="text-muted">
                Total: <strong>{filteredSuppliers.length}</strong> supplier(s)
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {filteredSuppliers.length === 0 ? (
            <div className="alert alert-info text-center mb-0">
              No suppliers found
            </div>
          ) : (
            <>
              <SuppliersTable
                suppliers={pagination.paginatedItems}
                onDelete={(id) => setDeleteId(id)}
                isAdmin={isAdmin}
              />

              <div className="d-flex justify-content-center mt-4">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.goToPage}
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={!!deleteId}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </Container>
  );
};

export default SuppliersList;
