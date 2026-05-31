import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import authRoutes from "./AuthRouters";
import dashboardRoutes from "./DashBoardRouters";
import userRoutes from "./UsersRouters";
import categoryRoutes from "./CatagoriesRouters";
import supplierRoutes from "./SuppliersRouters";
import equipmentRoutes from "./EquipmentRouters";
import importRoutes from "./ImportRouters";
import exportRoutes from "./ExportRouters";
import inventoryRoutes from "./InventoryRouters";

import NotFound from "../pages/errors/NotFound";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  const routes = [
    ...authRoutes(isAuthenticated),
    ...dashboardRoutes,
    ...userRoutes,
    ...categoryRoutes,
    ...supplierRoutes,
    ...equipmentRoutes,
    ...importRoutes,
    ...exportRoutes,
    ...inventoryRoutes,
  ];

  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
