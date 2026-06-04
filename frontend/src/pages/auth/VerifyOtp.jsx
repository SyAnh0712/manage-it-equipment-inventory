import { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import authService from "../../services/authService";
import AuthLayout from "../../layouts/AuthLayout";
import "../../assets/css/auth/Login.css";

const otpValidationSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP phải có 6 chữ số")
    .matches(/^\d+$/, "OTP chỉ chứa số")
    .required("Vui lòng nhập mã OTP"),
});

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);

  const email = location.state?.email;
  const [devOtp, setDevOtp] = useState(location.state?.otp || "");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(otpValidationSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      await verifyOtp(email, data.otp);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Xác minh OTP thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setError("");
      setSuccess("");
      const response = await authService.resendOtp(email);
      const data = response?.data || response;
      if (data?.otp) {
        setDevOtp(data.otp);
      }
      setSuccess(data?.message || "Mã OTP mới đã được gửi đến email của bạn");
      setResendCooldown(60);
      setCountdown(300);
    } catch (err) {
      setError(err?.message || "Gửi lại OTP thất bại");
    }
  };

  if (!email) return null;

  return (
    <AuthLayout>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">
            <span className="badge bg-primary">EIM</span> Xác minh Email
          </h3>

          <p className="text-center text-muted mb-4">
            Mã OTP đã được gửi đến <strong>{email}</strong>
          </p>

          {devOtp && (
            <div className="alert alert-info text-center" role="alert">
              <small className="text-muted d-block">Chế độ Dev - Mã OTP của bạn:</small>
              <strong style={{ fontSize: "1.5rem", letterSpacing: "4px" }}>{devOtp}</strong>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Mã OTP (6 chữ số)</Form.Label>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Nhập mã OTP"
                    isInvalid={!!errors.otp}
                    disabled={isLoading}
                    maxLength={6}
                    autoFocus
                    style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px" }}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.otp?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {countdown > 0 && (
              <p className="text-center text-muted small">
                Mã hết hạn sau: <strong>{formatTime(countdown)}</strong>
              </p>
            )}

            {countdown <= 0 && (
              <p className="text-center text-danger small">
                Mã OTP đã hết hạn. Vui lòng gửi lại.
              </p>
            )}

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading || countdown <= 0}
              >
                {isLoading ? "Đang xác minh..." : "Xác minh"}
              </Button>
            </div>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link text-decoration-none"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Gửi lại OTP (${resendCooldown}s)`
                  : "Gửi lại mã OTP"}
              </button>
            </div>

            <div className="text-center mt-2">
              <Link to="/register" className="text-decoration-none small">
                Quay lại đăng ký
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
};

export default VerifyOtp;
