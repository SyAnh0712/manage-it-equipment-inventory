import { useState } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserForm from "../../components/forms/UserForm";
import userService from "../../services/userService";

const AddUsers = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      await userService.createUser(data);
      toast.success("User created successfully");
      navigate("/users");
    } catch (error) {
      toast.error(error?.message || "Failed to create user");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BSButton
              variant="link"
              onClick={() => navigate("/users")}
              className="text-decoration-none"
            >
              <i className="bi bi-arrow-left"></i> Back
            </BSButton>
            <h1 className="mb-0">Add New User</h1>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddUsers;
