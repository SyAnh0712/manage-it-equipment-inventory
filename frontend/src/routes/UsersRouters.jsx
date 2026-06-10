import { lazy } from "react";
import AdminRoute from "./AdminRouters";

const UsersList = lazy(() => import("../pages/users/UsersList"));
const AddUsers = lazy(() => import("../pages/users/AddUsers"));
const EditUsers = lazy(() => import("../pages/users/EditUsers"));
const Profile = lazy(() => import("../pages/users/Profile"));

const userRoutes = [
  {
    path: "/users",
    element: (
      <AdminRoute adminOnly>
        <UsersList />
      </AdminRoute>
    ),
  },

  {
    path: "/users/add",
    element: (
      <AdminRoute adminOnly>
        <AddUsers />
      </AdminRoute>
    ),
  },

  {
    path: "/users/:id/edit",
    element: (
      <AdminRoute adminOnly>
        <EditUsers />
      </AdminRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <AdminRoute>
        <Profile />
      </AdminRoute>
    ),
  },
];

export default userRoutes;
