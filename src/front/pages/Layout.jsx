import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SideNav } from "../components/SideNav";
import { useLocation } from "react-router-dom";

export const Layout = () => {
  const location = useLocation();

  const hideSideNavRoutes = ["/login", "/register", "/"];
  const shouldShowSideNav = !hideSideNavRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />

      <div
        className="d-flex"
        style={{
          minHeight: "calc(100vh - 140px)",
          width: "100%",
          paddingLeft: shouldShowSideNav ? "40px" : "0",
          paddingTop: "70px", 
          boxSizing: "border-box",
        }}
      >
        {shouldShowSideNav && (
          <div style={{ width: "280px", marginRight: "0px" }}>
            <SideNav />
          </div>
        )}

        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>

      {location.pathname === "/" && (
        <div className="text-center mt-4">
          <p>
            Check the <a href="#">template documentation</a> for help.
          </p>
          <p>
            Made with ❤️ by <a href="#">4Geeks Academy</a>
          </p>
        </div>
      )}

      <Footer />
    </>
  );
};

