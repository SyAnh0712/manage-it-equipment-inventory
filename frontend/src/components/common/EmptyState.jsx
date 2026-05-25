import { Alert } from "react-bootstrap";

const EmptyState = ({
  title = "No Data",
  message = "No data found",
  icon = "info-circle",
}) => {
  return (
    <Alert variant="info" className="text-center py-5">
      <i className={`bi bi-${icon} me-2`} style={{ fontSize: "2rem" }}></i>
      <h4>{title}</h4>
      <p className="mb-0 text-muted">{message}</p>
    </Alert>
  );
};

export default EmptyState;
