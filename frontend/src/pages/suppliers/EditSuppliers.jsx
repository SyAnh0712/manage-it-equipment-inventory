import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import SuppliersForm from "../../components/forms/SuppliersForm";
import Loading from "../../components/common/Loading";
import suppliersService from "../../services/suppliersService";
import { extractApiData } from "../../utils/apiResponse";

const EditSuppliers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(async () => {
      try {
        setIsFetching(true);
        const response = await suppliersService.getSupplierById(id);
        setSupplier(extractApiData(response));
      } catch (error) {
        toast.error("Failed to fetch supplier");
        console.error(error);
        navigate("/suppliers");
      } finally {
        setIsFetching(false);
      }
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      await suppliersService.updateSupplier(id, data);
      toast.success("Supplier updated successfully");
      navigate("/suppliers");
    } catch (error) {
      toast.error(error?.message || "Failed to update supplier");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4 form-page">
      <Row className="mb-4 form-page-header">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BSButton
              variant="link"
              onClick={() => navigate("/suppliers")}
              className="text-decoration-none"
            >
              <i className="bi bi-arrow-left"></i> Back
            </BSButton>
            <h1 className="mb-0">Edit Supplier</h1>
          </div>
        </Col>
      </Row>

      <Row className="form-page-grid">
        <Col xs={12}>
          <Card className="form-shell">
            <Card.Body>
              {supplier && (
                <SuppliersForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  initialValues={supplier}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditSuppliers;
