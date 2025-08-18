import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export default function LegalCookies() {
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cookiePrefs") || "{}");
      return {
        functional: true,               
        analytics: !!saved.analytics,   
        marketing: !!saved.marketing,   
      };
    } catch {
      return { functional: true, analytics: false, marketing: false };
    }
  });

  useEffect(() => {
    
  }, []);

  const savePrefs = () => {
    localStorage.setItem("cookiePrefs", JSON.stringify({
      analytics: prefs.analytics,
      marketing: prefs.marketing,
    }));
    alert("Preferencias guardadas.");
  };

  const acceptAll = () => {
    const next = { ...prefs, analytics: true, marketing: true };
    setPrefs(next);
    localStorage.setItem("cookiePrefs", JSON.stringify({ analytics: true, marketing: true }));
    alert("Has aceptado todas las cookies no esenciales.");
  };

  const rejectNonEssential = () => {
    const next = { ...prefs, analytics: false, marketing: false };
    setPrefs(next);
    localStorage.setItem("cookiePrefs", JSON.stringify({ analytics: false, marketing: false }));
    alert("Has rechazado las cookies no esenciales.");
  };

  return (
    <div className="legal-cookies-scope">
      <SoftRibbonNav />

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-gradient: linear-gradient(310deg,#7928CA,#FF0080);
        }

        /* Lienzo + arte difuminado */
        .legal-cookies-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1500px 650px at 7% -15%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 540px at 98% -10%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .legal-cookies-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.14;
        }
        .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

        /* Oculta botones/links del template en esta vista */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn, nav.navbar + .container .btn-group,
        .template-links { display:none !important; }

        /* ===== HERO ===== */
        .hero{
          padding:38px 0 20px; background:transparent;
        }
        .chip{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.35rem .75rem; border-radius:999px; font-weight:800; font-size:.9rem;
          background:#f6e9f3; color:#cb0c9f; border:1px solid #f0d7e7;
          box-shadow:0 8px 20px rgba(203,12,159,.12);
        }
        .title{
          margin:.5rem 0 .4rem;
          color:#20314d; font-weight:900; letter-spacing:.2px;
        }
        .muted{ color:var(--su-muted); }
        .last-update{ color:#8aa0b6; }

        /* ===== CARDS ===== */
        .card-soft{
          border:1px solid rgba(255,255,255,.6);
          border-radius:20px; background:#fff;
          box-shadow:0 18px 55px rgba(15,23,42,.12);
        }
        .card-soft h5{ color:#20314d; font-weight:800; }
        .card-soft p, .card-soft li{ color:var(--su-muted); }

        /* ===== TOGGLES ===== */
        .pref-row{
          display:flex; align-items:center; justify-content:space-between;
          gap:12px; padding:10px 0; border-bottom:1px dashed #eef2f7;
        }
        .pref-row:last-child{ border-bottom:0; }
        .toggle{
          width:48px; height:28px; border-radius:999px; position:relative;
          background:#e4e8f1; transition:.22s; cursor:pointer; display:inline-block;
          box-shadow: inset 0 0 0 1px #dbe2ee;
        }
        .toggle.on{ background:#b39afc; }
        .dot{
          position:absolute; top:3px; left:3px; width:22px; height:22px; background:#fff;
          border-radius:50%; transition:.22s; box-shadow:0 2px 6px rgba(15,23,42,.2);
        }
        .toggle.on .dot{ left:23px; }

        /* Botones */
        .btn{ border-radius:12px; font-weight:800; }
        .btn-brand{
          background-image: var(--su-gradient); border:0; color:#fff;
          box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
        .btn-outline-success{ border-color:#c6f6d5; }
        .btn-outline-danger{ border-color:#fecaca; }

        /* ===== TABLA ===== */
        .table-wrap{
          border:1px solid #edf1f6; border-radius:16px; overflow:hidden;
          box-shadow:0 10px 28px rgba(15,23,42,.06);
        }
        table.cookies{ width:100%; border-collapse:collapse; background:#fff; }
        table.cookies thead th{
          background:#f7f9fe; color:#20314d; font-weight:800; font-size:.95rem;
          padding:.8rem 1rem; border-bottom:1px solid #e8eef8;
        }
        table.cookies td{
          padding:.75rem 1rem; border-bottom:1px solid rgba(15,23,42,.06);
          vertical-align:top; color:#6b7c90;
        }
        table.cookies tbody tr:nth-child(2n){ background:#fcfdff; }
        code{ background:#f4f6fb; border:1px solid #eef2f7; border-radius:6px; padding:.05rem .3rem; }

        /* CTA inferior */
        .cta{ margin-top: 1rem; }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      
      <section className="hero">
        <div className="container-neo">
          <span className="chip">Legal</span>
          <h1 className="display-6 title">Política de Cookies</h1>
          <p className="lead muted m-0">
            Te explicamos qué cookies usamos, para qué sirven y cómo puedes gestionarlas.
          </p>
          <small className="last-update d-block mt-2">
            Última actualización: {new Date().toLocaleDateString()}
          </small>
        </div>
      </section>

      
      <section className="content">
        <div className="container-neo">
          <div className="card-soft p-4 p-md-5">
            <div className="row g-4">
              
              <div className="col-12 col-lg-6">
                <h5 className="mb-2">¿Qué son las cookies?</h5>
                <p>
                  Las cookies son pequeños archivos que se almacenan en tu dispositivo para
                  recordar información cuando navegas. En Playgrounds & Bets usamos cookies
                  técnicas para que la app funcione y, de forma opcional, cookies para
                  analítica agregada y/o marketing (que puedes activar o desactivar).
                </p>

                <h5 className="mt-4 mb-2">Tipos de cookies que usamos</h5>
                <ul className="mb-0">
                  <li><strong>Técnicas/funcionales (siempre activas):</strong> imprescindibles para autenticación, seguridad y funcionamiento básico.</li>
                  <li><strong>Analítica agregada (opcional):</strong> nos ayuda a entender el uso de la app de manera anónima para mejorarla.</li>
                  <li><strong>Marketing (opcional):</strong> orientadas a comunicaciones personalizadas. No usamos por defecto.</li>
                </ul>
              </div>

              
              <div className="col-12 col-lg-6">
                <h5 className="mb-2">Gestión de preferencias</h5>

                <div className="pref-row">
                  <div>
                    <div className="fw-semibold">Técnicas/funcionales</div>
                    <small className="muted">Necesarias para que el sitio funcione</small>
                  </div>
                  <div className="toggle on" title="Siempre activas">
                    <div className="dot" />
                  </div>
                </div>

                <div className="pref-row">
                  <div>
                    <div className="fw-semibold">Analítica agregada</div>
                    <small className="muted">Mejora del producto (anónima)</small>
                  </div>
                  <div
                    className={`toggle ${prefs.analytics ? "on" : ""}`}
                    onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                    role="button" aria-label="Cambiar preferencia analítica"
                  >
                    <div className="dot" />
                  </div>
                </div>

                <div className="pref-row">
                  <div>
                    <div className="fw-semibold">Marketing</div>
                    <small className="muted">Comunicaciones personalizadas</small>
                  </div>
                  <div
                    className={`toggle ${prefs.marketing ? "on" : ""}`}
                    onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                    role="button" aria-label="Cambiar preferencia marketing"
                  >
                    <div className="dot" />
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button className="btn btn-brand" onClick={savePrefs}>Guardar preferencias</button>
                  <button className="btn btn-outline-success" onClick={acceptAll}>Aceptar todo</button>
                  <button className="btn btn-outline-danger" onClick={rejectNonEssential}>Rechazar no esenciales</button>
                </div>
              </div>

              
              <div className="col-12">
                <h5 className="mt-2 mt-lg-4 mb-2">Cookies que podrías encontrar</h5>
                <div className="table-wrap">
                  <table className="cookies">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Proveedor</th>
                        <th>Finalidad</th>
                        <th>Duración</th>
                        <th>Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>pg_session</code></td>
                        <td>Playgrounds & Bets</td>
                        <td>Autenticación de usuario y seguridad</td>
                        <td>Sesión</td>
                        <td>Técnica</td>
                      </tr>
                      <tr>
                        <td><code>pg_pref_lang</code></td>
                        <td>Playgrounds & Bets</td>
                        <td>Recordar idioma / preferencias</td>
                        <td>6 meses</td>
                        <td>Funcional</td>
                      </tr>
                      <tr>
                        <td><code>_pg_analytics</code></td>
                        <td>Playgrounds & Bets</td>
                        <td>Métricas agregadas de uso (anónimo)</td>
                        <td>13 meses</td>
                        <td>Analítica</td>
                      </tr>
                      <tr>
                        <td><code>_pg_marketing</code></td>
                        <td>Playgrounds & Bets</td>
                        <td>Mensajes y campañas personalizadas</td>
                        <td>6 meses</td>
                        <td>Marketing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <small className="muted d-block mt-2">
                  * Ejemplos indicativos. La lista real puede variar por mejoras técnicas.
                </small>
              </div>

              
              <div className="col-12 col-md-6">
                <h5 className="mb-2">Cómo deshabilitar cookies en tu navegador</h5>
                <p className="muted">
                  Puedes bloquear o eliminar cookies desde la configuración de tu navegador.
                  Consulta la ayuda de Chrome, Firefox, Edge o Safari para instrucciones
                  detalladas. Ten en cuenta que desactivar cookies técnicas puede impedir
                  el funcionamiento de la app.
                </p>
              </div>
              <div className="col-12 col-md-6">
                <h5 className="mb-2">Contacto</h5>
                <p className="muted">
                  Dudas sobre esta política:{" "}
                  <a href="mailto:hola@playbets.app">hola@playbets.app</a> o la página de{" "}
                  <Link to="/company/contact">Contacto</Link>.
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4 cta">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                ← Volver
              </button>
              <Link to="/legal/privacy" className="btn btn-outline-primary">
                Ver Privacidad
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
