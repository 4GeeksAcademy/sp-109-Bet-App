// src/front/pages/PlaygroundSearch.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

// 🔽 Solo visual
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const PlaygroundSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  
  const { token } = useAuth()
  const navigate = useNavigate();

  // ✅ Comprobar usuario logueado
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

  // 🔎 Buscar playgrounds
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

  // ✅ Nuevo: usar endpoint de access-request
  const handleRequestAccess = async (playgroundId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${playgroundId}/access-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();
      alert(data.msg || "Acceso solicitado");
    } catch (err) {
      console.error("Error solicitando acceso:", err);
      alert("Error al solicitar acceso");
    }
  };

  // ====== SOLO VISUAL ======
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
      }

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
      .pgsearch-scope .container{ max-width:1000px; }

      /* Ocultar botones del template superior */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      /* Hero */
      .pg-hero{
        margin-top:1.25rem; margin-bottom:1rem; text-align:center;
      }
      .pg-hero h2{
        font-weight:800; letter-spacing:.2px;
        background: var(--su-gradient);
        -webkit-background-clip:text; background-clip:text; color:transparent;
        margin:0;
      }
      .pg-hero .subtitle{ color:var(--su-muted); }

      /* Tarjetas / lista */
      .pg-card{
        border-radius:18px; border:1px solid #edf1f6; background:#fff;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
      }
      .pg-list .list-group-item{
        border:1px solid #ecf2fa !important; border-radius:12px !important; margin-bottom:10px;
        display:flex; justify-content:space-between; align-items:center;
        padding:12px 14px;
      }

      /* Inputs & botones */
      .pgsearch-scope .form-control{
        height:48px; border-radius:12px; border:1px solid #e8eef8;
        box-shadow:0 6px 16px rgba(15,23,42,.06);
        transition:border-color .15s ease, box-shadow .15s ease, transform .05s ease;
      }
      .pgsearch-scope .form-control:focus{
        box-shadow:0 0 0 .22rem rgba(23,193,232,.20), 0 6px 16px rgba(15,23,42,.10);
        border-color:#bcd3ff; outline:none; transform:translateY(-1px);
      }
      .pgsearch-scope .btn{
        border-radius:12px !important; font-weight:700;
        transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
      }
      .pgsearch-scope .btn-outline-primary{
        background:#fff !important; color:#20314d !important;
        border:1px solid #d7e3ff !important; box-shadow:0 8px 22px rgba(15,23,42,.06);
      }
      .pgsearch-scope .btn-outline-primary:hover{
        background:#f2f8ff !important; border-color:#bcd3ff !important; transform:translateY(-1px);
      }
    `}</style>
  );

  return (
    <div className="pgsearch-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        <div className="container py-4">
          {/* Hero */}
          <div className="pg-hero">
            <h2>🔍 Buscar Playground</h2>
            <div className="subtitle">Escribe al menos 4 letras para ver resultados</div>
          </div>

          {/* Tarjeta principal */}
          <div className="pg-card p-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Escribe al menos 4 letras..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <div className="pg-list">
              <ul className="list-group">
                {results.map((pg) => (
                  <li
                    key={pg.id}
                    className="list-group-item"
                  >
                    <span>
                      <strong>{pg.name}</strong>{" "}
                      <small className="text-muted">({pg.slug})</small>
                    </span>
                    <button
                      className="btn btn-outline-primary btn-sm"
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
