import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button as BSButton } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserForm from "../../components/forms/UserForm";
import Loading from "../../components/common/Loading";
import userService from "../../services/userService";

const EditUsers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(id);
      // axiosClient returns response.data as the API body, which is { success, data }
      // so prefer response.data (the actual user) when available
      setUser(response?.data || response);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = { ...data };
      if (!payload.password) {
        delete payload.password;
      }
      await userService.updateUser(id, payload);
      toast.success("User updated successfully");
      navigate("/users");
    } catch (error) {
      toast.error(error?.message || "Failed to update user");
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
              onClick={() => navigate("/users")}
              className="text-decoration-none"
            >
              <i className="bi bi-arrow-left"></i> Back
            </BSButton>
            <h1 className="mb-0">Edit User</h1>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              {user && (
                <UserForm
                  initialData={user}
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

export default EditUsers;
