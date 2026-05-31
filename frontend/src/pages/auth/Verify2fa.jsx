import { useState } from "react";
import { Form, Card } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import "../../assets/css/auth/Login.css";

const codeValidationSchema = yup.object().shape({
  code: yup
    .string()
    .min(6, "Mã phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mã xác thực"),
});

const Verify2fa = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2fa } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);

  const tempToken = location.state?.tempToken;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(codeValidationSchema),
    defaultValues: { code: "" },
  });

  if (!tempToken) {
    return (
      <AuthLayout>
        <Card className="shadow-sm">
          <Card.Body className="p-4 text-center">
            <p className="text-danger">Phiên xác thực không hợp lệ.</p>
            <Link to="/login" className="btn btn-primary">
              Quay lại đăng nhập
            </Link>
          </Card.Body>
        </Card>
      </AuthLayout>
    );
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      await verify2fa(tempToken, data.code);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Xác thực 2FA thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecovery = () => {
    setUseRecovery(!useRecovery);
    setError("");
    reset({ code: "" });
  };

  return (
    <AuthLayout>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">
            <span className="badge bg-primary">EIM</span> Xác thực 2FA
          </h3>

          <p className="text-center text-muted mb-4">
            {useRecovery
              ? "Nhập mã khôi phục (recovery code)"
              : "Nhập mã 6 số từ ứng dụng Google Authenticator"}
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>
                {useRecovery ? "Mã khôi phục" : "Mã xác thực"}
              </Form.Label>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder={useRecovery ? "Nhập mã khôi phục" : "Nhập mã 6 số"}
                    isInvalid={!!errors.code}
                    disabled={isLoading}
                    maxLength={useRecovery ? 20 : 6}
                    autoFocus
                    style={
                      useRecovery
                        ? {}
                        : { textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px" }
                    }
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.code?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? "Đang xác thực..." : "Xác thực"}
              </Button>
            </div>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link text-decoration-none small"
                onClick={toggleRecovery}
              >
                {useRecovery
                  ? "Dùng mã từ ứng dụng Authenticator"
                  : "Dùng mã khôi phục (Recovery Code)"}
              </button>
            </div>

            <div className="text-center mt-2">
              <Link to="/login" className="text-decoration-none small">
                Quay lại đăng nhập
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
};

export default Verify2fa;
