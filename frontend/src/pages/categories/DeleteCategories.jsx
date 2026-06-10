import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import Button from "../../components/common/Button";

const DeleteCategories = () => {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h1>Delete Category</h1>

          <p>This page is for delete confirmation</p>

          <Link to="/categories">
            <Button variant="primary">Back to Categories</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteCategories;
