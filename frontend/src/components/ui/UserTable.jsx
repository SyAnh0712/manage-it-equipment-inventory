import { Table, Button as BSButton } from "react-bootstrap";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";
import EmptyState from "../common/EmptyState";

const UserTable = ({ users, onDelete, onToggleLock, processingLockId }) => {
  const { user: currentUser } = useAuth();
  if (!users || users.length === 0) {
    return <EmptyState icon="bi-people" title="No users found" />;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Role</th>
          {currentUser?.role === "admin" && <th>Locked</th>}
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <motion.tr
            key={user.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025, duration: 0.18 }}
          >
            <td>{index + 1}</td>
            <td>{user.username}</td>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>
              <StatusBadge status={user.role} />
            </td>
            {currentUser?.role === "admin" && (
              <td>
                {user.is_locked ? (
                  <span className="badge bg-danger">Locked</span>
                ) : (
                  <span className="badge bg-success">Active</span>
                )}
              </td>
            )}
            <td>{formatDate(user.created_at)}</td>
            <td>
              <Link to={`/users/${user.id}/edit`}>
                <BSButton variant="warning" size="sm" className="me-2">
                  <i className="bi bi-pencil"></i> Edit
                </BSButton>
              </Link>

              {currentUser?.role === "admin" && (
                <BSButton
                  variant={user.is_locked ? "secondary" : "outline-secondary"}
                  size="sm"
                  className="me-2"
                  onClick={() => onToggleLock && onToggleLock(user)}
                  disabled={
                    processingLockId === user.id || currentUser?.id === user.id
                  }
                  title={
                    currentUser?.id === user.id
                      ? "Cannot lock your own account"
                      : user.is_locked
                        ? "Unlock user"
                        : "Lock user"
                  }
                >
                  {processingLockId === user.id ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <>
                      <i
                        className={
                          user.is_locked ? "bi bi-unlock" : "bi bi-lock"
                        }
                      ></i>
                      <span className="ms-1">
                        {user.is_locked ? "Unlock" : "Lock"}
                      </span>
                    </>
                  )}
                </BSButton>
              )}

              <BSButton
                variant="danger"
                size="sm"
                onClick={() => onDelete(user.id)}
              >
                <i className="bi bi-trash"></i> Delete
              </BSButton>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;
