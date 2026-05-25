import { useState, useEffect } from "react";
import { Container, Row, Col, Button as BSButton, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserTable from "../../components/ui/UserTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import userService from "../../services/userService";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.full_name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const pagination = usePagination(filteredUsers, 10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await userService.deleteUser(deleteId);
      setUsers(users.filter((u) => u.id !== deleteId));
      setDeleteId(null);
      pagination.reset();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Users Management</h1>
        </Col>
        <Col className="text-end">
          <Link to="/users/add">
            <BSButton variant="primary">
              <i className="bi bi-plus-circle me-2"></i>
              Add New User
            </BSButton>
          </Link>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <SearchBox
                placeholder="Search by username, name or email..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Col>
            <Col md={6} className="text-end">
              <small className="text-muted">
                Total: <strong>{filteredUsers.length}</strong> user(s)
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {filteredUsers.length === 0 ? (
            <div className="alert alert-info text-center mb-0">
              No users found
            </div>
          ) : (
            <>
              <UserTable
                users={pagination.paginatedItems}
                onDelete={(id) => setDeleteId(id)}
              />
              <div className="d-flex justify-content-center mt-4">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.goToPage}
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={!!deleteId}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </Container>
  );
};

export default UsersList;
