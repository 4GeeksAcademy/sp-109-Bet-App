import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import { useAuth } from "../hooks/AuthContext";

/* ===== Miniatura con fallback SVG embebido (sin red) y sin parpadeo ===== */
function PgThumb({ src, name, alt }) {
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => {
    if (!name) return "PG";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second || first || "PG").toUpperCase();
  }, [name]);

  const placeholder = useMemo(() => {
    const bg = "#eef2f7";
    const fg = "#445066";
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'>
        <rect width='100%' height='100%' rx='12' ry='12' fill='${bg}'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
              font-family='Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif'
              font-size='22' font-weight='700' fill='${fg}'>${initials}</text>
      </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [initials]);

  const finalSrc = imgError || !src || src.trim() === "" ? placeholder : src;

  return (
    <img
      src={finalSrc}
      alt={alt || "Playground"}
      width={72}
      height={72}
      style={{
        width: 72,
        height: 72,
        objectFit: "cover",
        borderRadius: 12,
        boxShadow: "0 10px 26px rgba(15,23,42,.15)",
        background: "#f8f9fb"
      }}
      onError={() => setImgError(true)}
    />
  );
}

export const Playgrounds = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [user, setUser] = useState(undefined);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useAuth()
  /* ====== Estilos Soft-UI locales ====== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
      }
      .pg-scope{
        background:
          radial-gradient(1400px 600px at 5% -10%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 95% -10%, #e6f9ff 0%, transparent 55%),
          linear-gradient(#fff,#fff);
      }
      .container-neo{ max-width: 1180px; margin: 0 auto; padding: 0 16px; }

      /* Hero */
      .pg-hero{ padding: 28px 0 18px; }
      .pg-title{ color:#20314d; font-weight:900; letter-spacing:.2px; }
      .pg-sub{ color: var(--su-muted); }
      .btn-brand{
        background-image: var(--su-gradient); border:0; color:#fff;
        font-weight:800; border-radius:12px; padding:.8rem 1.1rem;
        box-shadow:0 10px 26px rgba(203,12,159,.35);
      }
      .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }

      /* Chips superiores */
      .hero-chips{ display:flex; gap:10px; flex-wrap:wrap; }
      .chip{
        display:inline-flex; align-items:center; gap:.5rem;
        border:1px solid #e9edf4; background:#fff; color:#20314d;
        padding:.45rem .75rem; border-radius:999px; font-weight:600;
        box-shadow:0 8px 20px rgba(15,23,42,.06);
      }
      .chip img{ width:26px; height:26px; border-radius:50%; object-fit:cover; }

      /* Cards grid */
      .pg-grid{
        display:grid; gap:16px;
        grid-template-columns: repeat(1, 1fr);
      }
      @media (min-width: 700px){ .pg-grid{ grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1024px){ .pg-grid{ grid-template-columns: repeat(2, 1fr); } }

      .pg-card{
        background:#fff; border:1px solid #edf1f6; border-radius:18px;
        padding:14px; display:flex; gap:14px; align-items:center;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
      }
      .pg-card .meta h5{ margin:0; color:#20314d; font-weight:800; }
      .pg-card .meta small{ color:#6b7c90; }
      .pg-badges{ display:flex; gap:8px; flex-wrap:wrap; margin-top:6px; }
      .pg-badge{
        display:inline-flex; align-items:center; gap:.35rem;
        padding:.25rem .55rem; border-radius:999px; font-size:.8rem; font-weight:800;
        border:1px solid #e9edf4; color:#7b2fc9; background:#f4e9ff;
      }
      .actions{ margin-left:auto; display:flex; gap:8px; align-items:center; }
      .btn-ghost{
        border:1px solid #e9edf4; background:#fff; color:#20314d;
        padding:.5rem .7rem; border-radius:10px; font-weight:700;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
      }
      .btn-ghost:hover{ transform:translateY(-1px); }
      .btn-outline-danger{ border-color:#ffd2d2; color:#b4232a; }

      /* Alerts */
      .alert-soft{
        border-radius:14px; border:1px solid #e9edf4;
        background:#f7fbff; color:#0f5676; font-weight:600;
        box-shadow:0 10px 26px rgba(15,23,42,.05);
      }

      /* Empty state */
      .empty{
        border:2px dashed #e9edf4; border-radius:18px; padding:28px; text-align:center;
        color:#6b7c90; background:#fff; box-shadow:0 10px 26px rgba(15,23,42,.05);
      }

      .navbar .btn,
        .navbar .btn-group,
        nav.navbar + .container .btn,
        nav.navbar + .container .btn-group,
        .template-links {
          display: none !important;
        }

    `}</style>
  );

  // Comprobar usuario logueado
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          setUser(null);
          return;
        }
        const data = await resp.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Mensaje de éxito tras crear/editar
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Cargar playgrounds
  useEffect(() => {
    if (!token) return;

    const getPlaygrounds = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error("Failed to fetch playgrounds");
        const data = await resp.json();
        setPlaygrounds(data.playgrounds);
      } catch {
        setError("Error fetching playgrounds");
      }
    };

    if (user) getPlaygrounds();
  }, [user]);

  if (user === undefined) {
    return (
      <div className="container mt-5">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!token || user === null) {
    return (
      <div className="container mt-5">
        <p>Por favor, inicie sesión para ver los playgrounds.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este playground?")) return;

    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Error al eliminar playground");

      setPlaygrounds((prev) => prev.filter((pg) => pg.id !== id));
    } catch {
      setError("Error al eliminar playground");
    }
  };

  return (
    <div className="pg-scope">
      <Styles />
      <SoftRibbonNav />

      {/* HERO */}
      <section className="pg-hero">
        <div className="container-neo">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div>
              <h2 className="pg-title mb-1">Tus Playgrounds</h2>
              <p className="pg-sub mb-0">
                Crea salas privadas, invita a tu gente y monta apuestas clásicas o “chorras”. Tú pones las reglas.
              </p>
            </div>

            {user && (
              <button className="btn btn-brand" onClick={() => navigate("/playground/create")}>
                Nuevo playground
              </button>
            )}
          </div>

          {/* Chips de usuario / moneda si existen datos */}
          <div className="hero-chips mt-3">
            {user?.url_image && (
              <span className="chip">
                <img src={user.url_image} alt="avatar" />
                {user?.username || "usuario"}
              </span>
            )}
            {typeof user?.money !== "undefined" && (
              <span className="chip">🪙 {user.money}</span>
            )}
          </div>
        </div>
      </section>

      {/* ALERTAS */}
      <div className="container-neo">
        {successMessage && (
          <div className="alert alert-soft py-2 px-3 mb-3" role="alert">
            {successMessage}
          </div>
        )}
        {error && <p className="text-danger">{error}</p>}
      </div>

      {/* LISTA / GRID */}
      <section className="pb-4">
        <div className="container-neo">
          {playgrounds.length === 0 ? (
            <div className="empty">
              Aún no tienes playgrounds. Crea el primero con el botón <strong>“Nuevo playground”</strong>.
            </div>
          ) : (
            <div className="pg-grid">
              {playgrounds.map((pg) => {
                const canEnter = (user?.username === pg.creator_name) || pg.is_invited;
                const canEdit = user?.username === pg.creator_name;

                return (
                  <div key={pg.id} className="pg-card">
                    {/* Thumb */}
                    <PgThumb src={pg.url_image} name={pg.name} alt={pg.name} />

                    {/* Meta */}
                    <div className="meta">
                      <h5 className="mb-1">{pg.name}</h5>
                      <small className="text-muted">
                        ({pg.slug}) · Creador: {pg.creator_name || "desconocido"}
                      </small>

                      <div className="pg-badges">
                        {pg.is_invited && <span className="pg-badge">Invitado</span>}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="actions">
                      {canEnter && (
                        <button
                          className="btn-ghost"
                          onClick={() => navigate(`/playground/${pg.id}`)}
                          title="Entrar"
                        >
                          Entrar
                        </button>
                      )}

                      {canEdit && (
                        <>
                          <button
                            onClick={() => navigate(`/playground/edit/${pg.id}`)}
                            className="btn-ghost"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(pg.id)}
                            className="btn-ghost btn-outline-danger"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Playgrounds;
