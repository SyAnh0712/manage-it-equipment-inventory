import UsersList from "../pages/users/UsersList";
import AddUsers from "../pages/users/AddUsers";
import EditUsers from "../pages/users/EditUsers";

import AdminRoute from "./AdminRouters";

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
];

export default userRoutes;
