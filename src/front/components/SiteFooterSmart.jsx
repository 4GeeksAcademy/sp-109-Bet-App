// src/front/components/SiteFooterSmart.jsx
import React from "react";
import { useAuth } from "../hooks/AuthContext";
import SiteFooter from "./SiteFooter";           // público
import SiteFooterApp from "./SiteFooterApp";     // usuario logueado
import SiteFooterAdmin from "./SiteFooterAdmin"; // admin

export default function SiteFooterSmart({ force }) {
  const auth = useAuth() ?? {};
  const { token, role, adminToken } = auth;

  const isAdmin  = Boolean(adminToken) || role === "admin";
  const isLogged = Boolean(token) || isAdmin;

  if (force === "admin" || isAdmin) return <SiteFooterAdmin />;
  if (force === "app"   || isLogged) return <SiteFooterApp />;
  return <SiteFooter />;
}
