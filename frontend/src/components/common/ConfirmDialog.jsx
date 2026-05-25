import { Modal, Button } from "react-bootstrap";

const ConfirmDialog = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Processing..." : "Confirm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
