import { Spinner } from "react-bootstrap";
import { motion } from "motion/react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <motion.div
      className="loading-state"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted">{message}</p>
        <div className="loading-skeleton" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
