import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import Button from "../../components/common/Button";

const DeleteEquipments = () => {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h1>Delete Equipment</h1>

          <p>This page is for delete confirmation</p>

          <Link to="/equipment">
            <Button variant="primary">Back to Equipments</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteEquipments;
