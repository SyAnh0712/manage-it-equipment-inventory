import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserList from "../pages/user/UserList";
import AddUser from "../pages/user/AddUser";
import EditUser from "../pages/user/EditUser";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/users/create" element={<AddUser />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
