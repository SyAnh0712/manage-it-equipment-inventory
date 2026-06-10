import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
