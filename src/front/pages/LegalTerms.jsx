// src/front/pages/LegalTerms.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const LegalTerms = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="legal-terms-scope">
      <SoftRibbonNav />

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-secondary:#8796a8;
          --su-muted:#6b7c90;
          --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
        }

        /* ================== ARREGLA LA FRANJA BLANCA (solo en esta vista) ================== */
        @supports selector(body:has(.legal-terms-scope)) {
          body:has(.legal-terms-scope) .content-wrapper,
          body:has(.legal-terms-scope) .flex-grow-1.main-content.d-flex.flex-column{
            padding-top:0 !important;           /* elimina empuje superior del layout */
            background:transparent !important;  /* evita fondo blanco del wrapper */
          }
          body:has(.legal-terms-scope) .navbar{
            display:none !important;            /* oculta la navbar global solo aquí */
          }
        }
        /* Fallback si :has() no aplica (ajusta 72/84 si tu layout empuja más) */
        .legal-terms-scope{ margin-top:-72px; }
        @media (min-width:992px){ .legal-terms-scope{ margin-top:-84px; } }

        /* Un pelín de aire para la ribbon propia */
        .legal-terms-scope nav.soft-ribbon{ margin-top:25px; }
        /* =================================================================================== */

        /* ===== Lienzo y arte difuminado ===== */
        .legal-terms-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1500px 650px at 7% -15%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 540px at 98% -10%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .legal-terms-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.14;
        }
        .legal-terms-scope .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

        /* Oculta botones/links de la demo en esta vista */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn, nav.navbar + .container .btn-group,
        .template-links { display:none !important; }

        /* ===== HERO ===== */
        .hero-legal{ padding:38px 0 20px; }
        .hero-legal .chip{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.35rem .75rem; border-radius:999px; font-weight:800; font-size:.9rem;
          background:#f6e9f3; color:#cb0c9f; border:1px solid #f0d7e7;
          box-shadow:0 8px 20px rgba(203,12,159,.12);
        }
        .hero-legal h1{
          margin:.5rem 0 .4rem;
          background: linear-gradient(90deg, var(--su-info), var(--su-primary));
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
          font-weight:900; letter-spacing:.2px;
        }
        .hero-legal .lead{ color:var(--su-secondary); }
        .last-update{ color:#8aa0b6; }

        /* ===== Chips de índice ===== */
        .toc{
          display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.75rem;
        }
        .link-chip{
          display:inline-flex; align-items:center; gap:.4rem;
          padding:.35rem .7rem; border-radius:999px; font-weight:700; font-size:.9rem;
          background:#fff; color:#20314d; border:1px solid #e9edf6;
          box-shadow:0 8px 18px rgba(15,23,42,.06); text-decoration:none;
        }
        .link-chip:hover{ transform:translateY(-1px); }

        /* ===== Cards de contenido ===== */
        .section{ padding:1.2rem 0 2.4rem; }
        .soft-card{
          border:1px solid rgba(255,255,255,.6);
          border-radius:20px; background:#fff;
          box-shadow:0 18px 55px rgba(15,23,42,.12);
        }
        .soft-card h5{ color:#20314d; font-weight:800; }
        .soft-card p, .soft-card li{ color:var(--su-muted); }
        .soft-card ul{ padding-left:1.1rem; }

        /* ===== Botones ===== */
        .btn{ border-radius:12px; font-weight:800; }
        .btn-brand{
          background-image: var(--su-gradient);
          border:0; color:#fff;
          box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.03); transform:translateY(-1px); }

        /* CTA / Volver */
        .cta-wrap{ margin-top: 1.25rem; }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      <header className="hero-legal">
        <div className="container-neo">
          <span className="chip">Legal</span>
          <h1 className="display-5">Términos y Condiciones</h1>
          <p className="lead">
            Bienvenido a Playgrounds & Bets. Estos términos regulan el acceso y uso de la plataforma.
            Léelos con calma; están pensados para que todos disfrutemos la experiencia con claridad y buen rollo.
          </p>
          <small className="last-update">Última actualización: {today}</small>

          <nav className="toc" aria-label="Índice rápido">
            {[
              ["#intro","Introducción"],
              ["#uso","Uso aceptable"],
              ["#cuentas","Cuentas y seguridad"],
              ["#contenido","Contenidos y propiedad"],
              ["#apuestas","Apuestas y responsabilidad"],
              ["#pagos","Pagos y suscripciones"],
              ["#privacidad","Privacidad"],
              ["#cancelacion","Cancelación"],
              ["#modificaciones","Modificaciones y ley"],
              ["#contacto","Contacto"],
            ].map(([href,label])=>(
              <a key={href} className="link-chip" href={href}>{label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main className="section content">
        <div className="container-neo">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="soft-card p-4 p-lg-5 h-100">
                <h5 id="intro">1) Introducción</h5>
                <p>
                  Al crear una cuenta o utilizar Playgrounds & Bets aceptas estos Términos y nuestra
                  Política de Privacidad. Si no estás de acuerdo, por favor no uses el servicio.
                  Podemos actualizar estas condiciones para mejorar la plataforma; te avisaremos
                  cuando haya cambios relevantes.
                </p>

                <h5 id="uso" className="mt-4">2) Uso Aceptable</h5>
                <ul className="mb-0">
                  <li>No publiques contenido ilegal, ofensivo o que infrinja derechos.</li>
                  <li>No intentes vulnerar o desactivar la plataforma.</li>
                  <li>Respeta a los demás usuarios y a tus grupos privados.</li>
                  <li>La plataforma está pensada para mayores de 18 años.</li>
                </ul>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="soft-card p-4 p-lg-5 h-100">
                <h5 id="cuentas">3) Cuentas y Seguridad</h5>
                <p>
                  Eres responsable de mantener la confidencialidad de tu cuenta y de la actividad
                  que se produzca con ella. Usa contraseñas sólidas, no compartas accesos y avísanos
                  si detectas actividad sospechosa.
                </p>

                <h5 id="contenido" className="mt-4">4) Contenidos y Propiedad</h5>
                <p>
                  Tú conservas los derechos sobre el contenido que subas; nos concedes una licencia
                  limitada para alojarlo y mostrarlo en la app. El software, marca y elementos visuales
                  de Playgrounds & Bets nos pertenecen o a nuestros licenciantes.
                </p>

                <h5 id="apuestas" className="mt-4">5) Apuestas y Responsabilidad</h5>
                <p>
                  Las salas y apuestas son privadas entre usuarios. Playgrounds & Bets proporciona herramientas
                  de organización y no se hace responsable de acuerdos, pagos, resultados o resultados deportivos.
                  Usa la app con responsabilidad y sentido común.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="soft-card p-4 p-lg-5 h-100">
                <h5 id="pagos">6) Pagos y Suscripciones</h5>
                <p>
                  Si en el futuro ofrecemos planes premium o servicios de pago, se detallarán las condiciones
                  de precio, facturación y cancelación antes de contratar. Cualquier cargo será transparente
                  y podrás gestionar tu suscripción cuando quieras.
                </p>

                <h5 id="privacidad" className="mt-4">7) Privacidad</h5>
                <p>
                  Tratamos tus datos según nuestra Política de Privacidad. Podrás solicitar acceso, rectificación
                  o eliminación conforme a la normativa aplicable.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="soft-card p-4 p-lg-5 h-100">
                <h5 id="cancelacion">8) Cancelación</h5>
                <p>
                  Puedes dejar de usar la plataforma en cualquier momento. También podremos suspender o cancelar
                  cuentas que incumplan estos Términos o que perjudiquen a la comunidad.
                </p>

                <h5 id="modificaciones" className="mt-4">9) Modificaciones y Ley Aplicable</h5>
                <p>
                  Podemos actualizar estas condiciones para introducir mejoras, cambios legales o de producto.
                  La ley aplicable y jurisdicción serán las de tu país de residencia, salvo que la normativa
                  disponga lo contrario.
                </p>

                <h5 id="contacto" className="mt-4">10) Contacto</h5>
                <p className="mb-0">
                  ¿Dudas? Estamos para ayudarte:{" "}
                  <a href="mailto:hola@playbets.app">hola@playbets.app</a>
                </p>
              </div>
            </div>
          </div>

          <div className="cta-wrap d-flex flex-wrap gap-2 pb-4">
            <button className="btn btn-brand btn-lg" onClick={() => navigate(-1)}>
              ← Volver
            </button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default LegalTerms;
