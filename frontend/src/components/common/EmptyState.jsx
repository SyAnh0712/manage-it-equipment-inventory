import { motion } from "motion/react";

const EmptyState = ({
  icon = "bi-inbox",
  title = "No data found",
  message = "Try changing your filters or adding a new record.",
}) => {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-message">{message}</div>
    </motion.div>
  );
};

export default EmptyState;
