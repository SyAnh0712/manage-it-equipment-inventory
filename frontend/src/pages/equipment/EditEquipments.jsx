import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import EquipmentForm from "../../components/forms/EquipmentForm";
import Loading from "../../components/common/Loading";

import categoriesService from "../../services/categoriesService";
import suppliersService from "../../services/suppliersService";
import equipmentService from "../../services/equipmentService";

const EditEquipments = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [equipment, setEquipment] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [equipmentResponse, categoriesResponse, suppliersResponse] =
        await Promise.all([
          equipmentService.getEquipmentById(id),
          categoriesService.getAllCategories(),
          suppliersService.getAllSuppliers(),
        ]);

      setEquipment(equipmentResponse);
      setCategories(categoriesResponse?.data || categoriesResponse || []);
      setSuppliers(suppliersResponse?.data || suppliersResponse || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load equipment, categories or suppliers");

      navigate("/equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      await equipmentService.updateEquipment(id, data);

      toast.success("Equipment updated successfully");

      navigate("/equipment");
    } catch (error) {
      toast.error(error?.message || "Failed to update equipment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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

            <h1 className="mb-0">Edit Equipment</h1>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              {equipment && (
                <EquipmentForm
                  initialData={equipment}
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                  categories={categories}
                  suppliers={suppliers}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditEquipments;
