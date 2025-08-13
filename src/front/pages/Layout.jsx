import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SideNav } from "../components/SideNav";
import { useLocation } from "react-router-dom";
import "./Layout.css";

export const Layout = () => {
  const location = useLocation();
  const hideSideNavRoutes = ["/login", "/register", "/"];
  const shouldShowSideNav = !hideSideNavRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="content-wrapper">
        {shouldShowSideNav && (
          <div className="sidenav-container">
            <SideNav />
          </div>
        )}
        
        <main className={`main-content ${shouldShowSideNav ? 'with-sidenav' : ''}`}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

