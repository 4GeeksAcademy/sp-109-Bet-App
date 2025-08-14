import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { SideNav } from "../components/SideNav";
import { Footer } from "../components/Footer";
import { useAuth } from "../hooks/AuthContext";
import './Layout.css'

export const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const hideSideNavRoutes = ["/login", "/register", "/"];
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
        <div className="content-wrapper flex-grow-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};


