// src/front/pages/AdminPlaygrounds.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEye } from "react-icons/fa";
import { useAuth } from "../hooks/AuthContext";
import "../styles/AdminPlaygrounds.css";
/* 🔽 Solo visual */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const AdminPlaygrounds = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  useEffect(() => {
    if (!token || role !== "admin") {
      logout();
      navigate("/admin/login");
    }
  }, [token, role, navigate, logout]);

  useEffect(() => {
    const getAllplaygrounds = async () => {
      setLoading(true);
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.status === 401) {
          logout();
          navigate("/admin/login");
          return;
        }

        if (res.ok) {
          setPlaygrounds(data.playgrounds);
        } else {
          setError(data.msg || "Error fetching playgrounds.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error fetching playgrounds.");
      } finally {
        setLoading(false);
      }
    };

    getAllplaygrounds();
  }, [token, role, navigate, logout]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this playground?")) return;

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        navigate("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to delete playground");

      setPlaygrounds((prev) => prev.filter((pg) => pg.id !== id));
    } catch (err) {
      console.error("Network error during delete:", err);
      setError("Error deleting playground.");
    }
  };

  return (
    <div className="admin-pg-scope">
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="pg-hero">
          <div className="container-neo">
            <h2 className="pg-title">All Playgrounds (Admin)</h2>
            <p className="pg-sub">Gestiona y elimina salas si es necesario.</p>
          </div>
        </section>

        <section className="pb-4">
          <div className="container-neo">
            {error && <div className="alert alert-soft py-2 px-3 mb-3">{error}</div>}

            {loading ? (
              <div className="card-soft mb-3">Loading playgrounds...</div>
            ) : playgrounds.length === 0 ? (
              <div className="card-soft mb-3">No playgrounds found.</div>
            ) : (
              <ul className="list-group list-soft">
                {playgrounds.map((pg) => (
                  <li
                    key={pg.id}
                    className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
                  >
                    <div className="pg-info">
                      <h5 className="pg-name mb-3">Name: {pg.name}</h5>
                      <p className="pg-slug">Slug: <span>{pg.slug}</span></p>
                      <p className="pg-creator">Creator: <span>{pg.created_by || "Unknown"}</span></p>
                      <p className="pg-participants">
                        Participants: <span>{pg.playground_used ? pg.playground_used.length : 0}</span>
                      </p>
                    </div>
                    <div className="pg-actions">
                      <button
                        className="btn btn-sm btn-ghost btn-outline-primary"
                        onClick={() => navigate(`/playground/${pg.id}`)}
                        title="View Playground"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-ghost btn-outline-danger"
                        onClick={() => handleDelete(pg.id)}
                        title="Delete Playground"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
};
