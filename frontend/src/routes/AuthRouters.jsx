import { Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const authRoutes = (isAuthenticated) => [
  {
    path: "/login",
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <Login />,
  },

  {
    path: "/register",
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <Register />,
  },
];

export default authRoutes;
