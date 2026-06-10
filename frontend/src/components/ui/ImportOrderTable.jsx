import PropTypes from "prop-types";
import { Table, Button as BSButton } from "react-bootstrap";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState";

const ImportOrderTable = ({
  orders,
  onDelete,
  onApprove,
  onReject,
  currentUser,
}) => {
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon="bi-box-arrow-in-down"
        title="No import orders found"
        message="Import orders will appear here after they are created."
      />
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Order Code</th>
          <th>Supplier</th>
          <th>Status</th>
          <th>Note</th>
          <th>Created By</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order, index) => {
          const isOwner =
            String(currentUser?.id) === String(order.created_by);
          const canEdit =
            order.status === "pending" &&
            (currentUser?.role === "admin" || isOwner);
          const canDelete =
            order.status === "pending" &&
            (currentUser?.role === "admin" || isOwner);
          const canApprove =
            order.status === "pending" && currentUser?.role === "admin";
          const canReject =
            order.status === "pending" && currentUser?.role === "admin";

          return (
            <motion.tr
              key={order.id || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.025, duration: 0.18 }}
            >
              <td>{index + 1}</td>
              <td>
                <Link
                  to={`/imports/${order.id}`}
                  className="text-decoration-none"
                >
                  {order.code}
                </Link>
              </td>
              <td>{order.supplier?.name || "-"}</td>
              <td>{order.status}</td>
              <td>{order.note || "-"}</td>
              <td>
                {order.creator?.full_name || order.creator?.username || "-"}
              </td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                <Link to={`/imports/${order.id}`}>
                  <BSButton variant="info" size="sm" className="me-2 mb-2">
                    View
                  </BSButton>
                </Link>
                {canEdit && (
                  <Link to={`/imports/${order.id}/edit`}>
                    <BSButton variant="warning" size="sm" className="me-2 mb-2">
                      Edit
                    </BSButton>
                  </Link>
                )}
                {canApprove && (
                  <BSButton
                    variant="success"
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => onApprove(order)}
                  >
                    Approve
                  </BSButton>
                )}
                {canReject && (
                  <BSButton
                    variant="secondary"
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => onReject(order)}
                  >
                    Reject
                  </BSButton>
                )}
                {canDelete && (
                  <BSButton
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(order)}
                  >
                    Delete
                  </BSButton>
                )}
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </Table>
  );
};

ImportOrderTable.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default ImportOrderTable;
