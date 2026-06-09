import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button as BSButton,
} from "react-bootstrap";
import { toast } from "react-toastify";

import InventoryLogTable from "../../components/ui/InventoryLogTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";

import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import inventoryLogService from "../../services/inventoryLogService";
import equipmentService from "../../services/equipmentService";
import {
  exportInventoryLogsToExcel,
  exportInventoryLogsToPdf,
} from "../../utils/reportExport";
import {
  extractPaginatedList,
  extractListData,
  LIST_FETCH_ALL_PARAMS,
} from "../../utils/apiResponse";

const InventoryLogs = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [logs, setLogs] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionType, setActionType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [adjustEquipmentId, setAdjustEquipmentId] = useState("");
  const [adjustQuantity, setAdjustQuantity] = useState("");
  const [adjustSubmitting, setAdjustSubmitting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    equipmentService
      .getAllEquipments(LIST_FETCH_ALL_PARAMS)
      .then((response) => setEquipments(extractListData(response)))
      .catch(() => {});
  }, [isAdmin]);

  const fetchLogs = useCallback(async () => {
    try {
      setIsSearching(true);
      const response = await inventoryLogService.getAllInventoryLogs({
        search: debouncedSearchTerm,
        action_type: actionType || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        page: currentPage,
        limit,
      });

      const { data, pagination } = extractPaginatedList(response);

      setLogs(data);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory history");
    } finally {
      setIsSearching(false);
      setInitialLoading(false);
    }
  }, [actionType, currentPage, dateFrom, dateTo, debouncedSearchTerm, limit]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      void fetchLogs();
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, [fetchLogs, isAdmin]);

  const handleAdjustSubmit = async (event) => {
    event.preventDefault();

    if (!adjustEquipmentId) {
      toast.error("Vui lòng chọn thiết bị");
      return;
    }

    const quantityChange = Number(adjustQuantity);
    if (!quantityChange || quantityChange === 0) {
      toast.error("Số lượng điều chỉnh phải khác 0");
      return;
    }

    setAdjustSubmitting(true);
    try {
      await inventoryLogService.adjustInventory({
        equipment_id: Number(adjustEquipmentId),
        quantity_change: quantityChange,
      });
      toast.success("Điều chỉnh kho thành công");
      setAdjustQuantity("");
      fetchLogs();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to adjust inventory");
    } finally {
      setAdjustSubmitting(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!logs.length) {
      toast.info("No inventory logs to export");
      return;
    }
    exportInventoryLogsToExcel(logs);
  };

  const handleDownloadPdf = () => {
    if (!logs.length) {
      toast.info("No inventory logs to export");
      return;
    }
    exportInventoryLogsToPdf(logs);
  };

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Lịch sử kho</h1>
          <p className="text-muted">
            Xem lịch sử nhập, xuất và điều chỉnh tồn kho.
          </p>
        </Col>
        <Col className="text-end">
          <BSButton
            variant="outline-secondary"
            className="me-2"
            onClick={handleDownloadExcel}
          >
            Export Excel
          </BSButton>
          <BSButton variant="outline-secondary" onClick={handleDownloadPdf}>
            Export PDF
          </BSButton>
        </Col>
      </Row>

      {isAdmin && (
        <Card className="mb-3">
          <Card.Body>
            <h5 className="mb-3">Điều chỉnh kho</h5>
            <Form onSubmit={handleAdjustSubmit}>
              <Row className="g-3 align-items-end">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Thiết bị</Form.Label>
                    <Form.Select
                      value={adjustEquipmentId}
                      onChange={(e) => setAdjustEquipmentId(e.target.value)}
                    >
                      <option value="">Chọn thiết bị</option>
                      {equipments.map((equipment) => (
                        <option key={equipment.id} value={equipment.id}>
                          {equipment.code} — {equipment.name} (Tồn:{" "}
                          {equipment.quantity ?? 0})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Số lượng thay đổi</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="VD: +5 hoặc -3"
                      value={adjustQuantity}
                      onChange={(e) => setAdjustQuantity(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      Số dương để tăng, số âm để giảm
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <BSButton
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={adjustSubmitting}
                  >
                    {adjustSubmitting ? "Đang xử lý..." : "Điều chỉnh"}
                  </BSButton>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <SearchBox
                placeholder="Tìm theo thiết bị, mã tham chiếu, người thao tác..."
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
              />
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1">
                  Loại thao tác
                </Form.Label>
                <Form.Select
                  value={actionType}
                  onChange={(e) => {
                    setActionType(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Tất cả</option>
                  <option value="import">Nhập kho</option>
                  <option value="export">Xuất kho</option>
                  <option value="adjust">Điều chỉnh</option>
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
            <Col md={2} className="text-end">
              <small className="text-muted">
                Tổng: <strong>{logs.length}</strong>
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {isSearching && (
            <div className="text-muted small mb-2">Đang tìm kiếm...</div>
          )}
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
