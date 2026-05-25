import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h1 className="display-1">404</h1>
          <p className="h4 mb-4">Page Not Found</p>
          <p className="text-muted mb-4">
            The page you are looking for does not exist or has been removed.
          </p>
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
