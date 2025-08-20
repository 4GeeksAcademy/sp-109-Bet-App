import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import "../styles/AdminUserView.css";

import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const AdminUserView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, role, logout } = useAuth();

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const didFetch = useRef(false);

    useEffect(() => {
    if (role === undefined) return;
    // Si no hay token o no es admin → manda al login admin
    if (!token || role !== "admin") {
      navigate("/admin/login", { state: { fromProtected: true } });
      return;
    }
    
    if (didFetch.current) return; 
    didFetch.current = true;

    const fetchUser = async () => {
        setLoading(true);
        setError("");

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            if (res.status === 401) {
            // token inválido/expirado → limpia sesión y redirige a login admin
            logout?.();
            navigate("/admin/login", { state: { fromProtected: true } });
            return;
        }
        if (!res.ok) {
          let msg = "User not found.";
          try {
            const data = await res.json();
            msg = data.msg || msg;
          } catch (_) {}
          setError(msg);
          return;
        }

        const data = await res.json();
        setUser(data);
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("Server error while fetching user.");
        } finally {
        setLoading(false);
        }
    };
    
    fetchUser();
    }, [id, token, role, logout, navigate]);

    if (loading) return <div className="container mt-5">Loading user data...</div>;

    if (error) {
        return (
            <div className="container mt-5">
                <p style={{ color: "red" }}>{error}</p>
                <Link to="/adminusers" className="btn btn-secondary">Back to Users</Link>
            </div>
        );
    }

      if (!user) {
            return (
            <div className="container mt-5">
                <p style={{ color: "red" }}>User not available.</p>
                <Link to="/adminusers" className="btn btn-secondary">Back to Users</Link>
            </div>
            );
        }

    return (
        <div className="admin-user-view-scope">
            <SoftRibbonNav />
            <div className="bg-art" aria-hidden="true"></div>

                <div className="content">
                    <section className="users-hero">
                        <div className="container-neo">
                        <h2 className="auv-title">User Details</h2>
                        </div>
                    </section>
                    <div className="user-card">
                    <ul className="list-group mb-4">
                        <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
                        <li className="list-group-item"><strong>Name:</strong> {user.name}</li>
                        <li className="list-group-item"><strong>Last Name:</strong> {user.last_name}</li>
                        <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
                        <li className="list-group-item"><strong>Money:</strong> {user.money}</li>
                    </ul>
                    <button
                    onClick={() => navigate("/adminusers")}
                    className="btn-auv-back"
                    title="Back to Users"
                    >
                    <i className="fas fa-arrow-left"></i>
                    Back to Users
                    </button>
                </div>
            </div>
        </div>
    );
};