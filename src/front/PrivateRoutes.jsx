import React from "react";
import { Navigate, useLocation } from "react-router-dom";


const PrivateRoutes = ({ children }) => {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!adminToken) return <Navigate to="/admin/login" replace />;
  } else {
    if (!adminToken && !token) return <Navigate to="/login" replace />;
  }

  return children; };

export default PrivateRoutes;
