import React from "react";
import { Link, useNavigate } from "react-router-dom";


import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export default function LegalPrivacy() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="legal-privacy-scope">
      <SoftRibbonNav />

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-gradient: linear-gradient(310deg,#7928CA,#FF0080);
        }

        /* Lienzo con arte difuminado */
        .legal-privacy-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1500px 650px at 7% -15%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 540px at 98% -10%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .legal-privacy-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.14;
        }
        .legal-privacy-scope .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

        /* Oculta botones/links del template en esta vista */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn, nav.navbar + .container .btn-group,
        .template-links { display:none !important; }

        /* ===== HERO ===== */
        .hero{
          padding:38px 0 20px;
          background: transparent;
        }
        .chip{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.35rem .75rem; border-radius:999px; font-weight:800; font-size:.9rem;
          background:#f6e9f3; color:#cb0c9f; border:1px solid #f0d7e7;
          box-shadow:0 8px 20px rgba(203,12,159,.12);
        }
        .title{
          margin:.5rem 0 .4rem;
          background: linear-gradient(90deg, var(--su-info), var(--su-primary));
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
          font-weight:900; letter-spacing:.2px;
        }
        .muted{ color:var(--su-muted); }
        .last-update{ color:#8aa0b6; }

        /* Índice rápido */
        .toc{ display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.75rem; }
        .link-chip{
          display:inline-flex; align-items:center; gap:.4rem;
          padding:.35rem .7rem; border-radius:999px; font-weight:700; font-size:.9rem;
          background:#fff; color:#20314d; border:1px solid #e9edf6;
          box-shadow:0 8px 18px rgba(15,23,42,.06); text-decoration:none;
        }
        .link-chip:hover{ transform:translateY(-1px); }

        /* ===== CONTENIDO ===== */
        .section{ padding:1.2rem 0 2.4rem; }
        .card-soft{
          border:1px solid rgba(255,255,255,.6);
          border-radius:20px; background:#fff;
          box-shadow:0 18px 55px rgba(15,23,42,.12);
        }
        .card-soft h5{ color:#20314d; font-weight:800; }
        .card-soft p, .card-soft li{ color:var(--su-muted); }
        .card-soft ul{ padding-left:1.1rem; }

        /* Botones */
        .btn{ border-radius:12px; font-weight:800; }
        .btn-brand{
          background-image: var(--su-gradient);
          border:0; color:#fff;
          box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      
      <section className="hero">
        <div className="container-neo">
          <span className="chip">Legal</span>
          <h1 className="display-6 title">Política de Privacidad</h1>
          <p className="lead muted m-0">
            Cómo recopilamos, usamos y protegemos tu información en Playgrounds & Bets.
          </p>
          <small className="last-update d-block mt-2">
            Última actualización: {today}
          </small>

          
          <nav className="toc" aria-label="Índice rápido">
            {[
              ["#datos","Datos que recopilamos"],
              ["#uso","Cómo usamos tus datos"],
              ["#base","Base legal (RGPD)"],
              ["#conservacion","Conservación"],
              ["#cesiones","Cesiones y encargados"],
              ["#derechos","Tus derechos"],
              ["#cookies","Cookies"],
              ["#seguridad","Seguridad"],
              ["#menores","Menores"],
              ["#cambios","Cambios"],
              ["#contacto","Contacto"],
            ].map(([href,label])=>(
              <a key={href} className="link-chip" href={href}>{label}</a>
            ))}
          </nav>
        </div>
      </section>

      
      <section className="section content">
        <div className="container-neo">
          <div className="card-soft p-4 p-md-5">
            <div className="row g-4">
              <div className="col-12">
                <h5 id="datos">Datos que recopilamos</h5>
                <p className="muted">
                  Recopilamos información que nos proporcionas al crear una cuenta o usar
                  la app, como nombre, email, avatar/foto y preferencias. También
                  registramos de forma automática datos técnicos básicos (IP, dispositivo,
                  navegador) para seguridad y rendimiento.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 id="uso">Cómo usamos tus datos</h5>
                <ul className="muted mb-0">
                  <li>Proveer el servicio (salas privadas, apuestas y chats).</li>
                  <li>Autenticación, soporte y prevención de fraude.</li>
                  <li>Mejora de la experiencia y métricas agregadas.</li>
                  <li>Envío de notificaciones esenciales (no marketing intrusivo).</li>
                </ul>
              </div>

              <div className="col-12 col-md-6">
                <h5 id="base">Base legal (RGPD)</h5>
                <ul className="muted mb-0">
                  <li>Ejecución de contrato (prestación del servicio).</li>
                  <li>Interés legítimo (seguridad, analítica agregada).</li>
                  <li>Consentimiento (opciones que tú aceptes explícitamente).</li>
                </ul>
              </div>

              <div className="col-12 col-lg-6">
                <h5 id="conservacion">Conservación</h5>
                <p className="muted">
                  Mantenemos los datos el tiempo necesario para el uso previsto y por los
                  plazos exigidos por ley. Podrás solicitar la supresión cuando proceda.
                </p>
              </div>

              <div className="col-12 col-lg-6">
                <h5 id="cesiones">Cesiones y encargados</h5>
                <p className="muted">
                  No vendemos tus datos. Podemos apoyarnos en proveedores
                  (almacenamiento, email, analítica agregada) con contratos de
                  tratamiento adecuados y ubicados en regiones con garantías.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 id="derechos">Tus derechos</h5>
                <ul className="muted mb-0">
                  <li>Acceso, rectificación y supresión.</li>
                  <li>Limitación u oposición al tratamiento.</li>
                  <li>Portabilidad de datos.</li>
                  <li>Retirar el consentimiento en cualquier momento.</li>
                </ul>
              </div>

              <div className="col-12 col-md-6">
                <h5 id="cookies">Cookies</h5>
                <p className="muted">
                  Usamos cookies técnicas para el funcionamiento y, en su caso, de
                  medición agregada. Puedes ampliar en{" "}
                  <Link to="/legal/cookies">nuestra política de cookies</Link>.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 id="seguridad">Seguridad</h5>
                <p className="muted">
                  Aplicamos medidas razonables de seguridad (cifrado en tránsito, controles
                  de acceso y auditoría) para proteger tu información frente a accesos no
                  autorizados.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 id="menores">Menores</h5>
                <p className="muted">
                  El servicio está orientado a mayores de 16 años (o edad equivalente según
                  normativa local). Si detectamos cuentas de menores sin consentimiento
                  válido, procederemos a su eliminación.
                </p>
              </div>

              <div className="col-12">
                <h5 id="cambios">Cambios</h5>
                <p className="muted">
                  Podremos actualizar esta política. Publicaremos la versión vigente y la
                  fecha de última modificación. Los cambios sustanciales se comunicarán de
                  forma destacada.
                </p>
              </div>

              <div className="col-12">
                <h5 id="contacto">Contacto</h5>
                <p className="muted mb-0">
                  Para ejercer derechos o resolver dudas:{" "}
                  <a href="mailto:hola@playbets.app">hola@playbets.app</a> o desde{" "}
                  <Link to="/company/contact">Contacto</Link>.
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                ← Volver
              </button>
              <Link to="/company/contact" className="btn btn-brand">
                Enviar consulta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
