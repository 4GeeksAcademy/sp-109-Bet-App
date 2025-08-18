// src/front/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import { FaFutbol, FaSearch, FaUser, FaBolt } from "react-icons/fa";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const Home = () => {
  const { user } = useAuth();

  const displayName = user?.username || user?.name || user?.first_name || "amigo";
  const avatar = user?.url_image || "https://i.pravatar.cc/240?img=4";

  return (
    <div className="home-neo-scope">
      {/* NAV superior Bet APP */}
      <SoftRibbonNav />

      {/* Fondo artístico global difuminado */}
      <div className="bg-art" aria-hidden="true"></div>

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
        }

        .home-neo-scope{
          position:relative;
          min-height:100dvh;
          background:
            radial-gradient(1600px 700px at 6% -20%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 520px at 96% 0%, #e6f9ff 0%, transparent 55%),
            linear-gradient(#fff,#fff);
        }
        .home-neo-scope .bg-art{
          position:fixed; inset:0; pointer-events:none;
          background-image:url(${heroArt});
          background-size:cover; background-position:center;
          filter: blur(18px) saturate(1.05) contrast(1.04);
          opacity:.18; z-index:0;
        }
        .home-neo-scope .content{ position:relative; z-index:1; }

        /* Oculta solo los botones del template de demo, no nuestro ribbon */
        .navbar .btn,
        .navbar .btn-group,
        nav.navbar + .container .btn,
        nav.navbar + .container .btn-group,
        .template-links { display: none !important; }

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
          transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
        }
        .btn-brand:hover{ filter:brightness(1.06); transform:translateY(-1px); }
        .btn-ghost{
          border:1px solid #e7ecf3; color:#20314d; font-weight:700;
          padding:.85rem 1.2rem; border-radius:12px; text-decoration:none;
          background:#fff; box-shadow:0 8px 24px rgba(15,23,42,.06);
          transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
        }
        .btn-ghost:hover{ transform:translateY(-1px); }

        /* Tarjeta principal del hero */
        .hero-card{
          border-radius:22px; overflow:hidden;
          position:relative;
          border:1px solid #edf1f6;
          box-shadow:0 28px 80px rgba(15,23,42,.16);
          display:flex;
          flex-direction:column;
          background:#fff;
        }
        .hero-card img{ width:100%; height:360px; object-fit:cover; display:block; }

        /* Franja de texto bajo la imagen */
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

      <div className="content">
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
                alt="Perrete sentado"
              />
              <div className="hero-caption">
                <FaBolt className="ico" />
                ¿Cuánto tiempo aguanta sentado? ¡Apuesta!
              </div>
            </div>
          </div>
        </section>

        {/* ======= PROMOS (RETOS) ======= */}
        <section className="section">
          <div className="container-neo">
            <div className="section-title">
              <h3>¿Quién se anima a superarlo?</h3>
              <span className="muted">Retos</span>
            </div>

            <div className="grid-3">
              <div className="promo">
                <img
                  className="thumb"
                  src="https://cdn.pixabay.com/photo/2024/05/06/17/06/french-fries-8743802_640.jpg"
                  alt="Reto de comida"
                />
                <div>
                  <span className="tag-ads">Récord</span>
                  <h5>40 hamburguesas en 10 minutos</h5>
                  <p>¿Os atrevéis con el récord del mundo?</p>
                </div>
              </div>

              <div className="promo">
                <img
                  className="thumb"
                  src="https://cdn.pixabay.com/photo/2020/04/19/18/46/company-5064997_1280.jpg"
                  alt="Oficina"
                />
                <div>
                  <span className="tag-ads">Puntualidad</span>
                  <h5>¿Llegas a la oficina puntual?</h5>
                  <p>Una apuesta para ver quién es el primero que llega tarde a la ofi…</p>
                </div>
              </div>

              <div className="promo">
                <img
                  className="thumb"
                  src="https://cdn.pixabay.com/photo/2015/10/03/21/58/sport-970443_640.jpg"
                  alt="Carrera popular"
                />
                <div>
                  <span className="tag-ads">10 K</span>
                  <h5>¿Nos hacemos una 10 K?</h5>
                  <p>¿Nos apostamos algo a quién hace mejor tiempo en la 10 K?</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======= TENDENCIAS HOY ======= */}
        <section className="section">
          <div className="container-neo">
            <div className="section-title">
              <h3>¿Prefieres una apuesta clásica?</h3>
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
                  <div className="meta">Empieza a las 21:00 h</div>
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
                  <div className="meta">02:00 h</div>
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
              <Link className="link" to="/guides">Ver todas</Link>
            </div>

            <div className="grid-3">
              <article className="article">
                <img
                  src="https://cdn.pixabay.com/photo/2018/05/30/08/45/smilie-3441012_640.jpg"
                  alt="Felicidad"
                />
                <div className="pad">
                  <span className="pill">Consejos</span>
                  <h5>Cómo ser feliz hoy en día</h5>
                  <p>10 reglas básicas para ser feliz en el día a día.</p>
                  <a
                    href="https://www.cigna.com/es-us/knowledge-center/how-to-be-happy"
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
                  src="https://cdn.pixabay.com/photo/2017/06/28/18/45/fireworks-2451749_640.jpg"
                  alt="Fiestas populares"
                />
                <div className="pad">
                  <span className="pill">Fiestas</span>
                  <h5>Las mejores fiestas de España</h5>
                  <p>Vive las mejores fiestas de España y disfruta a lo grande.</p>
                  <a
                    href="https://www.holidayguru.es/revista-de-viajes/las-10-mejores-fiestas-populares-de-espaa/"
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
                  <p>Mercados típicos, ritmo, back-to-back y cómo empezar.</p>
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
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default Home;
