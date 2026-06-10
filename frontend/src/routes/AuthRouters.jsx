import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const VerifyOtp = lazy(() => import("../pages/auth/VerifyOtp"));
const Verify2fa = lazy(() => import("../pages/auth/Verify2fa"));
const Setup2fa = lazy(() => import("../pages/auth/Setup2fa"));

const authRoutes = (isAuthenticated) => [
  {
    path: "/login",
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <Login />,
  },

  {
    path: "/register",
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <Register />,
  },

  {
    path: "/verify-otp",
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <VerifyOtp />,
  },

  {
    path: "/verify-2fa",
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <Verify2fa />,
  },

  {
    path: "/setup-2fa",
    element: <Setup2fa />,
  },
];

export default authRoutes;
