import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import registerImg from "../../assets/images/register.png";
import "../../assets/css/auth/Register.css";

/* ─── Validation (unchanged) ───────────────────────────────── */
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

/* ─── Icon helper ───────────────────────────────────────────── */
const MatIcon = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`} data-icon={name}>
    {name}
  </span>
);

/* ─── Component ─────────────────────────────────────────────── */
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
    watch,
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

  const passwordValue = watch("password", "");

  /* Calculate password strength reactively */
  const getPasswordStrength = (password) => {
    if (!password) {
      return { score: 0, label: "Password Strength", className: "" };
    }
    let score = 0;
    if (password.length > 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return { score: 1, label: "Weak", className: "weak" };
    }
    if (score === 2) {
      return { score: 2, label: "Fair", className: "fair" };
    }
    if (score === 3) {
      return { score: 3, label: "Strong", className: "strong" };
    }
    return { score: 4, label: "Excellent", className: "excellent" };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      const { confirmPassword, ...registrationData } = data;

      const result = await register(registrationData);
      navigate("/verify-otp", {
        state: { email: data.email, otp: result?.otp },
      });
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rp-root">
      <main className="rp-main">
        {/* ════════════════ LEFT BRANDING PANEL ════════════════ */}
        <section className="rp-left">
          <div className="rp-left__content">
            <div className="mb-8">
              <span className="rp-left__brand-name">EIM System</span>
              <h1 className="rp-left__title">
                Build your enterprise inventory network with confidence.
              </h1>
            </div>
            <div className="rp-left__illustration-wrap">
              <img
                alt="IT Equipment Inventory Management Illustration"
                className="rp-left__illustration"
                src={registerImg}
              />
            </div>
            <ul className="rp-features">
              <li className="rp-features__item">
                <div className="rp-features__icon-wrap">
                  <MatIcon name="security" className="rp-features__icon" />
                </div>
                <span className="rp-features__label">Enterprise Grade Security</span>
              </li>
              <li className="rp-features__item">
                <div className="rp-features__icon-wrap">
                  <MatIcon name="inventory_2" className="rp-features__icon" />
                </div>
                <span className="rp-features__label">Asset Lifecycle Management</span>
              </li>
              <li className="rp-features__item">
                <div className="rp-features__icon-wrap">
                  <MatIcon name="location_on" className="rp-features__icon" />
                </div>
                <span className="rp-features__label">Equipment Tracking</span>
              </li>
              <li className="rp-features__item">
                <div className="rp-features__icon-wrap">
                  <MatIcon name="groups" className="rp-features__icon" />
                </div>
                <span className="rp-features__label">Multi-User Collaboration</span>
              </li>
            </ul>
          </div>
          <div className="rp-left__deco" />
        </section>

        {/* ════════════════ RIGHT FORM PANEL ════════════════ */}
        <section className="rp-right">
          {/* Mobile brand header */}
          <div className="rp-mobile-header">
            <span className="rp-mobile-header__brand">EIM System</span>
          </div>

          <div className="rp-card fade-in">
            <header className="rp-card__header">
              <h2 className="rp-card__title">Join the Network</h2>
              <p className="rp-card__subtitle">
                Create your administrative account to start managing assets.
              </p>
            </header>

            {error && (
              <div className="rp-alert" role="alert">
                <MatIcon name="error" className="rp-alert__icon" />
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="rp-form">
              {/* Username */}
              <Form.Group className="rp-field" controlId="register-username">
                <Form.Label className="rp-label">Username</Form.Label>
                <div className="rp-input-wrap">
                  <MatIcon name="person" className="rp-input-icon" />
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        autoComplete="new-username"
                        type="text"
                        placeholder="jdoe_admin"
                        className={`rp-input${errors.username ? " rp-input--invalid" : ""}`}
                        disabled={isLoading}
                        autoFocus
                        isInvalid={!!errors.username}
                      />
                    )}
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="rp-field-error">
                  {errors.username?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Full Name */}
              <Form.Group className="rp-field" controlId="register-fullname">
                <Form.Label className="rp-label">Full Name</Form.Label>
                <div className="rp-input-wrap">
                  <MatIcon name="badge" className="rp-input-icon" />
                  <Controller
                    name="full_name"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        autoComplete="new-full-name"
                        type="text"
                        placeholder="John Doe"
                        className={`rp-input${errors.full_name ? " rp-input--invalid" : ""}`}
                        disabled={isLoading}
                        isInvalid={!!errors.full_name}
                      />
                    )}
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="rp-field-error">
                  {errors.full_name?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email Address */}
              <Form.Group className="rp-field" controlId="register-email">
                <Form.Label className="rp-label">Email Address</Form.Label>
                <div className="rp-input-wrap">
                  <MatIcon name="mail" className="rp-input-icon" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        autoComplete="new-email"
                        type="email"
                        placeholder="admin@enterprise.com"
                        className={`rp-input${errors.email ? " rp-input--invalid" : ""}`}
                        disabled={isLoading}
                        isInvalid={!!errors.email}
                      />
                    )}
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="rp-field-error">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group className="rp-field" controlId="register-password">
                <Form.Label className="rp-label">Password</Form.Label>
                <div className="rp-input-wrap">
                  <MatIcon name="lock" className="rp-input-icon" />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        autoComplete="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`rp-input rp-input--pw${errors.password ? " rp-input--invalid" : ""}`}
                        disabled={isLoading}
                        isInvalid={!!errors.password}
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="rp-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <MatIcon name={showPassword ? "visibility_off" : "visibility"} id="password-toggle-icon" />
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="rp-strength">
                  <div className="rp-strength__bars">
                    <div
                      className={`rp-strength__bar ${strength.score >= 1
                          ? strength.className === "weak"
                            ? "rp-strength__bar--weak"
                            : strength.className === "fair"
                              ? "rp-strength__bar--fair"
                              : "rp-strength__bar--strong"
                          : ""
                        }`}
                    />
                    <div
                      className={`rp-strength__bar ${strength.score >= 2
                          ? strength.className === "fair"
                            ? "rp-strength__bar--fair"
                            : "rp-strength__bar--strong"
                          : ""
                        }`}
                    />
                    <div
                      className={`rp-strength__bar ${strength.score >= 3 ? "rp-strength__bar--strong" : ""
                        }`}
                    />
                    <div
                      className={`rp-strength__bar ${strength.score >= 4 ? "rp-strength__bar--strong" : ""
                        }`}
                    />
                  </div>
                  <p
                    id="strength-text"
                    className={`rp-strength__text ${strength.className ? `rp-strength__text--${strength.className}` : ""
                      }`}
                  >
                    {strength.label}
                  </p>
                </div>

                <Form.Control.Feedback type="invalid" className="d-block rp-field-error">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group className="rp-field" controlId="register-confirm-password">
                <Form.Label className="rp-label">Confirm Password</Form.Label>
                <div className="rp-input-wrap">
                  <MatIcon name="lock_reset" className="rp-input-icon" />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        autoComplete="new-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`rp-input rp-input--pw${errors.confirmPassword ? " rp-input--invalid" : ""}`}
                        disabled={isLoading}
                        isInvalid={!!errors.confirmPassword}
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="rp-pw-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <MatIcon name={showConfirmPassword ? "visibility_off" : "visibility"} id="confirm-password-toggle-icon" />
                  </button>
                </div>
                <Form.Control.Feedback type="invalid" className="d-block rp-field-error">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Submit Button */}
              <button
                id="submitBtn"
                type="submit"
                className="rp-btn"
                disabled={isLoading}
              >
                <span>{isLoading ? "Creating Account..." : "Create Admin Account"}</span>
                {isLoading && (
                  <div className="loading-spinner" id="loadingIcon">
                    <MatIcon name="progress_activity" />
                  </div>
                )}
              </button>
            </Form>

            <div className="rp-card__footer">
              <p className="rp-card__footer-text">
                Already have an account?{" "}
                <Link to="/login" className="rp-card__footer-link">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
