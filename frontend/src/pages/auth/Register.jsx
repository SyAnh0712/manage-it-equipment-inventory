import { useState } from "react";
import { Form, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import "../../assets/css/auth/Login.css";

const registerValidationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .required("Username is required")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  full_name: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      const { confirmPassword, ...registrationData } = data;

      await register(registrationData);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">
            <span className="badge bg-primary">EIM</span> Register
          </h3>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    autoComplete="new-username"
                    type="text"
                    placeholder="Enter your username"
                    isInvalid={!!errors.username}
                    disabled={isLoading}
                    autoFocus
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Controller
                name="full_name"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    autoComplete="new-full-name"
                    type="text"
                    placeholder="Enter your full name"
                    isInvalid={!!errors.full_name}
                    disabled={isLoading}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.full_name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    autoComplete="new-email"
                    type="email"
                    placeholder="Enter your email"
                    isInvalid={!!errors.email}
                    disabled={isLoading}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <div className="position-relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      autoComplete="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      isInvalid={!!errors.password}
                      disabled={isLoading}
                    />
                  )}
                />
                <button
                  type="button"
                  className="btn btn-sm position-absolute"
                  style={{
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <div className="position-relative">
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      autoComplete="new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      isInvalid={!!errors.confirmPassword}
                      disabled={isLoading}
                    />
                  )}
                />
                <button
                  type="button"
                  className="btn btn-sm position-absolute"
                  style={{
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.confirmPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </div>

            <div className="text-center mt-3">
              <p className="text-muted small">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login here
                </Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
};

export default Register;
