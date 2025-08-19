// src/front/pages/PlaygroundSearch.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const PlaygroundSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      if (!token) return;
      try {
        const endpoint =
          searchText.length >= 4
            ? `/api/playgrounds/search?q=${searchText}`
            : `/api/playgrounds/search`;

        const res = await fetch(import.meta.env.VITE_BACKEND_URL + endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error buscando playgrounds:", err);
      }
    };

    fetchResults();
  }, [searchText]);

  // Request access
  const handleRequestAccess = async (playgroundId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${playgroundId}/access-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      alert(data.msg || "Acceso solicitado");
    } catch (err) {
      console.error("Error solicitando acceso:", err);
      alert("Error al solicitar acceso");
    }
  };

  // ====== Solo visual ======
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
      }

      /* ============ ARREGLA FRANJA SUPERIOR (igual que Playgrounds/Requests) ============ */
      @supports selector(body:has(.pgsearch-scope)) {
        body:has(.pgsearch-scope) .content-wrapper,
        body:has(.pgsearch-scope) .flex-grow-1.main-content.d-flex.flex-column{
          padding-top:0 !important;          /* quita empuje del Layout */
          background:transparent !important; /* por si el wrapper pinta fondo */
        }
        body:has(.pgsearch-scope) .navbar{
          display:none !important;           /* oculta navbar global solo aquí */
        }
      }
      /* Fallback si :has() no existe en el navegador */
      .pgsearch-scope{ margin-top:-72px; }
      @media (min-width:992px){ .pgsearch-scope{ margin-top:-84px; } }
      /* aire para la ribbon propia */
      .pgsearch-scope nav.soft-ribbon{ margin-top:80px; }
      /* ================================================================================ */

      .pgsearch-scope{
        position:relative;
        min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          linear-gradient(#fff,#fff);
      }
      .pgsearch-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .pgsearch-scope .content{ position:relative; z-index:1; }
      .pgsearch-scope .container{ max-width:960px; }

      /* Ocultar botones del template superior (no nuestro nav) */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      /* HERO */
      .pg-hero{ text-align:center; margin: 18px 0 10px; }
      .pg-hero h2{
        font-weight:900; letter-spacing:.2px; margin:0;
        background: var(--su-gradient);
        -webkit-background-clip:text; background-clip:text; color:transparent;
      }
      .pg-hero .subtitle{ color:var(--su-muted); }

      /* Shell con glow */
      .search-shell{
        border-radius:22px; background:#fff;
        border:1px solid #edf1f6;
        box-shadow:
          0 22px 70px rgba(15,23,42,.12),
          0 0 0 10px rgba(203,12,159,.04) inset;
        padding:18px;
      }

      /* Barra de búsqueda con icono */
      .searchbar{ position:relative; margin-bottom:12px; }
      .searchbar .ico{
        position:absolute; left:16px; top:50%; transform:translateY(-50%);
        font-size:18px; color:#7b2fc9; opacity:.85;
      }
      .searchbar .form-control{
        height:54px; border-radius:14px; padding-left:44px;
        border:1px solid #e8eef8; background:#fff;
        box-shadow:0 8px 20px rgba(15,23,42,.06);
        transition:border-color .15s ease, box-shadow .15s ease, transform .05s ease;
      }
      .searchbar .form-control:focus{
        border-color:#bcd3ff;
        box-shadow:0 0 0 .22rem rgba(23,193,232,.20), 0 8px 20px rgba(15,23,42,.10);
        transform:translateY(-1px);
      }

      /* Lista de resultados */
      .pg-list .list-group-item{
        border:1px solid #ecf2fa !important; border-radius:14px !important; margin-bottom:10px;
        display:flex; justify-content:space-between; align-items:center;
        padding:12px 14px; background:#fff;
        box-shadow:0 10px 26px rgba(15,23,42,.06);
        transition:transform .12s ease, box-shadow .12s ease, border-color .12s ease;
      }
      .pg-list .list-group-item:hover{
        transform:translateY(-2px);
        border-color:#dfe9fb !important;
        box-shadow:0 16px 36px rgba(15,23,42,.10);
      }

      .pg-item-title{ margin:0; color:#20314d; font-weight:800; }
      .slug-pill{
        display:inline-block; margin-left:8px; font-size:.8rem; font-weight:800;
        padding:.2rem .55rem; border-radius:999px;
        background:#f1ecff; color:#6c4bd5; border:1px solid #e6e0ff;
      }

      /* Botón acción */
      .btn-ghost{
        border:1px solid #d7e3ff !important; background:#fff !important; color:#20314d !important;
        border-radius:12px !important; font-weight:800 !important; padding:.45rem .8rem !important;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
        transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
      }
      .btn-ghost:hover{ background:#f2f8ff !important; transform:translateY(-1px); }
    `}</style>
  );

  return (
    <div className="pgsearch-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        <div className="container py-4">
          {/* Título */}
          <div className="pg-hero">
            <h2>🔎 Search Playground</h2>
            <div className="subtitle">Escribe al menos 4 letras para ver resultados</div>
          </div>

          {/* Shell buscador */}
          <div className="search-shell">
            {/* Input con icono */}
            <div className="searchbar">
              <span className="ico">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Busca por nombre o slug…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Resultados */}
            <div className="pg-list">
              <ul className="list-group">
                {results.map((pg) => (
                  <li key={pg.id} className="list-group-item">
                    <div>
                      <div className="pg-item-title">
                        {pg.name}
                        <span className="slug-pill">{pg.slug}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleRequestAccess(pg.id)}
                    >
                      Solicitar acceso
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};
