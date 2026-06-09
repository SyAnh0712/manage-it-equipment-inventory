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
import importOrderService from "../../services/importOrderService";
import {
  exportImportOrderDetailsToExcel,
  exportImportOrderDetailsToPdf,
} from "../../utils/reportExport";
import {
  extractListData,
  LIST_FETCH_ALL_PARAMS,
} from "../../utils/apiResponse";

const ImportOrderDetails = () => {
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
        importOrderService.getImportOrderById(id),
      ]);

      setEquipments(extractListData(equipmentResponse));
      setOrder(orderResponse);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to load import order details");
      navigate("/imports");
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
  const orderSupplier = order.supplier?.name || "-";
  const createdBy = order.creator?.full_name || order.creator?.username || "-";
  const totalAmount = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
    0,
  );

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
          <h1>Import Order Details</h1>
          <p className="text-muted">Review import order and item details.</p>
        </Col>

        <Col className="text-end">
          <BSButton
            variant="outline-secondary"
            className="me-2"
            onClick={() =>
              exportImportOrderDetailsToExcel(order, enrichedItems)
            }
          >
            Export Excel
          </BSButton>
          <BSButton
            variant="outline-secondary"
            className="me-2"
            onClick={() => exportImportOrderDetailsToPdf(order, enrichedItems)}
          >
            Export PDF
          </BSButton>
          <BSButton variant="primary" onClick={() => navigate("/imports")}>
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
                  Supplier:
                </Col>
                <Col xs={6}>{orderSupplier}</Col>
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
              <Row className="mb-2">
                <Col xs={6} className="fw-bold">
                  Note:
                </Col>
                <Col xs={6}>{order.note || "-"}</Col>
              </Row>
              <Row>
                <Col xs={6} className="fw-bold">
                  Total Amount:
                </Col>
                <Col xs={6}>{totalAmount.toLocaleString()}</Col>
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
                    <th>Unit Price</th>
                    <th>Total</th>
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
                      <td>{Number(item.unit_price || 0).toLocaleString()}</td>
                      <td>
                        {(
                          Number(item.quantity || 0) *
                          Number(item.unit_price || 0)
                        ).toLocaleString()}
                      </td>
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

export default ImportOrderDetails;
