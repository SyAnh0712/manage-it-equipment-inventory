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
import {
  extractListData,
  LIST_FETCH_ALL_PARAMS,
} from "../../utils/apiResponse";
import { listenToSocket } from "../../services/socketService";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [processingLockId, setProcessingLockId] = useState(null);
  const [confirmLock, setConfirmLock] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredUsers = users.filter((user) => {
    const username = user.username?.toLowerCase() || "";
    const fullName = user.full_name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const query = debouncedSearchTerm.toLowerCase();

    return (
      username.includes(query) ||
      fullName.includes(query) ||
      email.includes(query)
    );
  });

  const pagination = usePagination(filteredUsers, 10);

  useEffect(() => {
    fetchUsers();

    const removeLockedListener = listenToSocket("user:locked", () =>
      fetchUsers(),
    );
    const removeUnlockedListener = listenToSocket("user:unlocked", () =>
      fetchUsers(),
    );

    return () => {
      removeLockedListener();
      removeUnlockedListener();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers(LIST_FETCH_ALL_PARAMS);
      setUsers(extractListData(response));
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

  // open confirmation dialog for lock/unlock
  const handleToggleLock = (user) => {
    setConfirmLock({ user, action: user.is_locked ? "unlock" : "lock" });
  };

  const handleConfirmLock = async () => {
    if (!confirmLock) return;

    const { user, action } = confirmLock;

    try {
      setProcessingLockId(user.id);
      if (action === "unlock") {
        const response = await userService.unlockUser(user.id);
        const updated = response?.data || response;
        setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
        toast.success("User unlocked successfully");
      } else {
        const response = await userService.lockUser(user.id);
        const updated = response?.data || response;
        setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
        toast.success("User locked successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to change lock status");
    } finally {
      setProcessingLockId(null);
      setConfirmLock(null);
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
              <i className="bi bi-plus-circle me-2"></i> Add New User
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
                onToggleLock={handleToggleLock}
                processingLockId={processingLockId}
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
      <ConfirmDialog
        show={!!confirmLock}
        title={confirmLock?.action === "lock" ? "Lock User" : "Unlock User"}
        message={
          confirmLock?.action === "lock"
            ? `Are you sure you want to lock user ${confirmLock?.user?.username}?`
            : `Are you sure you want to unlock user ${confirmLock?.user?.username}?`
        }
        onConfirm={handleConfirmLock}
        onCancel={() => setConfirmLock(null)}
        loading={processingLockId === confirmLock?.user?.id}
      />
    </Container>
  );
};

export default UsersList;
