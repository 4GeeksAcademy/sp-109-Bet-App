// src/front/pages/AdminBets.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../hooks/AuthContext";

/* 🔽 Solo visual */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const AdminBets = () => {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState(null);
  const [loadingBets, setLoadingBets] = useState(true);

  const navigate = useNavigate();
  const { token, role, logout, loading } = useAuth(); // loading = AuthContext loading

  const handleUnauthorized = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    // Esperar a que AuthContext termine de cargar
    if (loading) return;

    // Si no hay token o el rol no es admin, redirigir
    if (!token || role !== "admin") {
      navigate("/admin/login", { state: { fromProtected: true } });
      return;
    }

    // Si es admin, cargar bets
    const getBets = async () => {
      setLoadingBets(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin_bets/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) return handleUnauthorized();
        if (!res.ok) throw new Error("Failed to load bets");
        const data = await res.json();
        setBets(data.bets);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingBets(false);
      }
    };

    getBets();
  }, [token, role, loading, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bet?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin_bets/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error("Failed to delete the bet");

      setBets((prev) => prev.filter((bet) => bet.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
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

      .admin-bets-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
      }
      .admin-bets-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .admin-bets-scope .content{ position:relative; z-index:1; }

      /* Oculta solo los botones del template demo (no nuestro ribbon) */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      .container-neo{ max-width: 1100px; margin: 0 auto; padding: 0 16px; }

      /* HERO */
      .bets-hero{ padding:28px 0 16px; }
      .bets-title{ font-weight:900; color:#20314d; margin:0; }
      .bets-sub{ color:var(--su-muted); margin:0; }

      /* Alert suave */
      .alert-soft{
        border-radius:14px; border:1px solid #e9edf4;
        background:#f7fbff; color:#0f5676; font-weight:600;
        box-shadow:0 10px 26px rgba(15,23,42,.05);
      }

      /* Lista Soft-UI */
      .list-soft .list-group-item{
        border:1px solid #eef2f7 !important; margin-bottom:10px;
        border-radius:14px; box-shadow:0 10px 26px rgba(15,23,42,.06);
        background:#fff;
      }

      /* Botones suaves (overrides locales sin tocar la lógica) */
      .admin-bets-scope .btn-warning{
        background: linear-gradient(180deg, #fffaf0, #fff1c7) !important;
        color:#7a5a00 !important; border:1px solid #ffe49a !important;
        border-radius:10px; font-weight:800;
        box-shadow:0 8px 22px rgba(250,204,21,.16);
      }
      .admin-bets-scope .btn-warning:hover{ transform:translateY(-1px); }

      .admin-bets-scope .btn-danger{
        background: linear-gradient(180deg, #fff5f5, #ffe9e9) !important;
        color:#b4232a !important; border:1px solid #ffd2d2 !important;
        border-radius:10px; font-weight:800;
        box-shadow:0 8px 22px rgba(244,63,94,.16);
      }
      .admin-bets-scope .btn-danger:hover{ transform:translateY(-1px); }
    `}</style>
  );

  return (
    <div className="admin-bets-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="bets-hero">
          <div className="container-neo">
            <h2 className="bets-title">All Bets (Admin View)</h2>
            <p className="bets-sub">Gestiona y edita las apuestas creadas por los usuarios.</p>
          </div>
        </section>

        {/* CONTENIDO */}
        <section className="pb-4">
          <div className="container-neo">
            {loadingBets && <div className="alert-soft py-2 px-3 mb-3">Loading...</div>}
            {error && <div className="alert-soft py-2 px-3 mb-3 text-danger">{error}</div>}

            {!loadingBets && !error && bets.length === 0 && (
              <div className="alert-soft py-2 px-3">No bets found.</div>
            )}

            {!loadingBets && !error && bets.length > 0 && (
              <ul className="list-group list-soft">
                {bets.map((bet) => (
                  <li
                    key={bet.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <strong>{bet.name}</strong> — {bet.status} — {bet.amount} €
                    </span>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/admin/bets/edit/${bet.id}`)}
                        title="Edit bet"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(bet.id)}
                        title="Delete bet"
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
