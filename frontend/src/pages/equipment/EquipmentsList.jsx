import { useState, useEffect } from "react";
import { Container, Row, Col, Button as BSButton, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import EquipmentTable from "../../components/ui/EquipmentTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";

import equipmentService from "../../services/equipmentService";

const EquipmentsList = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredEquipments = equipments.filter(
    (equipment) =>
      equipment.name
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      equipment.code
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      equipment.unit?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const pagination = usePagination(filteredEquipments, 10);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      setLoading(true);

      const response = await equipmentService.getAllEquipments();

      setEquipments(response || []);
    } catch (error) {
      toast.error("Failed to fetch equipments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await equipmentService.deleteEquipment(deleteId);

      setEquipments(equipments.filter((e) => e.id !== deleteId));

      setDeleteId(null);

      pagination.reset();

      toast.success("Equipment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete equipment");
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
          <h1>Equipments Management</h1>
        </Col>

        {isAdmin && (
          <Col className="text-end">
            <Link to="/equipment/add">
              <BSButton variant="primary">
                <i className="bi bi-plus-circle me-2"></i>
                Add New Equipment
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
                placeholder="Search by code, name or unit..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Col>

            <Col md={6} className="text-end">
              <small className="text-muted">
                Total: <strong>{filteredEquipments.length}</strong> equipment(s)
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {filteredEquipments.length === 0 ? (
            <div className="alert alert-info text-center mb-0">
              No equipments found
            </div>
          ) : (
            <>
              <EquipmentTable
                equipments={pagination.paginatedItems}
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
        title="Delete Equipment"
        message="Are you sure you want to delete this equipment? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </Container>
  );
};

export default EquipmentsList;
