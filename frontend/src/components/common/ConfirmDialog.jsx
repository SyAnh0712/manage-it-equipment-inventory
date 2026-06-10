import { Modal, Button } from "react-bootstrap";
import { motion } from "motion/react";

const ConfirmDialog = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered dialogClassName="motion-modal">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          {message}
        </motion.div>
      </Modal.Body>
      <Modal.Footer as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
