import { Suspense } from "react";
import { AnimatePresence } from "motion/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import authRoutes from "./AuthRouters";
import dashboardRoutes from "./DashBoardRouters";
import userRoutes from "./UsersRouters";
import categoryRoutes from "./CategoriesRouters";
import supplierRoutes from "./SuppliersRouters";
import equipmentRoutes from "./EquipmentRouters";
import importRoutes from "./ImportRouters";
import exportRoutes from "./ExportRouters";
import inventoryRoutes from "./InventoryRouters";

import NotFound from "../pages/errors/NotFound";
import AnimatedPage from "../components/common/AnimatedPage";
import Loading from "../components/common/Loading";

const AnimatedRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

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

  const withTransition = (element) => <AnimatedPage>{element}</AnimatedPage>;

  return (
    <Suspense fallback={<Loading message="Preparing page..." />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={withTransition(route.element)}
            />
          ))}

          <Route path="*" element={withTransition(<NotFound />)} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default AppRoutes;
