// src/front/pages/ResourceStatus.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

/* Solo visual extra (nav, footer y arte de fondo) */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export default function ResourceStatus() {
  const navigate = useNavigate();

  return (
    <div className="status-scope">
      <SoftRibbonNav />

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-grad: linear-gradient(310deg,#7928CA,#FF0080);
        }

        /* ===== Lienzo y arte difuminado ===== */
        .status-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1600px 700px at 6% -20%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 520px at 96% 0%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .status-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.16;
        }
        .status-scope .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

        /* Oculta botones de la demo en esta vista */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn, nav.navbar + .container .btn-group,
        .template-links { display:none !important; }

        /* ===== HERO ===== */
        .hero{ padding:28px 0 10px; }
        .chip{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.35rem .75rem; border-radius:999px; font-weight:800; font-size:.9rem;
          background:#e8f6ff; color:#0ea5c6; border:1px solid #d6efff;
          box-shadow:0 8px 20px rgba(14,165,198,.12);
        }
        .title{
          margin:.5rem 0 .25rem; font-weight:900; letter-spacing:.2px;
          background: var(--su-grad);
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .lead-muted{ color:var(--su-muted); margin:0; }

        /* ===== Tarjetas Soft ===== */
        .card-soft{
          border:1px solid rgba(255,255,255,.6);
          border-radius:20px; background:#fff;
          box-shadow:0 18px 55px rgba(15,23,42,.12);
        }

        /* ===== Estado general ===== */
        .badge-soft{
          background:#f1e4f9; color:#7a35c1;
          border-radius:999px; font-weight:800; padding:.25rem .6rem; font-size:.85rem;
          box-shadow:0 8px 18px rgba(122,53,193,.12);
        }
        .status-row{ gap:12px; }

        /* ===== Métricas ===== */
        .stat-title{ color:#6b7c90; font-size:.9rem; margin:0; }
        .stat-value{ color:#20314d; font-weight:800; font-size:1.6rem; }
        .meter{
          height:6px; border-radius:999px; background:#eef2f8; overflow:hidden; margin-top:8px;
        }
        .meter > span{
          display:block; height:100%;
          background: var(--su-grad);
          box-shadow:0 6px 16px rgba(203,12,159,.25);
          width: var(--w, 60%);
        }

        /* ===== Dots y estados ===== */
        .dot{ width:10px; height:10px; border-radius:999px; display:inline-block; margin-right:.4rem; }
        .up{ background:#16a34a; }
        .warn{ background:#f59e0b; }
        .down{ background:#ef4444; }
        .pulse{ position:relative; }
        .pulse::after{
          content:""; position:absolute; inset:-6px; border-radius:999px; opacity:.25;
          animation:pulse 1.2s infinite ease-out;
        }
        .up.pulse::after{ background:#16a34a; }
        .warn.pulse::after{ background:#f59e0b; }
        .down.pulse::after{ background:#ef4444; }
        @keyframes pulse { 0%{ transform:scale(.6); } 100%{ transform:scale(1.4); opacity:0; } }

        /* ===== Botones ===== */
        .btn{ border-radius:12px; font-weight:800; }
        .btn-brand{
          background-image: var(--su-grad); border:0; color:#fff;
          box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="hero">
          <div className="container-neo">
            <span className="chip">Status</span>
            <h1 className="display-6 title">Estado del servicio</h1>
            <p className="lead-muted">Disponibilidad, latencia y componentes de la plataforma.</p>
          </div>
        </section>

        {/* ESTADO GENERAL */}
        <section className="py-2">
          <div className="container-neo">
            <div className="card-soft p-4 p-md-5 mb-4">
              <div className="d-flex flex-wrap align-items-center status-row">
                <span className="badge-soft">Actualizado hace 2 min</span>
                <div className="ms-auto d-flex align-items-center">
                  <span className="dot up pulse"></span>
                  <strong className="title" style={{ WebkitTextFillColor: "unset", background:"none", color:"#20314d" }}>
                    Todos los sistemas operativos
                  </strong>
                </div>
              </div>
            </div>

            {/* GRID MÉTRICAS */}
            <div className="row g-3 mb-4">
              {[
                { t: "Uptime (30 días)", v: "99.98%", w: "99%" },
                { t: "Latencia media", v: "153 ms", w: "72%" },
                { t: "Peticiones /h", v: "1.2 M", w: "88%" },
                { t: "Errores", v: "0.04%", w: "94%" },
              ].map((m, i) => (
                <div className="col-6 col-lg-3" key={i}>
                  <div className="card-soft p-3">
                    <p className="stat-title">{m.t}</p>
                    <div className="stat-value">{m.v}</div>
                    <div className="meter" style={{ ["--w"]: m.w }}><span /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* COMPONENTES + INCIDENCIAS */}
            <div className="row g-3 mb-4">
              <div className="col-lg-6">
                <div className="card-soft p-3">
                  <h6 className="mb-3" style={{ color:"#20314d", fontWeight:800 }}>Componentes</h6>
                  <ul className="list-unstyled m-0">
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span><span className="dot up"></span>API principal</span>
                      <span className="text-muted">Operativo</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span><span className="dot up"></span>Web App</span>
                      <span className="text-muted">Operativo</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span><span className="dot up"></span>Autenticación</span>
                      <span className="text-muted">Operativo</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span><span className="dot warn pulse"></span>Almacenamiento</span>
                      <span className="text-muted">Rendimiento degradado</span>
                    </li>
                    <li className="d-flex justify-content-between py-2">
                      <span><span className="dot up"></span>Realtime (WS)</span>
                      <span className="text-muted">Operativo</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card-soft p-3 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="m-0" style={{ color:"#20314d", fontWeight:800 }}>Incidencias recientes</h6>
                    <span className="badge-soft">últimos 90 días</span>
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted">07 Ago · 14:10–14:42</div>
                    <div><span className="dot warn"></span><strong> Latencia elevada</strong> en subida de imágenes.</div>
                    <div className="small text-muted">Mitigado ajustando tamaño de parte y reintentos.</div>
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted">26 Jul · 09:02–09:18</div>
                    <div><span className="dot down"></span><strong> Interrupción parcial</strong> de WebSocket en región EU.</div>
                    <div className="small text-muted">Resuelto con failover automático.</div>
                  </div>

                  <div>
                    <div className="small text-muted">03 Jul · 22:33–22:36</div>
                    <div><span className="dot up"></span><strong> Mantenimiento</strong> menor en base de datos.</div>
                    <div className="small text-muted">Sin impacto al usuario.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="d-flex gap-2 mt-4 pb-2">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
              <Link to="/login" className="btn btn-outline-primary">Iniciar sesión</Link>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
