// src/front/pages/CompanyTeam.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// 🔽 Solo visual
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";
import miguelImg from "../../../docs/assets/img/miguel.jpg";

export const CompanyTeam = () => {
  const navigate = useNavigate();

  return (
    <div className="team-scope">
      {/* Nav Soft-UI */}
      <SoftRibbonNav />

      {/* Fondo artístico global */}
      <div className="bg-art" aria-hidden="true"></div>

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
        }

        /* ========= ARREGLO FRANJA BLANCA (solo en esta vista) ========= */
        @supports selector(body:has(.team-scope)) {
          body:has(.team-scope) nav.navbar{ display:none !important; }
          body:has(.team-scope) .content-wrapper.flex-grow-1,
          body:has(.team-scope) .flex-grow-1.main-content.d-flex.flex-column{
            padding-top:0 !important;
            background:transparent !important;
          }
        }
        /* Fallback si :has() no está disponible */
        .team-scope{ margin-top:-72px; }
        @media (min-width:992px){ .team-scope{ margin-top:-84px; } }

        /* un pequeño respiro para la ribbon */
        .team-scope nav.soft-ribbon{ margin-top: 25px; }

        .team-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
            linear-gradient(#fff,#fff);
        }
        .team-scope .bg-art{
          position:fixed; inset:0; pointer-events:none;
          background-image:url(${heroArt});
          background-size:cover; background-position:center;
          filter: blur(18px) saturate(1.05) contrast(1.04);
          opacity:.18; z-index:0;
        }
        .team-scope .content{ position:relative; z-index:1; }
        .team-scope .container{ max-width:1100px; }

        /* Ocultar posibles botones del template superior */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn,
        nav.navbar + .container .btn-group,
        .template-links { display: none !important; }

        /* ====== HERO ====== */
        .team-hero{
          position:relative; color:#eaf2ff; padding:80px 0 140px;
          background: radial-gradient(1400px 600px at 50% -280px, #20314d 0%, #0f1b33 62%);
          overflow:hidden; box-shadow:0 24px 60px rgba(15,23,42,.22);
        }
        .team-hero h1{ font-weight:800; letter-spacing:.2px; margin:0 0 .25rem 0; }
        .team-hero p{ color:#a9b8cc; max-width:760px; margin:0; }
        .wave{ position:absolute; left:0; right:0; bottom:-1px; width:100%; height:120px; pointer-events:none; }

        /* ====== CARDS ====== */
        .person-card{
          background:#fff; border-radius:20px; padding:18px;
          box-shadow:0 18px 60px rgba(15,23,42,.18);
          border:1px solid #edf1f6;
        }
        .avatar{
          width:100%; height:230px; border-radius:14px;
          object-fit:cover; object-position:center 40%;
        }
        .role{ color:var(--su-info); font-weight:700; margin-bottom:.25rem; }
        .name{ font-weight:800; color:#20314d; margin-bottom:.125rem; }
        .story{ color:#6b7c90; margin-bottom:0; }

        /* Links de perfil tipo “chip” */
        .profile-links{ display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.5rem; }
        .chip-link{
          display:inline-flex; align-items:center; gap:.35rem;
          padding:.35rem .6rem; border-radius:10px; font-weight:700;
          color:#20314d; text-decoration:none; background:#f8fbff;
          border:1px solid #e5ecf7;
          transition:.15s ease;
        }
        .chip-link:hover{ background:#eef6ff; border-color:#cfe1ff; color:#0f1b33; }

        /* Botón brand */
        .btn-brand{
          background-image: var(--su-gradient); border:0; color:#fff;
          padding:.9rem 1.3rem; border-radius:12px;
          box-shadow:0 10px 26px rgba(203,12,159,.35);
          transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      `}</style>

      <div className="content">
        {/* HERO */}
        <section className="team-hero">
          <div className="container">
            <h1 className="mb-2">El equipo</h1>
            <p className="mb-0">
              Tres perfiles, un mismo objetivo: hacer que tus porras con amigos sean
              tan fáciles como divertidas. Tecnología, diseño y datos al servicio de
              las risas con tu grupo.
            </p>
          </div>
          <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              d="M0,64 C240,128 480,0 720,32 C960,64 1200,144 1440,80 L1440,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </section>

        {/* CARDS */}
        <section className="py-4 py-md-5">
          <div className="container">
            <div className="row g-4">
              {/* Pablo */}
              <div className="col-12">
                <div className="person-card">
                  <div className="row g-4 align-items-center">
                    <div className="col-sm-4 col-md-3">
                      <img
                        className="avatar"
                        src="https://cdn.pixabay.com/photo/2016/11/29/03/52/man-1867175_640.jpg"
                        alt="Pablo – CTO"
                      />
                    </div>
                    <div className="col-sm-8 col-md-9">
                      <div className="name">Pablo</div>
                      <div className="role">CTO & Arquitecto de la app</div>
                      <p className="story">
                        Pablo optimiza bases de datos mientras hace café con una mano y
                        despliega servidores con la otra. Convirtió un prototipo en una
                        plataforma capaz de soportar miles de apuestas en tiempo real.
                        Su superpoder: arreglar un bug leyendo el stacktrace de reojo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stephy */}
              <div className="col-12">
                <div className="person-card">
                  <div className="row g-4 align-items-center">
                    <div className="col-sm-4 col-md-3">
                      <img
                        className="avatar"
                        src="https://cdn.pixabay.com/photo/2023/04/03/04/48/woman-7895953_640.jpg"
                        alt="Stephy – Head of Product"
                      />
                    </div>
                    <div className="col-sm-8 col-md-9">
                      <div className="name">Stephy</div>
                      <div className="role">Head of Product & UX</div>
                      <p className="story">
                        Stephy convierte ideas en pantallas que dan ganas de tocar.
                        Diseñó el flujo de “apuesta en 3 toques” que nos enamoró a todos:
                        rápido, claro y con mucho estilo. Cuando el equipo se atasca,
                        aparece con un prototipo que soluciona el problema… y dos más.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Miguel (tu card, con texto y links) */}
              <div className="col-12">
                <div className="person-card">
                  <div className="row g-4 align-items-center">
                    <div className="col-sm-4 col-md-3">
                      <img
                        className="avatar"
                        src={miguelImg}
                        alt="Miguel – Growth & Data"
                      />
                    </div>
                    <div className="col-sm-8 col-md-9">
                      <div className="name">Miguel</div>
                      <div className="role">Growth, Data & Front-end lover</div>
                      <p className="story">
                        Me encanta el front-end: componentes limpios, micro-interacciones
                        con sentido y rendimiento fino. Combino datos (SQL, métricas y
                        visualización) con producto para decidir qué construir y cómo
                        medirlo. También disfruto afinando el UI cuando hace falta —
                        accesibilidad, estados vacíos cuidados y pequeños detalles que
                        hacen que todo se sienta “redondo”.
                      </p>
                      <div className="profile-links">
                        <a
                          className="chip-link"
                          href="https://github.com/miguelarea"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub de Miguel"
                          title="GitHub @miguelarea"
                        >
                          GitHub @miguelarea
                        </a>
                        <a
                          className="chip-link"
                          href="https://es.linkedin.com/in/miguel-area-baz"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn de Miguel"
                          title="LinkedIn — Miguel Area Baz"
                        >
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Volver */}
              <div className="col-12 text-center mt-4 pt-2">
                <button className="btn-brand" onClick={() => navigate(-1)}>
                  ← Volver
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default CompanyTeam;
