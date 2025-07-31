import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AdminLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Borrar token del almacenamiento local
        localStorage.removeItem("adminToken");
        alert("Sesión cerrada correctamente.");
        navigate("/admin/login");
    }, [navigate]);

    return null;
};