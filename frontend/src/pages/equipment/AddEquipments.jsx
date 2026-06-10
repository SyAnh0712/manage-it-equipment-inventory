import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import EquipmentForm from "../../components/forms/EquipmentForm";
import categoriesService from "../../services/categoriesService";
import equipmentService from "../../services/equipmentService";
import suppliersService from "../../services/suppliersService";
import {
  extractListData,
  LIST_FETCH_ALL_PARAMS,
} from "../../utils/apiResponse";

const AddEquipments = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesResponse, suppliersResponse] = await Promise.all([
          categoriesService.getAllCategories(LIST_FETCH_ALL_PARAMS),
          suppliersService.getAllSuppliers(LIST_FETCH_ALL_PARAMS),
        ]);

        setCategories(extractListData(categoriesResponse));
        setSuppliers(extractListData(suppliersResponse));
      } catch (error) {
        toast.error("Failed to load categories or suppliers");
        console.error(error);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);

      await equipmentService.createEquipment(data);

      toast.success("Equipment created successfully");

      navigate("/equipment");
    } catch (error) {
      toast.error(error?.message || "Failed to create equipment");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="py-4 form-page">
      <Row className="mb-4 form-page-header">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BSButton
              variant="link"
              onClick={() => navigate("/equipment")}
              className="text-decoration-none"
            >
              <i className="bi bi-arrow-left"></i> Back
            </BSButton>

            <h1 className="mb-0">Add New Equipment</h1>
          </div>
        </Col>
      </Row>

      <Row className="form-page-grid">
        <Col xs={12}>
          <Card className="form-shell">
            <Card.Body>
              <EquipmentForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                categories={categories}
                suppliers={suppliers}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddEquipments;
