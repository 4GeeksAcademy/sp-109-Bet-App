// src/front/layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { SideNav } from "../components/SideNav";
import SiteFooter from "../components/SiteFooter";
import SiteFooterApp from "../components/SiteFooterApp";
import SiteFooterAdmin from "../components/SiteFooterAdmin";
import { useAuth } from "../hooks/AuthContext";
import './Layout.css';

export const Layout = () => {
  const location = useLocation();


  const { user, role, token, adminToken } = useAuth() ?? {};

  const hideSideNavRoutes = ["/login", "/register", "/preview"];
  const shouldShowSideNav =
    user && !hideSideNavRoutes.includes(location.pathname);

  const isAdmin = Boolean(adminToken) || role === "admin";
  const isLoggedIn = Boolean(user || token);

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

        <div className="content-wrapper flex-grow-1">
          <Outlet />
        </div>

        {isAdmin ? (
          <SiteFooterAdmin />
        ) : isLoggedIn ? (
          <SiteFooterApp />
        ) : (
          <SiteFooter />
        )}
      </div>
    </div>
  );
};
