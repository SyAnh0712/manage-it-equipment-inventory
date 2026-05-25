import { Spinner } from "react-bootstrap";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="text-center">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
