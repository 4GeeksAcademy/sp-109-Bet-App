import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useLocation } from "react-router-dom";
// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.


export const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Outlet />
      
      {location.pathname === "/" && (
        <div className="text-center mt-4">
          <p>Check the <a href="#">template documentation</a> for help.</p>
          <p>Made with ❤️ by <a href="#">4Geeks Academy</a></p>
        </div>
      )}
    </>
  );
};
