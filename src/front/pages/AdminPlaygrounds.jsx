// src/front/pages/AdminPlaygrounds.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../hooks/AuthContext";

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

  /* ====== ESTILOS SOLO VISUAL ====== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-grad: linear-gradient(310deg, #7928CA, #FF0080);
      }

      .admin-pg-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
      }
      .admin-pg-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .admin-pg-scope .content{ position:relative; z-index:1; }

      /* Oculta solo botones del template demo (no nuestro ribbon) */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      .container-neo{ max-width: 1100px; margin: 0 auto; padding: 0 16px; }

      /* HERO */
      .pg-hero{ padding:28px 0 16px; }
      .pg-title{ font-weight:900; color:#20314d; margin:0; }
      .pg-sub{ color:var(--su-muted); margin:0; }

      /* Listado Soft-UI */
      .list-soft .list-group-item{
        border:1px solid #eef2f7 !important;
        margin-bottom:10px; border-radius:14px;
        box-shadow:0 10px 26px rgba(15,23,42,.06);
        background:#fff;
      }

      .btn-ghost{
        border:1px solid #e9edf4; background:#fff; color:#20314d;
        padding:.45rem .65rem; border-radius:10px; font-weight:700;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
        transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
      }
      .btn-ghost:hover{ transform:translateY(-1px); }
      .btn-outline-danger{
        border-color:#ffd2d2 !important; color:#b4232a !important; background:#fff !important;
      }

      /* Alert */
      .alert-soft{
        border-radius:14px; border:1px solid #e9edf4;
        background:#f7fbff; color:#0f5676; font-weight:600;
        box-shadow:0 10px 26px rgba(15,23,42,.05);
      }

      /* Empty / Loading */
      .card-soft{
        background:#fff; border:1px solid #edf1f6; border-radius:18px;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
        padding:16px;
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
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{pg.name}</strong> — {pg.slug} — Creator: {pg.created_by || "Unknown"}
                    </div>
                    <button
                      className="btn btn-sm btn-ghost btn-outline-danger"
                      onClick={() => handleDelete(pg.id)}
                      title="Delete Playground"
                    >
                      <FaTrash />
                    </button>
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
