import React from "react";
import { Link, useNavigate } from "react-router-dom";


import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const ResourceChangelog = () => {
  const navigate = useNavigate();

  return (
    <div className="cl-scope">
      <SoftRibbonNav />

      <style>{`
        :root{
          --cl-primary:#cb0c9f;
          --cl-info:#17c1e8;
          --cl-dark:#0f1b33;
          --cl-muted:#6b7c90;
          --cl-grad: linear-gradient(310deg,#7928CA,#FF0080);
        }

        /* ===== Fondo suave + arte difuminado (scopeado) ===== */
        .cl-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1600px 700px at 6% -20%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 520px at 96% 0%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .cl-scope .bg-art{
          content:""; position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.16;
        }
        .cl-scope .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1100px; margin:0 auto; padding:0 16px; }

        /* ===== Hero ===== */
        .cl-hero{ padding:28px 0 8px; text-align:center; }
        .chip{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.35rem .75rem; border-radius:999px; font-weight:800; font-size:.9rem;
          background:#f1e4f9; color:#7a35c1; border:1px solid #ead6ff;
          box-shadow:0 8px 20px rgba(124,58,237,.14);
        }
        .title{
          margin:.4rem 0 .25rem; font-weight:900; letter-spacing:.2px;
          background: var(--cl-grad);
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .subtitle{ color:var(--cl-muted); margin:0; }

        /* ===== Tarjetas / timeline ===== */
        .card-soft{
          border:0; border-radius:22px; background:#fff;
          box-shadow:0 18px 55px rgba(15,23,42,.12);
        }
        .version{ font-weight:900; color:#20314d; }
        .date{ color:#8aa0b6; font-size:.95rem; }
        .dot{
          width:12px; height:12px; border-radius:999px; margin-top:2px;
          background:var(--cl-grad);
          box-shadow:0 6px 16px rgba(203,12,159,.28);
          flex:0 0 12px;
        }
        .line{ width:2px; background:#edf1f6; flex:0 0 2px; border-radius:2px; }

        /* Tags */
        .tag{
          display:inline-block; padding:.25rem .55rem; border-radius:999px;
          font-size:.8rem; font-weight:800; margin-bottom:.25rem;
        }
        .tag.added{ background:#e9faf0; color:#1f9254; border:1px solid #d3f1df; }
        .tag.changed{ background:#fff7e6; color:#a76a00; border:1px solid #ffe1ad; }
        .tag.fixed{ background:#fdecec; color:#b42318; border:1px solid #ffcccc; }

        /* Botones */
        .btn-brand{
          background-image: var(--cl-grad); border:0; color:#fff; font-weight:800;
          border-radius:12px; box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
        .btn{ border-radius:12px; font-weight:800; }

        .navbar .btn,
        .navbar .btn-group,
        nav.navbar + .container .btn,
        nav.navbar + .container .btn-group,
        .template-links {
          display: none !important;
        }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        
        <section className="cl-hero">
          <div className="container-neo">
            <span className="chip">Recursos</span>
            <h1 className="display-6 title">Changelog</h1>
            <p className="subtitle">Notas de versión y mejoras recientes.</p>
          </div>
        </section>

        
        <section className="pb-4">
          <div className="container-neo">
            <div className="row g-4">
              <div className="col-lg-10 mx-auto">
                {/* v1.4.0 */}
                <div className="card-soft p-4 p-md-5">
                  <div className="d-flex align-items-start gap-3">
                    <div className="dot"></div>
                    <div className="line h-100" />
                    <div className="w-100">
                      <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div className="version h5 m-0">v1.4.0</div>
                        <div className="date">14 Ago 2025</div>
                      </div>
                      <div className="mt-3">
                        <span className="tag added me-2">Añadido</span>
                        <ul className="mb-3" style={{ color:"#6b7c90" }}>
                          <li>Vista pública de <strong>Guías rápidas</strong> con pasos básicos.</li>
                          <li>Nuevo <strong>footer</strong> con enlaces de Compañía, Recursos y Legal.</li>
                        </ul>
                        <span className="tag changed me-2">Mejorado</span>
                        <ul className="mb-3" style={{ color:"#6b7c90" }}>
                          <li>Estilos Soft-UI aislados para evitar conflictos con otras páginas.</li>
                          <li>Responsive del hero y tarjetas “3 pasos”.</li>
                        </ul>
                        <span className="tag fixed me-2">Corregido</span>
                        <ul className="mb-0" style={{ color:"#6b7c90" }}>
                          <li>Problema donde algunos estilos globales afectaban a vistas antiguas.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* v1.3.2 */}
                <div className="card-soft p-4 p-md-5 mt-3">
                  <div className="d-flex align-items-start gap-3">
                    <div className="dot"></div>
                    <div className="line h-100" />
                    <div className="w-100">
                      <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div className="version h5 m-0">v1.3.2</div>
                        <div className="date">2 Ago 2025</div>
                      </div>
                      <div className="mt-3">
                        <span className="tag added me-2">Añadido</span>
                        <ul className="mb-3" style={{ color:"#6b7c90" }}>
                          <li>Vista de <strong>Equipo</strong> con fichas de miembros y CTA de vuelta.</li>
                        </ul>
                        <span className="tag changed me-2">Mejorado</span>
                        <ul className="mb-3" style={{ color:"#6b7c90" }}>
                          <li>Animación sutil al pasar por encima de botones principales.</li>
                        </ul>
                        <span className="tag fixed me-2">Corregido</span>
                        <ul className="mb-0" style={{ color:"#6b7c90" }}>
                          <li>Bug al compartir enlace de invitación desde móvil.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="card-soft p-4 p-md-5 mt-3">
                  <div className="d-flex align-items-start gap-3">
                    <div className="dot"></div>
                    <div className="line h-100" />
                    <div className="w-100">
                      <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div className="version h5 m-0">v1.3.0</div>
                        <div className="date">18 Jul 2025</div>
                      </div>
                      <div className="mt-3">
                        <span className="tag added me-2">Añadido</span>
                        <ul className="mb-3" style={{ color:"#6b7c90" }}>
                          <li>Sección <strong>Compañía</strong>: Equipo, Trabaja con nosotros y Contacto.</li>
                          <li>Páginas legales: Términos, Privacidad, Cookies y Juego responsable.</li>
                        </ul>
                        <span className="tag changed me-2">Mejorado</span>
                        <ul className="mb-3" style={{ color:"#6b7c90" }}>
                          <li>Accesibilidad en botones e inputs; mejor contraste de colores.</li>
                        </ul>
                        <span className="tag fixed me-2">Corregido</span>
                        <ul className="mb-0" style={{ color:"#6b7c90" }}>
                          <li>Desfase de layout en Safari al abrir el modal de “Nueva apuesta”.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="d-flex gap-2 mt-4">
                  <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
                  <Link to="/" className="btn btn-outline-primary">Ir al inicio</Link>
                  
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
};

export default ResourceChangelog;
