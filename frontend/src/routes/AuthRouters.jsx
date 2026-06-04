import { Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Verify2fa from "../pages/auth/Verify2fa";
import Setup2fa from "../pages/auth/Setup2fa";

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
