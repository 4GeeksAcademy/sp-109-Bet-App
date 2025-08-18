// src/front/pages/LandingPreview.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import heroArt from "../../../docs/assets/img/curved11.jpg";
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";

export const LandingPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-preview-scope">
      {/* Barra Soft-UI tipo “ribbon” con nuestros enlaces */}
      <SoftRibbonNav />

      <style>{`

:root{
  --su-primary:#cb0c9f;
  --su-info:#17c1e8;
  --su-dark:#0f1b33;
  --su-secondary:#8796a8;
  --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
}

/* Ocultar créditos / docs solo en esta vista */
a[href*="4geeks"], a[href*="4Geeks"], a[href*="template"], a[href*="docs"]{ display:none !important; }
footer .made-with, .template-links, .footer-credit{ display:none !important; }


  .navbar, .navbar * { display:none !important; }

  /* Si quedara algún botón suelto que apunte a "/" (Home),
     lo ocultamos pero dejando visible el brand del ribbon */
  a[href="/"]:not(.soft-brand) { display:none !important; }


.hero-gradient{
  background:
    radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
    radial-gradient(900px 500px at 92% 0%, #e5f9ff 0%, transparent 55%),
    linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
}
.badge-soft{ background:#f6e9f3; color:#cb0c9f; }
.gradient-text{
  background: linear-gradient(90deg, var(--su-info), var(--su-primary));
  -webkit-background-clip:text; background-clip:text;
  -webkit-text-fill-color:transparent; color:transparent;
}
.btn-brand{
  background-image: var(--su-gradient);
  border:0; color:#fff;
  box-shadow:0 8px 24px rgba(203,12,159,.35);
}
.btn-brand:hover{ filter:brightness(1.03); transform:translateY(-1px); }


.oblique-card{
  position: relative;
  height: 560px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 36px 120px rgba(15,23,42,.22);
  clip-path: polygon(8% 0%, 100% 0%, 100% 100%, 24% 100%, 0% 155%, 0% 122%);
  background:#fff;
}
.oblique-card img{
  position:absolute; inset:-18% -18%;
  width:136%; height:136%;
  object-fit:cover; object-position:center;
  transform:skewX(14deg) translateX(-8%) scale(1.04);
  filter:saturate(1.06) contrast(1.04);
}
@media (max-width: 991.98px){ .oblique-card{ height: 380px; } }


.soft-card{ border:0; border-radius:1.25rem; box-shadow:0 12px 40px rgba(15,23,42,.08); }


.card-photo{
  border-radius:18px;
  border:0 !important;
  background:#fff;
  box-shadow:0 16px 40px rgba(0,0,0,.12); /* sombra negra sutil */
  overflow:hidden;
}

.card-photo .top-photo{
  border-radius:16px;
  width:100%; height:200px; object-fit:cover; object-position:center 45%;
}

.badge-floating{
  position:absolute; top:-14px; left:18px;
  background:#fff; padding:.35rem .8rem; border-radius:999px;
  box-shadow:0 8px 20px rgba(0,0,0,.10);
  font-weight:600; color:#8a2be2;
  border:0;
}
/* Por si Bootstrap añade borde a .card */
.card{ border: 0 !important; }


.t-card{
  border-radius:22px;
  background: radial-gradient(120% 100% at 0% 0%, #192447 0%, #0f1b33 60%);
  color:#e8eef7;
  box-shadow:0 28px 80px rgba(15,23,42,.35);
}
.t-card .media{ border-radius:18px; overflow:hidden; background:#0c1630; }
.t-img{
  display:block; width:auto; max-width:100%;
  height:220px; object-fit:cover; object-position:center 20%; border-radius:16px;
}
.t-stats small{ color:#9fb0c6; }


.dot{
  width:36px; height:36px; border-radius:999px;
  background-image:var(--su-gradient);
  box-shadow:0 8px 24px rgba(203,12,159,.3);
}
.bullet h6{ color:#20314d; margin:0; }
.bullet p{ color:#6b7c90; margin:0; }


.section{ padding-top:2.5rem; padding-bottom:3rem; }
/* Más respiro ANTES del bloque “Más que apuestas” */
.bullets-gap{ margin-top: 2.75rem; }


      `}</style>

      
      <section className="hero-gradient py-5 py-lg-6">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge badge-soft rounded-pill mb-3"></span>
              <h1 className="display-5 fw-bold mb-3" style={{ color:"#243b55" }}>
                La forma más fácil de organizar{" "}
                <span className="gradient-text">salas de juegos y apuestas</span>.
              </h1>
              <p className="lead" style={{ color:"var(--su-secondary)" }}>
                Crea una <strong>sala privada</strong>, invita a tus amigos, monta apuestas
                <strong> (deportivas clásicas o personalizadas)</strong> y conversa en el mismo
                sitio. Rápido, claro y con estilo.
              </p>

              <div className="d-flex flex-wrap gap-2 mt-3">
                <button className="btn btn-brand btn-lg" onClick={() => navigate("/login")}>
                  Log In
                </button>
                <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate("/create")}>
                  Sign Up
                </button>
                
              </div>
            </div>

            <div className="col-lg-6">
              <div className="oblique-card" aria-label="Hero image">
                <img src={heroArt} alt="Hero abstract" />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge rounded-pill" style={{ background:"#e6f9ff", color:"#06b6d4" }}>
              Cómo funciona
            </span>
            <h2 className="fw-bold mt-2" style={{ color:"#20314d" }}>En 3 pasos</h2>
            <p style={{ color:"#6b7c90" }}>Tan simple que no necesitas manual.</p>
          </div>

          <div className="row g-4 align-items-stretch">
            
            <div className="col-lg-4">
              <div className="card h-100 position-relative card-photo">
                <img
                  className="top-photo"
                  src="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop"
                  alt="Crear tu playground"
                />
                <div className="p-3 p-md-4">
                  <h5 className="fw-semibold" style={{ color:"#20314d" }}>Crea tu playground</h5>
                  <p className="mb-0" style={{ color:"#6b7c90" }}>
                    Ponle nombre, imagen y descripción. Todo privado para tu grupo.
                  </p>
                </div>
              </div>
            </div>

            
            <div className="col-lg-4">
              <div className="card h-100 position-relative card-photo">
                <img
                  className="top-photo"
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt="Invitar amigos"
                  style={{ objectPosition: "center 35%" }}
                  onError={(e) => {
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="p-3 p-md-4">
                  <h5 className="fw-semibold" style={{ color:"#20314d" }}>Invita amigos</h5>
                  <p className="mb-0" style={{ color:"#6b7c90" }}>
                    Búscalos por usuario o email y envía invitación al instante.
                  </p>
                </div>
              </div>
            </div>

            
            <div className="col-lg-4">
              <div className="card h-100 position-relative card-photo">
                <span className="badge-floating">¡También de todo un poco!</span>
                <img
                  className="top-photo"
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
                  alt="Fiesta / brindis"
                />
                <div className="p-3 p-md-4">
                  <h5 className="fw-semibold" style={{ color:"#20314d" }}>Apuesta y conversa</h5>
                  <p className="mb-0" style={{ color:"#6b7c90" }}>
                    Fútbol, tenis… o quién llega más tarde a la oficina, quién bebe más tequila o
                    quién aguanta sin mirar el móvil. ¡La imaginación es el límite!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="section pt-0">
        <div className="container">
          <div className="t-card p-4 p-md-5">
            <div className="row g-4 align-items-center">
              <div className="col-md-4">
                <div className="media d-flex justify-content-center">
                  <img
                    className="t-img"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                    alt="Michael"
                    style={{ objectPosition:"center 20%"}}
                  />
                </div>
              </div>
              <div className="col-md-8">
                <p className="mb-3" style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
                  <span style={{ color:"#ff6ad5", fontSize:28, marginRight:8 }}>“</span>
                  Si no puedes decidirte, elige lo que os haga reír más. Con esta app organizamos las porras del finde y también locuras como
                  “quién trae churros el lunes”.
                  <span style={{ color:"#ff6ad5", fontSize:28, marginLeft:6 }}>”</span>
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap t-stats">
                  <strong>Michael</strong> — Product Manager
                  <span style={{ color:"#ffd86b" }}>★★★★★</span>
                </div>
                <div className="row g-4 mt-2 t-stats">
                  <div className="col-4"><div className="h5 mb-0">+1.3M</div><small>Apuestas creadas</small></div>
                  <div className="col-4"><div className="h5 mb-0">98%</div><small>Usuarios felices</small></div>
                  <div className="col-4"><div className="h5 mb-0">24/7</div><small>Diversión</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="section pt-4">
        <div className="container">
          <div className="t-card p-4 p-md-5 mb-4">
            <div className="row g-4 align-items-center">
              <div className="col-md-8 order-2 order-md-1">
                <p className="mb-3" style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
                  <span style={{ color:"#ff6ad5", fontSize:28, marginRight:8 }}>“</span>
                  En mi equipo votamos quién trae café, quién falla menos en la porra y hasta retos absurdos.
                  Las salas privadas mantienen el buen rollo y todo queda organizado en un solo sitio.
                  <span style={{ color:"#ff6ad5", fontSize:28, marginLeft:6 }}>”</span>
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap t-stats">
                  <strong>Javier</strong> — Data Analyst
                  <span style={{ color:"#ffd86b" }}>★★★★★</span>
                </div>
                <div className="row g-4 mt-2 t-stats">
                  <div className="col-4"><div className="h5 mb-0">+650K</div><small>Retos creados</small></div>
                  <div className="col-4"><div className="h5 mb-0">4.9/5</div><small>Valoración media</small></div>
                  <div className="col-4"><div className="h5 mb-0">100%</div><small>Buen ambiente</small></div>
                </div>
              </div>
              <div className="col-md-4 order-1 order-md-2">
                <div className="media d-flex justify-content-center">
                  <img
                    className="t-img"
                    src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1000&auto=format&fit=crop"
                    alt="Javier"
                    style={{ objectPosition:"center 35%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div className="row g-4 bullets-gap">
            <div className="col-lg-5">
              <h3 className="mb-2" style={{ color:"#cb0c9f" }}>Más que apuestas</h3>
              <h2 className="fw-bold" style={{ color:"#20314d" }}>Lo importante</h2>
              <p style={{ color:"#6b7c90" }}>
                Mantén el buen ambiente del grupo con dinámicas divertidas y reglas claras.
                Nosotros ponemos la estructura, vosotros ponéis las risas.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="d-flex align-items-start gap-3 bullet mb-3">
                <div className="dot"></div>
                <div>
                  <h6>Pequeños retos, gran comunidad</h6>
                  <p>Café del lunes, quien llega último o porras semanales. Todo suma.</p>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3 bullet mb-3">
                <div className="dot"></div>
                <div>
                  <h6>Privado y organizado</h6>
                  <p>Invitaciones, opciones, fechas y chat en el mismo sitio.</p>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3 bullet">
                <div className="dot"></div>
                <div>
                  <h6>Hecho para reír</h6>
                  <p>Si dudas, elige lo que haga reír más. Ese es el plan 😉</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <SiteFooter />
    </div>
  );
};

export default LandingPreview;
