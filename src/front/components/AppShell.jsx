// src/front/components/AppShell.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SoftRibbonNav from "./SoftRibbonNav";
import SiteFooter from "./SiteFooter";       // público
import SiteFooterApp from "./SiteFooterApp"; // dentro de la app
import { useAuth } from "../hooks/AuthContext";
import "../styles/app-shell.css";

export default function AppShell() {
  const { token } = useAuth() ?? {};
  const loggedIn = Boolean(token);

  return (
    <div className="app-shell">
      <SoftRibbonNav />
      <main className="app-main">
        <Outlet />
      </main>
      {loggedIn ? <SiteFooterApp /> : <SiteFooter />}
    </div>
  );
}
