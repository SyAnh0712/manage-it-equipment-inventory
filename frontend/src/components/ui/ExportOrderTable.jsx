import PropTypes from "prop-types";
import { Table, Button as BSButton } from "react-bootstrap";
import { Link } from "react-router-dom";

const ExportOrderTable = ({
  orders,
  onDelete,
  onApprove,
  onReject,
  currentUser,
}) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="alert alert-info text-center">No export orders found</div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Order Code</th>
          <th>Department</th>
          <th>Receiver</th>
          <th>Status</th>
          <th>Note</th>
          <th>Created By</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order, index) => {
          const isOwner = currentUser?.id === order.created_by;
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
            <tr key={order.id || index}>
              <td>{index + 1}</td>
              <td>{order.code}</td>
              <td>{order.department || "-"}</td>
              <td>{order.receiver || "-"}</td>
              <td>{order.status}</td>
              <td>{order.note || "-"}</td>
              <td>
                {order.creator?.full_name || order.creator?.username || "-"}
              </td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                {canEdit && (
                  <Link to={`/exports/${order.id}/edit`}>
                    <BSButton variant="warning" size="sm" className="me-2">
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
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

ExportOrderTable.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default ExportOrderTable;
