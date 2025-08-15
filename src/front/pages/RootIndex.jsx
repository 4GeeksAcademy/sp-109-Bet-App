// src/front/pages/RootIndex.jsx
import React from "react";
import { useAuth } from "../hooks/AuthContext";
import Home from "./Home";
import LandingPreview from "./LandingPreview";

export default function RootIndex() {
  const { user } = useAuth();          // o el flag que uses para saber si hay sesión
  return user ? <Home /> : <LandingPreview />;
}
