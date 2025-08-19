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

  /* ====== ESTILOS SOLO VISUAL (color de siempre + “hasta arriba”) ====== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
      }

      /* ============ Quitar franja superior del layout global ============ */
      @supports selector(body:has(.admin-pg-scope)) {
        body:has(.admin-pg-scope) .content-wrapper,
        body:has(.admin-pg-scope) .flex-grow-1.main-content.d-flex.flex-column{
          padding-top:0 !important;
          background:transparent !important;
        }
        body:has(.admin-pg-scope) .navbar{
          display:none !important;
        }
      }
      /* Fallback si :has() no existe */
      .admin-pg-scope{ margin-top:-72px; }
      @media (min-width:992px){ .admin-pg-scope{ margin-top:-84px; } }
      .admin-pg-scope nav.soft-ribbon{ margin-top:80px; }
      /* =================================================================== */

      .admin-pg-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          linear-gradient(#fff,#fff);
      }
      .admin-pg-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .admin-pg-scope .content{ position:relative; z-index:1; }

      /* Oculta SOLO los botones del template demo (no nuestro ribbon) */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      .container-neo{ max-width: 1100px; margin: 0 auto; padding: 0 16px; }

      /* HERO */
      .pg-hero{ padding:28px 0 16px; }
      .pg-title{
        font-weight:900; color:#20314d; margin:0; letter-spacing:.2px;
      }
      .pg-sub{ color:var(--su-muted); margin:0; }

      /* Alert suave */
      .alert-soft{
        border-radius:14px; border:1px solid #e9edf4;
        background:#f7fbff; color:#0f5676; font-weight:600;
        box-shadow:0 10px 26px rgba(15,23,42,.05);
      }

      /* Lista Soft-UI */
      .list-soft .list-group-item{
        border:1px solid #eef2f7 !important; margin-bottom:10px;
        border-radius:14px !important; box-shadow:0 10px 26px rgba(15,23,42,.06);
        background:#fff;
      }

      /* Info de cada PG */
      .pg-info .pg-name{ color:#20314d; font-weight:800; }
      .pg-info p{ margin:0 0 .25rem; color:#445066; }
      .pg-info p span{ color:#6b7c90; }

      /* Botones suaves */
      .btn-ghost{
        border:1px solid #e9edf4; background:#fff; color:#20314d;
        padding:.45rem .65rem; border-radius:10px; font-weight:700;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
        transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
      }
      .btn-ghost:hover{ transform:translateY(-1px); }
      .btn-outline-primary{ border-color:#d7e3ff; }
      .btn-outline-danger{ border-color:#ffd2d2; color:#b4232a; }

      /* Responsive ribbon/containers */
      @media (max-width: 1200px){
        .soft-ribbon-wrapper{ padding: 0 10px; }
        .soft-ribbon{
          max-width:none !important; width:100% !important;
          border-radius:18px !important; padding:8px 10px !important;
        }
        .container-neo{ padding: 0 12px; }
        .pg-hero{ padding:18px 0 12px; }
      }
      @media (max-width: 576px){
        .container-neo{ padding: 0 10px; }
      }
    `}</style>
  );

  return (
    <div className="admin-pg-scope">
      <Styles />
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
                    <div className="pg-actions d-flex gap-2">
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
