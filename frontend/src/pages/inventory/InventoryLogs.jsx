import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";

import InventoryLogTable from "../../components/ui/InventoryLogTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";

import { useDebounce } from "../../hooks/useDebounce";
import inventoryLogService from "../../services/inventoryLogService";

const InventoryLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchLogs();
  }, [debouncedSearchTerm, currentPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await inventoryLogService.getAllInventoryLogs({
        search: debouncedSearchTerm,
        page: currentPage,
        limit,
      });

      const logData = Array.isArray(response) ? response : response?.data || [];

      setLogs(logData);
      setTotalPages(response?.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Inventory History</h1>
          <p className="text-muted">
            View import/export inventory movements and stock adjustments.
          </p>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <SearchBox
                placeholder="Search by equipment, action, reference, or user..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Col>
            <Col md={6} className="text-end">
              <small className="text-muted">
                Total records: <strong>{logs.length}</strong>
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <InventoryLogTable logs={logs} />
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InventoryLogs;
