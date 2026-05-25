import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const DeleteUsers = () => {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h1>Delete User</h1>
          <p>This page is for delete confirmation</p>
          <Link to="/users">
            <Button variant="primary">Back to Users</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteUsers;
