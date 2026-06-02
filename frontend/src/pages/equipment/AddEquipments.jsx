import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import EquipmentForm from "../../components/forms/EquipmentForm";
import Loading from "../../components/common/Loading";

import categoriesService from "../../services/categoriesService";
import suppliersService from "../../services/suppliersService";
import equipmentService from "../../services/equipmentService";

const AddEquipments = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);

        const [categoriesResponse, suppliersResponse] = await Promise.all([
          categoriesService.getAllCategories(),
          suppliersService.getAllSuppliers(),
        ]);

        setCategories(categoriesResponse?.data || categoriesResponse || []);
        setSuppliers(suppliersResponse?.data || suppliersResponse || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load categories or suppliers");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
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

  if (isLoadingData) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
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

      <Row>
        <Col md={8}>
          <Card>
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
