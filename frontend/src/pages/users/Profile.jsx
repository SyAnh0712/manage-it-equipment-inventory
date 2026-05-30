import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import axiosClient from "../../services/axiosClient";
import { showToast } from "../../utils/toast";

const Profile = () => {
  const { user, logout } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle profile input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setIsUpdatingProfile(true);
      await axiosClient.put(`/users/${user?.id}`, profileData);
      showToast.success("Cập nhật thông tin thành công");
    } catch (error) {
      showToast.error(error?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
      setIsUpdatingProfile(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error("Mật khẩu mới không khớp");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      setIsChangingPassword(true);
      await axiosClient.put("/users/profile/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      showToast.success("Thay đổi mật khẩu thành công");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Thay đổi mật khẩu thất bại",
      );
    } finally {
      setLoading(false);
      setIsChangingPassword(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Quản Lý Tài Khoản Cá Nhân</h1>
        </Col>
      </Row>

      <Row className="g-4">
        {/* User Info Card */}
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Thông Tin Người Dùng</h5>
            </Card.Header>
            <Card.Body>
              <div className="profile-info">
                <div className="profile-avatar mb-3 text-center">
                  <div
                    className="avatar-circle mx-auto mb-2"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: "#1976d2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "2rem",
                      fontWeight: "700",
                    }}
                  >
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="info-row mb-3">
                  <strong className="text-muted">Tên Đăng Nhập:</strong>
                  <p>{user?.username}</p>
                </div>

                <div className="info-row mb-3">
                  <strong className="text-muted">Tên Đầy Đủ:</strong>
                  <p>{user?.full_name}</p>
                </div>

                <div className="info-row mb-3">
                  <strong className="text-muted">Email:</strong>
                  <p>{user?.email}</p>
                </div>

                <div className="info-row mb-3">
                  <strong className="text-muted">Vai Trò:</strong>
                  <p>
                    <span className="badge bg-info">
                      {user?.role === "admin" ? "Quản Trị Viên" : "Nhân Viên"}
                    </span>
                  </p>
                </div>

                <div className="info-row">
                  <strong className="text-muted">Trạng Thái:</strong>
                  <p>
                    <span className="badge bg-success">Hoạt Động</span>
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Update Profile Form */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Cập Nhật Thông Tin</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdateProfile}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên Đầy Đủ</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleProfileChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading || isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Đang cập nhật..." : "Lưu Thay Đổi"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Change Password Form */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Thay Đổi Mật Khẩu</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Mật Khẩu Hiện Tại</Form.Label>
                  <Form.Control
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật Khẩu Mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Nhập mật khẩu mới"
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    Tối thiểu 6 ký tự
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Xác Nhận Mật Khẩu Mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Xác nhận mật khẩu mới"
                    minLength={6}
                  />
                </Form.Group>

                <Button
                  variant="warning"
                  type="submit"
                  className="w-100 mb-2"
                  disabled={loading || isChangingPassword}
                >
                  {isChangingPassword
                    ? "Đang thay đổi..."
                    : "Thay Đổi Mật Khẩu"}
                </Button>

                <Button
                  variant="outline-danger"
                  className="w-100"
                  onClick={() => {
                    logout();
                  }}
                >
                  Đăng Xuất
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
