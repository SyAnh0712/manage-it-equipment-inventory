import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const DeleteSuppliers = () => {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h1>Delete Supplier</h1>
          <p>This page is for delete confirmation</p>

          <Link to="/suppliers">
            <Button variant="primary">Back to Suppliers</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteSuppliers;
