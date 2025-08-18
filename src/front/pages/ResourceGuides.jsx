import React from "react";
import { Link, useNavigate } from "react-router-dom";


import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export default function ResourceGuides() {
  const navigate = useNavigate();

  return (
    <div className="guides-scope">
      <SoftRibbonNav />

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-grad: linear-gradient(310deg,#7928CA,#FF0080);
        }

        /* ===== FONDO SUAVE + ARTE DIFUMINADO ===== */
        .guides-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1600px 700px at 6% -20%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 520px at 96% 0%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .guides-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.16;
        }
        .guides-scope .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

        /* Oculta botones del template de la demo (solo aquí) */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn, nav.navbar + .container .btn-group,
        .template-links { display:none !important; }

        /* ===== HERO ===== */
        .hero{ padding:28px 0 10px; }
        .chip{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.35rem .75rem; border-radius:999px; font-weight:800; font-size:.9rem;
          background:#e6f9ff; color:#1494b8; border:1px solid #d8f1fb;
          box-shadow:0 8px 20px rgba(20,148,184,.12);
        }
        .title{
          margin:.5rem 0 .25rem; font-weight:900; letter-spacing:.2px;
          background: var(--su-grad);
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .lead-muted{ color:var(--su-muted); margin:0; }

        /* ===== CARDS ===== */
        .card-soft{
          border:0; border-radius:22px; background:#fff; height:100%;
          box-shadow:0 18px 55px rgba(15,23,42,.12);
        }
        .emoji{
          width:48px; height:48px; display:grid; place-items:center;
          font-size:28px; border-radius:12px; background:#f3f0ff; color:#6c4bd5;
          box-shadow:0 8px 24px rgba(108,75,213,.14);
        }
        .title-ink{ color:#20314d; font-weight:800; }
        .muted{ color:var(--su-muted); }

        /* ===== BOTONES ===== */
        .btn-brand{
          background-image: var(--su-grad); border:0; color:#fff; font-weight:800;
          border-radius:12px; box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.06); transform:translateY(-1px); }
        .btn{ border-radius:12px; font-weight:800; }

        /* ===== DETALLES / FAQ ===== */
        .faq-box{
          background:#fff; border-radius:18px; padding:1rem 1.2rem;
          box-shadow:0 18px 50px rgba(15,23,42,.08); border:1px solid #eef2f7;
        }
        .faq-box + .faq-box{ margin-top:.75rem; }
        .faq-box summary{
          list-style:none; cursor:pointer; user-select:none; display:flex; align-items:center; gap:.5rem;
          font-weight:800; color:#20314d;
        }
        .faq-box summary::after{
          content:"▾"; margin-left:auto; transition:transform .18s ease; color:#6c4bd5; font-weight:900;
        }
        .faq-box[open] summary{ color:#6c4bd5; }
        .faq-box[open] summary::after{ transform:rotate(180deg); }
        .faq-box p{ color:var(--su-muted); margin:.6rem 0 0; }

        /* CTA navega */
        .cta-row{ display:flex; gap:10px; flex-wrap:wrap; }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        
        <section className="hero">
          <div className="container-neo">
            <span className="chip">Recursos</span>
            <h1 className="display-6 title">Guías rápidas</h1>
            <p className="lead-muted">
              Empieza en minutos: crea tu sala, invita a tus amigos y publica tu primera apuesta.
            </p>
          </div>
        </section>

        
        <section className="py-3">
          <div className="container-neo">
            <div className="row g-4">
              
              <div className="col-md-6 col-lg-4">
                <div className="card-soft p-4">
                  <div className="emoji mb-3">🧩</div>
                  <h5 className="title-ink">Crea tu primer playground</h5>
                  <ol className="muted mt-2 mb-3">
                    <li>Ve a <strong>Playgrounds</strong> → <em>Crear</em>.</li>
                    <li>Elige nombre, imagen y descripción.</li>
                    <li>Guarda y abre el tablero.</li>
                  </ol>
                  <div className="d-flex gap-2">
                    <Link to="/create" className="btn btn-brand btn-sm">Crear usuario</Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-sm">Iniciar sesión</Link>
                  </div>
                </div>
              </div>

              
              <div className="col-md-6 col-lg-4">
                <div className="card-soft p-4">
                  <div className="emoji mb-3">👥</div>
                  <h5 className="title-ink">Invita a tus amigos</h5>
                  <ol className="muted mt-2 mb-3">
                    <li>Desde el tablero, pulsa <strong>Invitar</strong>.</li>
                    <li>Busca por usuario o email y envía la invitación.</li>
                    <li>Confirma cuando acepten y listo.</li>
                  </ol>
                  <div className="d-flex gap-2">
                    <Link to="/create" className="btn btn-brand btn-sm">Crear usuario</Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-sm">Iniciar sesión</Link>
                  </div>
                </div>
              </div>

              
              <div className="col-md-6 col-lg-4">
                <div className="card-soft p-4">
                  <div className="emoji mb-3">🎯</div>
                  <h5 className="title-ink">Publica tu primera apuesta</h5>
                  <ol className="muted mt-2 mb-3">
                    <li>En el tablero, pulsa <strong>Nueva apuesta</strong>.</li>
                    <li>Define el evento, opciones y fecha límite.</li>
                    <li>Comparte y sigue el chat. ¡A jugar!</li>
                  </ol>
                  <div className="d-flex gap-2">
                    <Link to="/create" className="btn btn-brand btn-sm">Crear usuario</Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-sm">Iniciar sesión</Link>
                  </div>
                </div>
              </div>
            </div>

           
            <div className="row g-4 mt-1">
              <div className="col-lg-6">
                <h5 className="title-ink mb-3">Consejos rápidos</h5>

                <details className="faq-box">
                  <summary>¿Cómo elijo una buena imagen para la sala?</summary>
                  <p>
                    Usa fotos horizontales, que representen el tema del grupo y mantengan buen contraste.
                    Se verán perfectas en el tablero.
                  </p>
                </details>

                <details className="faq-box">
                  <summary>¿Puedo editar una apuesta ya publicada?</summary>
                  <p>
                    Sí, mientras no haya pasado la fecha límite. Cambia nombre, opciones o imagen.
                  </p>
                </details>

                <details className="faq-box">
                  <summary>¿Cómo exporto resultados?</summary>
                  <p>
                    Desde el tablero, abre <em>Más</em> → <em>Exportar</em> para descargar un resumen en CSV.
                  </p>
                </details>
              </div>

              <div className="col-lg-6">
                <h5 className="title-ink mb-3">Sigue con…</h5>

                <div className="card-soft p-4 mb-3">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="muted">
                      ¿Tienes dudas? Escribe por el <Link to="/message-board">Message Board</Link> o contáctanos.
                    </div>
                    <Link to="/company/contact" className="btn btn-outline-secondary btn-sm">Contacto</Link>
                  </div>
                </div>

                
              </div>
            </div>

            <div className="cta-row mt-4">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
              <Link to="/" className="btn btn-outline-primary">Ir al inicio</Link>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
