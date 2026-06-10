import { useState } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CategoriesForm from "../../components/forms/CategoriesForm";
import categoriesService from "../../services/categoriesService";

const AddCategories = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);

      await categoriesService.createCategory(data);

      toast.success("Category created successfully");

      navigate("/categories");
    } catch (error) {
      toast.error(error?.message || "Failed to create category");
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
              onClick={() => navigate("/categories")}
              className="text-decoration-none"
            >
              <i className="bi bi-arrow-left"></i> Back
            </BSButton>

            <h1 className="mb-0">Add New Category</h1>
          </div>
        </Col>
      </Row>

      <Row className="form-page-grid">
        <Col xs={12}>
          <Card className="form-shell">
            <Card.Body>
              <CategoriesForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCategories;
