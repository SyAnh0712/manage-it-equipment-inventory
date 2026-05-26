import { Table, Button as BSButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatDate";

const UserTable = ({ users, onDelete }) => {
  if (!users || users.length === 0) {
    return <div className="alert alert-info text-center">No users found</div>;
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
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.username}</td>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>
              <StatusBadge status={user.role} />
            </td>
            <td>{formatDate(user.created_at)}</td>
            <td>
              <Link to={`/users/${user.id}/edit`}>
                <BSButton variant="warning" size="sm" className="me-2">
                  <i className="bi bi-pencil"></i> Edit
                </BSButton>
              </Link>
              <BSButton
                variant="danger"
                size="sm"
                onClick={() => onDelete(user.id)}
              >
                <i className="bi bi-trash"></i> Delete
              </BSButton>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;
