import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button as BSButton,
  Badge,
} from "react-bootstrap";
import { toast } from "react-toastify";

import Loading from "../../components/common/Loading";
import equipmentService from "../../services/equipmentService";
import exportOrderService from "../../services/exportOrderService";
import {
  exportExportOrderDetailsToExcel,
  exportExportOrderDetailsToPdf,
} from "../../utils/reportExport";
import {
  extractListData,
  LIST_FETCH_ALL_PARAMS,
} from "../../utils/apiResponse";

const ExportOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [equipmentResponse, orderResponse] = await Promise.all([
        equipmentService.getAllEquipments(LIST_FETCH_ALL_PARAMS),
        exportOrderService.getExportOrderById(id),
      ]);

      setEquipments(extractListData(equipmentResponse));
      setOrder(orderResponse);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to load export order details");
      navigate("/exports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading || !order) {
    return <Loading />;
  }

  const items = order.details || [];
  const createdBy = order.creator?.full_name || order.creator?.username || "-";

  const enrichedItems = items.map((item) => {
    const equipment =
      equipments.find((eq) => eq.id === item.equipment_id) || {};
    return {
      ...item,
      equipmentCode: equipment.code || item.equipment_id,
      equipmentName: equipment.name || "Unknown",
    };
  });

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Export Order Details</h1>
          <p className="text-muted">Review export order and item details.</p>
        </Col>

        <Col className="text-end">
          <BSButton
            variant="outline-secondary"
            className="me-2"
            onClick={() =>
              exportExportOrderDetailsToExcel(order, enrichedItems)
            }
          >
            Export Excel
          </BSButton>
          <BSButton
            variant="outline-secondary"
            className="me-2"
            onClick={() => exportExportOrderDetailsToPdf(order, enrichedItems)}
          >
            Export PDF
          </BSButton>
          <BSButton variant="primary" onClick={() => navigate("/exports")}>
            Back
          </BSButton>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Order Summary</h5>
              <Row className="mb-2">
                <Col xs={6} className="fw-bold">
                  Code:
                </Col>
                <Col xs={6}>{order.code}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="fw-bold">
                  Department:
                </Col>
                <Col xs={6}>{order.department || "-"}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="fw-bold">
                  Receiver:
                </Col>
                <Col xs={6}>{order.receiver || "-"}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="fw-bold">
                  Status:
                </Col>
                <Col xs={6}>
                  <Badge
                    bg={
                      order.status === "approved"
                        ? "success"
                        : order.status === "rejected"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {order.status}
                  </Badge>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="fw-bold">
                  Created By:
                </Col>
                <Col xs={6}>{createdBy}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={6} className="fw-bold">
                  Created At:
                </Col>
                <Col xs={6}>{new Date(order.created_at).toLocaleString()}</Col>
              </Row>
              <Row>
                <Col xs={6} className="fw-bold">
                  Note:
                </Col>
                <Col xs={6}>{order.note || "-"}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Items</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Equipment</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div>{item.equipmentCode}</div>
                        <small className="text-muted">
                          {item.equipmentName}
                        </small>
                      </td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExportOrderDetails;
