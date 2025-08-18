
import React from "react";
import { Link, useNavigate } from "react-router-dom";


import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export default function ResourceRoadmap() {
  const navigate = useNavigate();

  return (
    <div className="roadmap-scope">
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
        .roadmap-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1600px 700px at 6% -20%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 520px at 96% 0%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .roadmap-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.16;
        }
        .roadmap-scope .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

        /* Oculta botones de la demo en esta vista */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn, nav.navbar + .container .btn-group,
        .template-links { display:none !important; }

        /* ===== HERO ===== */
        .hero{ padding:28px 0 16px; }
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
        .legend{ display:flex; flex-wrap:wrap; gap:.5rem 8px; margin-top:10px; }
        .legend .pill{
          display:inline-block; padding:.25rem .6rem; border-radius:999px; font-size:.8rem; font-weight:800;
          border:1px solid #ecf1f8;
        }
        .pill.feature{ background:#e9faf0; color:#1f9254; border-color:#c7ead6; }
        .pill.improve{ background:#fff7e6; color:#a76a00; border-color:#ffe1ae; }
        .pill.quality{ background:#e7f0ff; color:#2b62b4; border-color:#cfe0ff; }
        .pill.research{ background:#f7e8ff; color:#7a35c1; border-color:#ead1ff; }

        /* ===== TABLERO ===== */
        .board{
          display:grid; gap:1.25rem;
          grid-template-columns: repeat(3, minmax(0,1fr));
        }
        @media (max-width: 992px){
          .board{ grid-template-columns: 1fr; }
        }

        .column{
          border:0; border-radius:20px; background:#fff;
          box-shadow:0 18px 55px rgba(15,23,42,.12);
          display:flex; flex-direction:column;
        }
        .column .head{
          position:sticky; top:0; z-index:1;
          padding:1rem 1.25rem;
          background:#fff; border-bottom:1px solid #eef2f7; border-top-left-radius:20px; border-top-right-radius:20px;
          display:flex; align-items:center; justify-content:space-between;
          box-shadow:0 6px 16px rgba(15,23,42,.04);
        }
        .column h5{ margin:0; color:#20314d; font-weight:800; letter-spacing:.2px; }
        .badge-count{
          background:#f1e4f9; color:#7a35c1;
          border-radius:999px; font-weight:800; padding:.25rem .6rem; font-size:.85rem;
          box-shadow:0 8px 20px rgba(122,53,193,.15);
        }

        .items{ padding:1rem; display:grid; gap:.9rem; }
        .card-item{
          position:relative;
          border:1px solid #eef2f7; border-radius:16px; background:#fff;
          padding:.9rem 1rem; transition:transform .12s ease, box-shadow .12s ease, border-color .12s ease;
          box-shadow:0 8px 22px rgba(15,23,42,.06);
        }
        .card-item::before{
          content:""; position:absolute; left:0; top:0; bottom:0; width:4px; border-radius:16px 0 0 16px;
          background: linear-gradient(310deg,#7928CA,#FF0080); opacity:.55;
        }
        .card-item:hover{
          transform: translateY(-2px);
          box-shadow:0 16px 40px rgba(15,23,42,.12);
          border-color:#e3e8f3;
        }

        .label{
          display:inline-block; padding:.2rem .55rem; border-radius:999px;
          font-size:.75rem; font-weight:800; margin-right:.4rem; border:1px solid #ecf1f8;
        }
        .label.feature{ background:#e9faf0; color:#1f9254; border-color:#c7ead6; }
        .label.improve{ background:#fff7e6; color:#a76a00; border-color:#ffe1ae; }
        .label.quality{ background:#e7f0ff; color:#2b62b4; border-color:#cfe0ff; }
        .label.research{ background:#f7e8ff; color:#7a35c1; border-color:#ead1ff; }

        .item-title{ color:#20314d; font-weight:700; }
        .item-desc{ color:var(--su-muted); margin:.25rem 0 .4rem; }
        .item-meta{ color:#8aa0b6; font-size:.9rem; }

        /* ===== Botones inferiores ===== */
        .btn{ border-radius:12px; font-weight:800; }
        .btn-brand{
          background-image: var(--su-grad); border:0; color:#fff;
          box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        
        <section className="hero">
          <div className="container-neo">
            <span className="chip">Roadmap</span>
            <h1 className="display-6 title">Hoja de ruta</h1>
            <p className="lead-muted">
              Una vista clara de lo que estamos construyendo: ahora, lo próximo y lo que vendrá después.
            </p>

           
            <div className="legend">
              <span className="pill feature">Feature</span>
              <span className="pill improve">Mejora</span>
              <span className="pill quality">Calidad</span>
              <span className="pill research">Research</span>
            </div>
          </div>
        </section>

        
        <section className="py-3">
          <div className="container-neo">
            <div className="board">
              
              <div className="column">
                <div className="head">
                  <h5>Ahora</h5>
                  <span className="badge-count">3</span>
                </div>
                <div className="items">
                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label feature">Feature</span>
                      <span className="item-title"> Tablero de apuestas en tiempo real</span>
                    </div>
                    <p className="item-desc">
                      Actualización en vivo de opciones, chat y estado. Latencia optimizada.
                    </p>
                    <div className="item-meta">En curso · Est. 2 semanas</div>
                  </div>

                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label improve">Mejora</span>
                      <span className="item-title"> Mejoras de accesibilidad</span>
                    </div>
                    <p className="item-desc">
                      Contraste, roles ARIA y navegación con teclado en todo el flujo.
                    </p>
                    <div className="item-meta">En curso · Est. 1 semana</div>
                  </div>

                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label quality">Calidad</span>
                      <span className="item-title"> Refactor de subida de imágenes</span>
                    </div>
                    <p className="item-desc">
                      Menos fallos en móvil y subida concurrente más estable.
                    </p>
                    <div className="item-meta">QA · Est. 3 días</div>
                  </div>
                </div>
              </div>

              
              <div className="column">
                <div className="head">
                  <h5>Próximo</h5>
                  <span className="badge-count">3</span>
                </div>
                <div className="items">
                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label feature">Feature</span>
                      <span className="item-title"> Invitaciones por enlace mágico</span>
                    </div>
                    <p className="item-desc">
                      Link único para unirse a un playground sin pasos extras.
                    </p>
                    <div className="item-meta">Pendiente · Est. 1 semana</div>
                  </div>

                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label improve">Mejora</span>
                      <span className="item-title"> Reportes de actividad</span>
                    </div>
                    <p className="item-desc">Resumen semanales para admins con participación y nuevas salas.</p>
                    <div className="item-meta">Pendiente · Est. 1.5 semanas</div>
                  </div>

                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label research">Research</span>
                      <span className="item-title"> Moderación asistida por IA</span>
                    </div>
                    <p className="item-desc">
                      Prototipo para detectar spam y lenguaje tóxico en chats.
                    </p>
                    <div className="item-meta">Descubrimiento · Est. 2 semanas</div>
                  </div>
                </div>
              </div>

              
              <div className="column">
                <div className="head">
                  <h5>Más adelante</h5>
                  <span className="badge-count">3</span>
                </div>
                <div className="items">
                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label feature">Feature</span>
                      <span className="item-title"> App móvil (iOS/Android)</span>
                    </div>
                    <p className="item-desc">Notificaciones push y acceso rápido a tus salas.</p>
                    <div className="item-meta">Backlog · Planificación Q4</div>
                  </div>

                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label quality">Calidad</span>
                      <span className="item-title"> Internacionalización</span>
                    </div>
                    <p className="item-desc">ES/EN de inicio, con estructura para más idiomas.</p>
                    <div className="item-meta">Backlog · Planificación Q4</div>
                  </div>

                  <div className="card-item">
                    <div className="mb-1">
                      <span className="label improve">Mejora</span>
                      <span className="item-title"> Métricas y analítica</span>
                    </div>
                    <p className="item-desc">KPIs claros para administradores de salas.</p>
                    <div className="item-meta">Backlog · Por priorizar</div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="d-flex gap-2 mt-4">
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
