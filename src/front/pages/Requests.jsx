// src/front/pages/Requests.jsx
import React, { useEffect, useState } from "react";

import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const Requests = () => {
  const [user, setUser] = useState(undefined);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          setUser(null);
          return;
        }
        const data = await resp.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error al obtener usuario", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReceived(data.received || []);
        setSent(data.sent || []);
      } catch (err) {
        console.error("Error fetching requests", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRequests();
  }, [user]);

  const handleAction = async (reqId, action) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/requests/${reqId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setReceived((prev) => prev.filter((r) => r.id !== reqId));
      }
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  /* ====================== SOLO VISUAL ====================== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
      }

      .requests-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
      }
      .requests-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .requests-scope .content{ position:relative; z-index:1; }
      .requests-scope .container{ max-width:1100px; }

      /* Ocultar botones/links del template superior */
      .navbar .btn, .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      /* ===== HERO mejorado ===== */
      .rq-hero{ text-align:center; margin:1.25rem 0 1.1rem; }
      .rq-hero h2{
        margin:0; font-weight:900; letter-spacing:.2px; position:relative; display:inline-block;
        background: var(--su-gradient);
        -webkit-background-clip:text; background-clip:text; color:transparent;
      }
      .rq-hero h2::after{
        content:""; position:absolute; inset:-8px -18px; z-index:-1;
        background: radial-gradient(70% 130% at 50% 0%, rgba(203,12,159,.12), rgba(23,193,232,.10));
        filter: blur(8px); border-radius:999px;
      }
      .rq-hero .subtitle{ color:var(--su-muted); margin-top:.15rem; }

      /* ===== Tarjetas ===== */
      .rq-card{
        position:relative;
        border-radius:20px; border:1px solid #edf1f6; background:#fff;
        box-shadow:0 18px 60px rgba(15,23,42,.14);
        overflow:hidden;
      }
      /* Barra superior de color (decorativa) */
      .rq-card::before{
        content:""; position:absolute; left:16px; right:16px; top:0; height:6px;
        background:var(--su-gradient); border-radius:0 0 10px 10px; opacity:.25;
      }
      .rq-card h3{
        font-size:1.1rem; font-weight:900; color:#20314d; margin-top:2px;
        display:flex; align-items:center; gap:.5rem;
      }
      .rq-card h3::before{
        content:""; width:26px; height:26px; border-radius:8px;
        background:#f1ecff; box-shadow:0 6px 16px rgba(124,58,237,.18);
        display:inline-block;
      }

      /* ===== Lista ===== */
      .rq-list .list-group-item{
        border:1px solid transparent !important; border-radius:14px !important;
        margin-bottom:10px; padding:12px 14px;
        display:flex; justify-content:space-between; align-items:center;
        background:
          linear-gradient(#fff,#fff) padding-box,
          linear-gradient(90deg, #e9d7ff, #ffe0f2) border-box;
        box-shadow:0 10px 26px rgba(15,23,42,.06);
        transition:transform .12s ease, box-shadow .12s ease;
      }
      .rq-list .list-group-item:hover{
        transform:translateY(-2px);
        box-shadow:0 16px 38px rgba(15,23,42,.12);
      }
      /* tarjeta vacía */
      .rq-empty{
        color:var(--su-muted); margin:.25rem 0 .5rem; position:relative; padding-left:26px;
      }
      .rq-empty::before{
        content:"ℹ️"; position:absolute; left:0; top:0; line-height:1;
        filter:saturate(1.2);
      }
      /* chip de estado dentro de <em> */
      .rq-list em{
        background:#f6f3ff; color:#6c4bd5; border:1px solid #e8e1ff;
        padding:.15rem .45rem; border-radius:999px; font-style:normal; font-weight:800;
      }

      /* ===== Botones ===== */
      .requests-scope .btn{ border-radius:12px !important; font-weight:800; }
      .requests-scope .btn-success{
        background: linear-gradient(180deg, #eafff2, #d8ffe6) !important;
        color:#137a47 !important; border:1px solid #bff5d0 !important;
        box-shadow:0 10px 26px rgba(34,197,94,.18);
      }
      .requests-scope .btn-danger{
        background: linear-gradient(180deg, #fff5f5, #ffe9e9) !important;
        color:#b4232a !important; border:1px solid #ffd2d2 !important;
        box-shadow:0 10px 26px rgba(244,63,94,.16);
      }
      .requests-scope .btn:hover{ transform:translateY(-1px); }

      /* Responsive pequeños ajustes */
      @media (max-width: 575.98px){
        .rq-list .list-group-item{ padding:12px; }
        .rq-card::before{ left:12px; right:12px; }
      }
    `}</style>
  );

  if (user === undefined || loading)
    return (
      <div className="requests-scope">
        <Styles />
        <SoftRibbonNav />
        <div className="bg-art" aria-hidden="true"></div>
        <div className="content container py-5">Cargando...</div>
        <SiteFooter />
      </div>
    );

  if (user === null)
    return (
      <div className="requests-scope">
        <Styles />
        <SoftRibbonNav />
        <div className="bg-art" aria-hidden="true"></div>
        <div className="content container py-5">Inicia sesión para ver tus solicitudes.</div>
        <SiteFooter />
      </div>
    );

  return (
    <div className="requests-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        <div className="container py-4">
          {/* Hero */}
          <div className="rq-hero">
            <h2>Requests</h2>
            <div className="subtitle">Gestiona invitaciones y solicitudes de acceso</div>
          </div>

          <div className="row g-4">
            {/* Recibidas */}
            <div className="col-12 col-md-6">
              <div className="rq-card p-4 h-100">
                <h3 className="mb-3">📥 Solicitudes Recibidas</h3>
                {received.length === 0 ? (
                  <p className="rq-empty">No tenés solicitudes pendientes.</p>
                ) : (
                  <ul className="list-group rq-list">
                    {received.map((req) => (
                      <li key={req.id} className="list-group-item">
                        <span>
                          {req.status === "invited" ? (
                            <>Te invitaron a <strong>{req.playground_name}</strong></>
                          ) : (
                            <>
                              <strong>{req.user_name}</strong> quiere unirse a{" "}
                              <strong>{req.playground_name}</strong>
                            </>
                          )}
                        </span>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleAction(req.id, "accept")}
                          >
                            Aceptar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleAction(req.id, "reject")}
                          >
                            Rechazar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Enviadas */}
            <div className="col-12 col-md-6">
              <div className="rq-card p-4 h-100">
                <h3 className="mb-3">📤 Solicitudes Enviadas</h3>
                {sent.length === 0 ? (
                  <p className="rq-empty">No has enviado ninguna solicitud.</p>
                ) : (
                  <ul className="list-group rq-list">
                    {sent.map((req) => (
                      <li key={req.id} className="list-group-item">
                        <span>
                          Solicitaste acceso a <strong>{req.playground_name}</strong> –{" "}
                          <em>{req.status}</em>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};
