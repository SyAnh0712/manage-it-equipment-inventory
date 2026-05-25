import { Container, Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard</h1>

      <Row className="g-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>
                <i className="bi bi-people text-primary"></i>
              </h3>
              <h6>Users</h6>
              <h2 className="text-primary">--</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>
                <i className="bi bi-inbox text-success"></i>
              </h3>
              <h6>Equipment</h6>
              <h2 className="text-success">--</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>
                <i className="bi bi-bookmark text-warning"></i>
              </h3>
              <h6>Categories</h6>
              <h2 className="text-warning">--</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>
                <i className="bi bi-truck text-info"></i>
              </h3>
              <h6>Suppliers</h6>
              <h2 className="text-info">--</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">No activity yet.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
