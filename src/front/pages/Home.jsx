// src/front/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import SiteFooter from "../components/SiteFooter";
import { FaFutbol, FaSearch, FaUser, FaBolt } from "react-icons/fa";

export const Home = () => {
  const { user } = useAuth();

  const displayName =
    user?.username || user?.name || user?.first_name || "amigo";
  const avatar = user?.url_image || "https://i.pravatar.cc/240?img=4";

  return (
    <div className="home-neo-scope">
      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
        }
        .home-neo-scope{
          background:
            radial-gradient(1600px 700px at 6% -20%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 520px at 96% 0%, #e6f9ff 0%, transparent 55%),
            linear-gradient(#fff,#fff);
        }
        .container-neo{ max-width: 1180px; margin: 0 auto; padding: 0 16px; }

        /* ====== HERO ====== */
        .hero{ padding: 42px 0 28px; }
        .hero-wrap{
          display:grid; grid-template-columns: 1.15fr .85fr; gap: 24px;
          align-items:center;
        }
        @media (max-width: 991.98px){ .hero-wrap{ grid-template-columns: 1fr; } }

        .title{
          font-weight: 900; letter-spacing:.2px; color:#20314d;
          font-size: clamp(28px, 3.2vw, 44px);
          line-height: 1.08;
        }
        .title .name{
          background: linear-gradient(90deg, var(--su-info), var(--su-primary));
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
        }
        .lead-muted{ color: var(--su-muted); font-size: 1.05rem; }

        .userbar{ display:flex; align-items:center; gap:14px; margin:10px 0 14px; }
        .avatar{
          width:64px; height:64px; border-radius:50%; object-fit:cover;
          box-shadow:0 10px 28px rgba(15,23,42,.18);
        }

        .cta-row{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 10px; }
        .btn-brand{
          background-image: var(--su-gradient);
          border:0; color:#fff; font-weight:800;
          padding:.85rem 1.2rem; border-radius:12px; text-decoration:none;
          box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.06); transform:translateY(-1px); }
        .btn-ghost{
          border:1px solid #e7ecf3; color:#20314d; font-weight:700;
          padding:.85rem 1.2rem; border-radius:12px; text-decoration:none;
          background:#fff; box-shadow:0 8px 24px rgba(15,23,42,.06);
        }
        .btn-ghost:hover{ transform:translateY(-1px); }

        /* Tarjeta principal del hero */
        .hero-card{
          border-radius:22px; overflow:hidden;
          position:relative;
          border:1px solid rgba(203,12,159,.12);
          box-shadow:0 28px 80px rgba(15,23,42,.16);
          display:flex;
          flex-direction:column;
        }
        .hero-card img{ width:100%; height:360px; object-fit:cover; display:block; }

        /* Franja de texto bajo la imagen (antes badge flotante) */
        .hero-caption{
          padding:.7rem .95rem;
          background:#fff;
          border-top:1px solid #edf1f6;
          font-weight:800; color:#20314d;
          display:flex; align-items:center; gap:.5rem;
        }
        .hero-caption .ico{ color:#7b2fc9; }

        /* ====== PROMOS / PUBLICIDAD ====== */
        .section{ padding: 22px 0 12px; }
        .grid-3{ display:grid; grid-template-columns: repeat(3,1fr); gap:18px; }
        @media (max-width: 991.98px){ .grid-3{ grid-template-columns: 1fr; } }

        .promo{ background:#fff; border-radius:18px; overflow:hidden;
          border:1px solid #edf1f6; box-shadow:0 18px 50px rgba(15,23,42,.10);
          display:flex; gap:14px; padding:14px;
        }
        .promo .thumb{
          width:120px; height:100px; border-radius:12px; object-fit:cover;
          flex:0 0 120px;
        }
        .promo .tag-ads{
          display:inline-block; font-size:.8rem; font-weight:800; letter-spacing:.4px;
          color:#7b2fc9; background:#f0e7ff; padding:.2rem .5rem;
          border-radius:999px; margin-bottom:6px;
        }
        .promo h5{ margin: 0 0 4px; color:#20314d; font-weight:800; }
        .promo p{ margin:0; color:var(--su-muted); }

        /* ====== TENDENCIAS ====== */
        .grid-2{ display:grid; grid-template-columns: repeat(2,1fr); gap:18px; }
        @media (max-width: 991.98px){ .grid-2{ grid-template-columns: 1fr; } }

        .trend{ background:#fff; border-radius:18px; border:1px solid #edf1f6;
          box-shadow:0 18px 50px rgba(15,23,42,.10); overflow:hidden;
        }
        .trend .cover{ width:100%; height:200px; object-fit:cover; display:block; }
        .trend .body{ padding:14px; }
        .trend h5{ color:#20314d; font-weight:800; margin:0 0 4px; }
        .trend .meta{ color:#6b7c90; font-size:.95rem; margin-bottom:8px; }
        .odds{ display:flex; gap:10px; flex-wrap:wrap; }
        .odd{
          border:1px solid #e7ecf3; background:#fff; border-radius:12px;
          padding:.55rem .8rem; font-weight:800; color:#20314d;
          box-shadow:0 8px 22px rgba(15,23,42,.06);
        }
        .odd.is-hot{ background:#fff9f2; border-color:#ffd1a6; color:#a65a00; }

        /* ====== ARTÍCULOS ====== */
        .article{ background:#fff; border:1px solid #edf1f6; border-radius:18px;
          box-shadow:0 18px 50px rgba(15,23,42,.10); overflow:hidden;
        }
        .article img{ width:100%; height:180px; object-fit:cover; display:block; }
        .article .pad{ padding:14px; }
        .pill{
          display:inline-block; font-weight:800; font-size:.8rem;
          padding:.25rem .55rem; border-radius:999px; margin-bottom:8px;
          background:#e6f9ff; color:#0a97b3; 
        }
        .article h5{ margin:0 0 4px; color:#20314d; font-weight:800; }
        .article p{ margin:0 0 8px; color:var(--su-muted); }
        .link{ color:#7b2fc9; font-weight:800; text-decoration:none; }
        .link:hover{ text-decoration:underline; }

        .section-title{
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:12px;
        }
        .section-title h3{ color:#20314d; font-weight:900; margin:0; }
        .muted{ color: var(--su-muted); }
      `}</style>

      {/* ======= HERO ======= */}
      <section className="hero">
        <div className="container-neo hero-wrap">
          {/* Columna izquierda */}
          <div>
            <h1 className="title">
              ¡Hola, <span className="name">{displayName}</span>!
            </h1>

            <div className="userbar">
              <img className="avatar" src={avatar} alt="avatar" />
              <p className="lead-muted m-0">
                Bienvenido de nuevo. Crea una apuesta, únete a una sala o
                explora las tendencias de hoy.
              </p>
            </div>

            <div className="cta-row">
              <Link className="btn-brand" to="/playground">
                <FaFutbol className="me-2" /> Crear apuesta
              </Link>
              <Link className="btn-ghost" to="/playground/search">
                <FaSearch className="me-2" /> Buscar sala
              </Link>
              <Link className="btn-ghost" to="/my-profile">
                <FaUser className="me-2" /> Mi perfil
              </Link>
            </div>
          </div>

          {/* Columna derecha (imagen grande con caption) */}
          <div className="hero-card">
            <img
              src="https://cdn.pixabay.com/photo/2022/07/10/16/57/boston-terrier-7313320_640.jpg"
              alt="Hero deporte"
            />
            <div className="hero-caption">
              <FaBolt className="ico" />
              ¿Cuánto tiempo durará sentado? Apuesta.
            </div>
          </div>
        </div>
      </section>

      {/* ======= PROMOS (PUBLICIDAD) ======= */}
      <section className="section">
        <div className="container-neo">
          <div className="section-title">
            <h3>Promos del día</h3>
            <span className="muted">Publicidad</span>
          </div>

          <div className="grid-3">
            <div className="promo">
              <img
                className="thumb"
                src="https://cdn.pixabay.com/photo/2016/01/02/11/17/euro-1118082_640.jpg"
                alt="Bienvenida"
              />
              <div>
                <span className="tag-ads">BONO</span>
                <h5>Bienvenida 20€</h5>
                <p>Duplica tu primera apuesta.</p>
              </div>
            </div>

            <div className="promo">
              <img
                className="thumb"
                src="https://cdn.pixabay.com/photo/2012/11/28/10/33/rocket-launch-67641_640.jpg"
                alt="Boost"
              />
              <div>
                <span className="tag-ads">BOOST</span>
                <h5>Cuotas mejoradas</h5>
                <p>Subimos la cuota de tu combinada.</p>
              </div>
            </div>

            <div className="promo">
              <img
                className="thumb"
                src="https://cdn.pixabay.com/photo/2016/06/29/21/14/women-1487825_640.jpg"
                alt="Amigos"
              />
              <div>
                <span className="tag-ads">AMIGOS</span>
                <h5>Invita y gana</h5>
                <p>Trae a 1 amigo y recibe monedas extra.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= TENDENCIAS HOY ======= */}
      <section className="section">
        <div className="container-neo">
          <div className="section-title">
            <h3>Tendencias hoy</h3>
            <Link className="link" to="/playground/search">Ver más</Link>
          </div>

          <div className="grid-2">
            <div className="trend">
              <img
                className="cover"
                src="https://cdn.pixabay.com/photo/2016/11/29/02/05/audience-1866738_640.jpg"
                alt="LaLiga"
              />
              <div className="body">
                <h5>LaLiga – Madrid vs Barça</h5>
                <div className="meta">Empieza a las 21:00h</div>
                <div className="odds">
                  <span className="odd is-hot">1 • 2.30</span>
                  <span className="odd">X • 3.20</span>
                  <span className="odd">2 • 3.10</span>
                </div>
              </div>
            </div>

            <div className="trend">
              <img
                className="cover"
                src="https://cdn.pixabay.com/photo/2017/09/07/09/58/basketball-2724391_640.png"
                alt="NBA"
              />
              <div className="body">
                <h5>NBA – Celtics vs Lakers</h5>
                <div className="meta">Madrugada 02:00h</div>
                <div className="odds">
                  <span className="odd">Celtics • 1.85</span>
                  <span className="odd is-hot">Lakers • 2.05</span>
                  <span className="odd">+220.5 • 1.90</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= ARTÍCULOS Y GUÍAS ======= */}
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container-neo">
          <div className="section-title">
            <h3>Artículos y guías</h3>
            <Link className="link" to="/resources/guides">Ver todas</Link>
          </div>

          <div className="grid-3">
            <article className="article">
              <img
                src="https://cdn.pixabay.com/photo/2019/02/18/22/39/money-4005690_640.jpg"
                alt="Gestión banca"
              />
              <div className="pad">
                <span className="pill">Consejos</span>
                <h5>Cómo gestionar tu banca</h5>
                <p>Reglas básicas para no perder la cabeza en una racha mala.</p>
                <a
                  href="https://www.apuestas-deportivas.es/guia-de-apuestas/como-sobrellevar-una-mala-racha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Leer más
                </a>
              </div>
            </article>

            <article className="article">
              <img
                src="https://cdn.pixabay.com/photo/2014/12/14/16/05/arm-wrestling-567950_1280.jpg"
                alt="Valor cuota"
              />
              <div className="pad">
                <span className="pill">Estrategia</span>
                <h5>¿Qué es el valor de una cuota?</h5>
                <p>Aprende a identificar apuestas con valor y evitar trampas.</p>
                <a
                  href="https://apuestas.marathonbet.es/glosario-apuestas/que-es-una-cuota-como-se-calcula/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Leer más
                </a>
              </div>
            </article>

            <article className="article">
              <img
                src="https://cdn.pixabay.com/photo/2022/07/09/22/31/kobe-7311832_1280.png"
                alt="NBA guía"
              />
              <div className="pad">
                <span className="pill">Guía</span>
                <h5>NBA para principiantes</h5>
                <p>Mercados típicos, ritmos, back-to-back y cómo empezar.</p>
                <a
                  href="https://spain.id.nba.com/noticias/nba-que-es-como-funciona"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Leer más
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default Home;
