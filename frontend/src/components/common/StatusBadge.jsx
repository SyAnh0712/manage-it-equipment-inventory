import { Badge } from "react-bootstrap";

const StatusBadge = ({ status }) => {
  const variantMap = {
    admin: "primary",
    staff: "info",
    active: "success",
    inactive: "secondary",
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  const variant = variantMap[status?.toLowerCase()] || "secondary";

  return <Badge bg={variant}>{status}</Badge>;
};

export default StatusBadge;
