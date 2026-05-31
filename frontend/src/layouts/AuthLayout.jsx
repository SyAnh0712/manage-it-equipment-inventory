import { Container } from "react-bootstrap";

const AuthLayout = ({ children }) => {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">{children}</div>
        </div>
      </Container>
    </div>
  );
};

export default AuthLayout;
