import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { SideNav } from "../components/SideNav";
// ⚠️ Sustituimos el Footer antiguo por los dos que tienes ahora
import SiteFooter from "../components/SiteFooter";         // público
import SiteFooterApp from "../components/SiteFooterApp";   // dentro de la app (con "Log out")
import { useAuth } from "../hooks/AuthContext";
import './Layout.css';

export const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const hideSideNavRoutes = ["/login", "/register", "/preview"];
  const shouldShowSideNav = user && !hideSideNavRoutes.includes(location.pathname);

  return (
    <div className="layout-container d-flex">
      {shouldShowSideNav && (
        <nav
          id="sidebarMenu"
          className="sidebar bg-light d-flex flex-column"
        >
          <SideNav user={user} />
        </nav>
      )}

      <div className="flex-grow-1 main-content d-flex flex-column">
        <Navbar />

        {/* Esta zona crece y empuja el footer al fondo */}
        <div className="content-wrapper flex-grow-1">
          <Outlet />
        </div>

        {/* Footer según sesión */}
        {user ? <SiteFooterApp /> : <SiteFooter />}
      </div>
    </div>
  );
};
