import { useState } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/common/Button";
import authService from "../../services/authService";
import AuthLayout from "../../layouts/AuthLayout";
import "../../assets/css/auth/Login.css";

const codeSchema = yup.object().shape({
  code: yup
    .string()
    .length(6, "Mã phải có 6 chữ số")
    .matches(/^\d+$/, "Mã chỉ chứa số")
    .required("Vui lòng nhập mã xác thực"),
});

const Setup2fa = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(codeSchema),
    defaultValues: { code: "" },
  });

  const handleSetup = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await authService.setup2fa();
      const data = response?.data || response;
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep(2);
    } catch (err) {
      setError(err?.message || "Không thể tạo mã 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCode = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await authService.confirm2faSetup(data.code, secret);
      const result = response?.data || response;
      setRecoveryCodes(result.recoveryCodes);
      setStep(3);
    } catch (err) {
      setError(err?.message || "Mã xác thực không hợp lệ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCodes = () => {
    const text = recoveryCodes.join("\n");
    navigator.clipboard.writeText(text);
  };

  if (step === 1) {
    return (
      <AuthLayout>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <h3 className="text-center mb-4">
              <span className="badge bg-primary">EIM</span> Thiết lập 2FA
            </h3>

            <p className="text-muted text-center mb-4">
              Bảo vệ tài khoản Admin bằng xác thực 2 lớp với Google Authenticator.
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-grid">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSetup}
                disabled={isLoading}
              >
                {isLoading ? "Đang tạo..." : "Bắt đầu thiết lập 2FA"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </AuthLayout>
    );
  }

  if (step === 2) {
    return (
      <AuthLayout>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <h3 className="text-center mb-4">
              <span className="badge bg-primary">EIM</span> Quét mã QR
            </h3>

            <p className="text-muted text-center mb-3">
              Mở ứng dụng Google Authenticator và quét mã QR bên dưới:
            </p>

            {qrCode && (
              <div className="text-center mb-3">
                <img src={qrCode} alt="QR Code" style={{ maxWidth: "200px" }} />
              </div>
            )}

            <div className="mb-3">
              <Form.Label className="small text-muted">
                Hoặc nhập mã thủ công:
              </Form.Label>
              <Form.Control
                type="text"
                value={secret}
                readOnly
                style={{ fontSize: "0.85rem", fontFamily: "monospace" }}
              />
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit(onSubmitCode)}>
              <Form.Group className="mb-3">
                <Form.Label>Nhập mã 6 số từ ứng dụng</Form.Label>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="000000"
                      isInvalid={!!errors.code}
                      disabled={isLoading}
                      maxLength={6}
                      autoFocus
                      style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px" }}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.code?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit(onSubmitCode)}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xác nhận..." : "Xác nhận & Bật 2FA"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">
            <span className="badge bg-success">&#10003;</span> 2FA đã được bật
          </h3>

          <Alert variant="warning">
            <strong>Lưu ý quan trọng:</strong> Lưu lại các mã khôi phục bên dưới.
            Đây là lần duy nhất bạn có thể xem chúng. Sử dụng khi mất quyền truy cập
            ứng dụng Authenticator.
          </Alert>

          <div
            className="bg-light p-3 rounded mb-3"
            style={{ fontFamily: "monospace" }}
          >
            {recoveryCodes.map((code, index) => (
              <div key={index} className="mb-1">
                {code}
              </div>
            ))}
          </div>

          <div className="d-grid gap-2">
            <Button variant="outline-primary" onClick={handleCopyCodes}>
              Sao chép mã khôi phục
            </Button>
            <Button
              variant="primary"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Hoàn tất
            </Button>
          </div>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
};

export default Setup2fa;
