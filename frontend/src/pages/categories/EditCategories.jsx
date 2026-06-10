import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CategoriesForm from "../../components/forms/CategoriesForm.jsx";
import Loading from "../../components/common/Loading.jsx";

import categoriesService from "../../services/categoriesService.js";

const EditCategories = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);

      const response = await categoriesService.getCategoryById(id);

      setCategory(response);
    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch category");

      navigate("/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      await categoriesService.updateCategory(id, data);

      toast.success("Category updated successfully");

      navigate("/categories");
    } catch (error) {
      toast.error(error?.message || "Failed to update category");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

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

            <h1 className="mb-0">Edit Category</h1>
          </div>
        </Col>
      </Row>

      <Row className="form-page-grid">
        <Col xs={12}>
          <Card className="form-shell">
            <Card.Body>
              {category && (
                <CategoriesForm
                  initialData={category}
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditCategories;
