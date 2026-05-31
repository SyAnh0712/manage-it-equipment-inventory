import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button as BSButton,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loading from "../../components/common/Loading";
import suppliersService from "../../services/suppliersService";
import equipmentService from "../../services/equipmentService";
import importOrderService from "../../services/importOrderService";

const AddImportOrder = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [note, setNote] = useState("");
  const [details, setDetails] = useState([
    { equipment_id: "", quantity: 1, unit_price: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const suppliersResponse = await suppliersService.getAllSuppliers();
      const equipmentsResponse = await equipmentService.getAllEquipments();
      setSuppliers(suppliersResponse?.data || suppliersResponse || []);
      setEquipments(equipmentsResponse || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers or equipment");
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
    setDetails((prev) => [
      ...prev,
      { equipment_id: "", quantity: 1, unit_price: 0 },
    ]);
  };

  const handleRemoveDetail = (index) => {
    setDetails((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validate = () => {
    if (!supplierId) {
      toast.error("Please select a supplier");
      return false;
    }

    if (!details.length) {
      toast.error("Please add at least one detail item");
      return false;
    }

    for (const item of details) {
      if (!item.equipment_id) {
        toast.error("Each detail item needs an equipment selection");
        return false;
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        toast.error("Quantity must be greater than zero");
        return false;
      }
      if (Number(item.unit_price) < 0) {
        toast.error("Unit price must be zero or greater");
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
      await importOrderService.createImportOrder({
        supplier_id: Number(supplierId),
        note,
        details: details.map((item) => ({
          equipment_id: Number(item.equipment_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price) || 0,
        })),
      });
      toast.success("Import order created successfully");
      navigate("/imports");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to create import order");
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
          <h1>Create Import Order</h1>
          <p className="text-muted">
            Add a new import order with product details.
          </p>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Supplier</Form.Label>
              <Form.Select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

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
                <h5>Import Items</h5>
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
                      <Col md={5}>
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
                                {equipment.code} — {equipment.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleDetailChange(
                                index,
                                "quantity",
                                e.target.value,
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Unit Price</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) =>
                              handleDetailChange(
                                index,
                                "unit_price",
                                e.target.value,
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={1}>
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
                onClick={() => navigate("/imports")}
              >
                Cancel
              </BSButton>
              <BSButton type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Saving..." : "Create Import Order"}
              </BSButton>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddImportOrder;
