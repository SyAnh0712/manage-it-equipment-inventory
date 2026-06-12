import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/css/auth/Login.css";

/* ─── Validation (unchanged) ───────────────────────────────── */
const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

/* ─── Icon helpers ──────────────────────────────────────────── */
const MatIcon = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

/* ─── Component ─────────────────────────────────────────────── */
const Login = () => {
  /* ── business logic (unchanged) ── */
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      const result = await login(data);

      if (result?.requires2FA) {
        navigate("/verify-2fa", { state: { tempToken: result.tempToken } });
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.message ||
          (typeof err === "string" ? err : "Login failed. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── render ── */
  return (
    <div className="lp-root">
      {/* ════════════════ LEFT PANEL ════════════════ */}
      <section className="lp-left" aria-hidden="true">
        {/* hero image with motion */}
        <div className="lp-left__bg" />
        {/* frosted brand card */}
        <div className="lp-left__content">
          <div className="lp-brand">
            {/* header */}
            <div className="lp-brand__header">
              <div className="lp-brand__icon-wrap">
                <MatIcon name="inventory_2" className="lp-brand__icon" />
              </div>
              <h1 className="lp-brand__name">EIM System</h1>
            </div>
            {/* description */}
            <p className="lp-brand__desc">
              Master your assets with precision. Our integrated platform
              provides high-trust, low-friction tracking for all enterprise IT
              equipment.
            </p>
            {/* badges */}
            <div className="lp-brand__badges">
              <div className="lp-badge">
                <MatIcon name="security" className="lp-badge__icon" />
                <span className="lp-badge__label">Enterprise Grade</span>
              </div>
              <div className="lp-badge">
                <MatIcon
                  name="precision_manufacturing"
                  className="lp-badge__icon"
                />
                <span className="lp-badge__label">Precision Tracking</span>
              </div>
            </div>
          </div>
        </div>
        {/* bottom fade */}
        <div className="lp-left__fade" />
      </section>

      {/* ════════════════ RIGHT PANEL ════════════════ */}
      <section className="lp-right">
        {/* mobile-only brand */}
        <div className="lp-mobile-brand">
          <div className="lp-mobile-brand__icon-wrap">
            <MatIcon name="inventory_2" className="lp-mobile-brand__icon" />
          </div>
          <h1 className="lp-mobile-brand__name">EIM System</h1>
        </div>

        {/* login card */}
        <div className="lp-card">
          {/* card header */}
          <div className="lp-card__header">
            <h2 className="lp-card__title">Sign In</h2>
            <p className="lp-card__subtitle">Access your inventory dashboard</p>
          </div>

          {/* global error */}
          {error && (
            <div className="lp-alert" role="alert">
              <MatIcon name="error" className="lp-alert__icon" />
              {error}
            </div>
          )}

          {/* ── form ── */}
          <Form onSubmit={handleSubmit(onSubmit)} noValidate className="lp-form">
            {/* Corporate Email */}
            <Form.Group className="lp-field" controlId="login-email">
              <Form.Label className="lp-label">Corporate Email</Form.Label>
              <div className="lp-input-wrap">
                <MatIcon name="mail" className="lp-input-icon" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="email"
                      placeholder="name@company.com"
                      className={`lp-input${errors.email ? " lp-input--invalid" : ""}`}
                      disabled={isLoading}
                      autoFocus
                      isInvalid={!!errors.email}
                    />
                  )}
                />
              </div>
              <Form.Control.Feedback type="invalid" className="lp-field-error">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group className="lp-field" controlId="login-password">
              <div className="lp-label-row">
                <Form.Label className="lp-label">Password</Form.Label>
                <a href="#forgot" className="lp-forgot">
                  Forgot?
                </a>
              </div>
              <div className="lp-input-wrap">
                <MatIcon name="lock" className="lp-input-icon" />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`lp-input lp-input--pw${errors.password ? " lp-input--invalid" : ""}`}
                      disabled={isLoading}
                      isInvalid={!!errors.password}
                    />
                  )}
                />
                <button
                  type="button"
                  className="lp-pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <MatIcon
                    name={showPassword ? "visibility_off" : "visibility"}
                  />
                </button>
              </div>
              <Form.Control.Feedback type="invalid" className="lp-field-error">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Remember device */}
            <div className="lp-remember">
              <Form.Check
                type="checkbox"
                id="login-remember"
                label="Remember this device for 30 days"
                className="lp-remember__check"
              />
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="lp-btn shimmer-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Login to System</span>
                  <MatIcon name="arrow_forward" className="lp-btn__icon" />
                </>
              )}
            </button>

            {/* OR divider */}
            <div className="lp-divider">
              <div className="lp-divider__line" />
              <span className="lp-divider__text">OR</span>
              <div className="lp-divider__line" />
            </div>

            {/* Register link */}
            <p className="lp-register">
              New to the network?{" "}
              <Link to="/register" className="lp-register__link">
                Register here
              </Link>
            </p>
          </Form>
        </div>

        {/* footer */}
        <footer className="lp-footer">
          <a href="#security" className="lp-footer__link">
            Security Policy
          </a>
          <a href="#status" className="lp-footer__link">
            System Status
          </a>
          <span className="lp-footer__ver">v2.4.0</span>
        </footer>
      </section>
    </div>
  );
};

export default Login;
