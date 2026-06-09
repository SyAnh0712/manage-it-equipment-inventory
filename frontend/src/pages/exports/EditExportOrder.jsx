import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button as BSButton,
} from "react-bootstrap";
import { toast } from "react-toastify";

import Loading from "../../components/common/Loading";
import equipmentService from "../../services/equipmentService";
import exportOrderService from "../../services/exportOrderService";
import {
  extractApiData,
  extractListData,
  LIST_FETCH_ALL_PARAMS,
} from "../../utils/apiResponse";

const EditExportOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipments, setEquipments] = useState([]);
  const [department, setDepartment] = useState("");
  const [receiver, setReceiver] = useState("");
  const [note, setNote] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipmentsResponse, orderResponse] = await Promise.all([
        equipmentService.getAllEquipments(LIST_FETCH_ALL_PARAMS),
        exportOrderService.getExportOrderById(id),
      ]);

      setEquipments(extractListData(equipmentsResponse));
      const order = extractApiData(orderResponse) || {};
      setDepartment(order.department || "");
      setReceiver(order.receiver || "");
      setNote(order.note || "");
      setDetails(
        (order.details || []).map((item) => ({
          equipment_id: item.equipment_id || "",
          quantity: item.quantity || 1,
        })),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load export order details");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailChange = (index, field, value) => {
    setDetails((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddDetail = () => {
    setDetails((prev) => [...prev, { equipment_id: "", quantity: 1 }]);
  };

  const handleRemoveDetail = (index) => {
    setDetails((prev) => prev.filter((_, idx) => idx !== index));
  };

  const getEquipmentStock = (equipmentId) => {
    const equipment = equipments.find(
      (item) => String(item.id) === String(equipmentId),
    );
    return Number(equipment?.quantity || 0);
  };

  const validate = () => {
    if (!department.trim()) {
      toast.error("Please enter a department");
      return false;
    }
    if (!receiver.trim()) {
      toast.error("Please enter a receiver");
      return false;
    }
    if (!details.length) {
      toast.error("Please add at least one detail item");
      return false;
    }

    const aggregated = {};

    for (const item of details) {
      if (!item.equipment_id) {
        toast.error("Each detail item needs an equipment selection");
        return false;
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        toast.error("Quantity must be greater than zero");
        return false;
      }

      const equipmentId = item.equipment_id;
      aggregated[equipmentId] =
        (aggregated[equipmentId] || 0) + Number(item.quantity);
    }

    for (const [equipmentId, totalQty] of Object.entries(aggregated)) {
      const stockQty = getEquipmentStock(equipmentId);
      if (totalQty > stockQty) {
        const equipment = equipments.find(
          (item) => String(item.id) === String(equipmentId),
        );
        toast.error(
          `Không đủ tồn kho cho ${equipment?.name || equipmentId}: còn ${stockQty}, yêu cầu ${totalQty}`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await exportOrderService.updateExportOrder(id, {
        department,
        receiver,
        note,
        details: details.map((item) => ({
          equipment_id: Number(item.equipment_id),
          quantity: Number(item.quantity),
        })),
      });
      toast.success("Export order updated successfully");
      navigate("/exports");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to update export order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Edit Export Order</h1>
          <p className="text-muted">
            Update a pending export order and item details.
          </p>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Enter destination department"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Receiver</Form.Label>
                  <Form.Control
                    type="text"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    placeholder="Enter receiver name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note"
              />
            </Form.Group>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Export Items</h5>
                <BSButton
                  variant="secondary"
                  size="sm"
                  onClick={handleAddDetail}
                >
                  Add Item
                </BSButton>
              </div>

              {details.map((item, index) => (
                <Card className="mb-3" key={index}>
                  <Card.Body>
                    <Row className="g-3 align-items-end">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Equipment</Form.Label>
                          <Form.Select
                            value={item.equipment_id}
                            onChange={(e) =>
                              handleDetailChange(
                                index,
                                "equipment_id",
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Select equipment</option>
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
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            max={
                              item.equipment_id
                                ? getEquipmentStock(item.equipment_id)
                                : undefined
                            }
                            value={item.quantity}
                            onChange={(e) =>
                              handleDetailChange(
                                index,
                                "quantity",
                                e.target.value,
                              )
                            }
                          />
                          {item.equipment_id && (
                            <Form.Text className="text-muted">
                              Tồn kho: {getEquipmentStock(item.equipment_id)}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <BSButton
                          variant="danger"
                          size="sm"
                          className="w-100"
                          onClick={() => handleRemoveDetail(index)}
                        >
                          &times;
                        </BSButton>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>

            <div className="text-end">
              <BSButton
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/exports")}
              >
                Cancel
              </BSButton>
              <BSButton type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Updating..." : "Update Export Order"}
              </BSButton>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditExportOrder;
