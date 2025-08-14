// src/front/pages/LegalCookies.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LegalCookies() {
  const navigate = useNavigate();

  // Preferencias básicas guardadas en localStorage (demo)
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cookiePrefs") || "{}");
      return {
        functional: true,               // técnicas/estrictamente necesarias (siempre activas)
        analytics: !!saved.analytics,   // analítica agregada
        marketing: !!saved.marketing,   // marketing
      };
    } catch {
      return { functional: true, analytics: false, marketing: false };
    }
  });

  useEffect(() => {
    // Nada más por ahora; en una app real cargarías/activarías scripts según prefs.
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
    localStorage.setItem("cookiePrefs", JSON.stringify({
      analytics: true, marketing: true
    }));
    alert("Has aceptado todas las cookies no esenciales.");
  };

  const rejectNonEssential = () => {
    const next = { ...prefs, analytics: false, marketing: false };
    setPrefs(next);
    localStorage.setItem("cookiePrefs", JSON.stringify({
      analytics: false, marketing: false
    }));
    alert("Has rechazado las cookies no esenciales.");
  };

  return (
    <div className="legal-cookies-scope">
      <style>{`
        .hero{
          background:
            radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 500px at 92% 0%, #e5f9ff 0%, transparent 55%),
            linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
        }
        .chip{
          display:inline-block; padding:.35rem .75rem; border-radius:999px;
          font-weight:600; background:#f6e9f3; color:#cb0c9f; font-size:.9rem;
        }
        .title{ color:#20314d; }
        .muted{ color:#6b7c90; }
        .card-soft{
          border:0; border-radius:1.25rem; background:#fff;
          box-shadow:0 12px 40px rgba(15,23,42,.08);
        }
        .btn-brand{
          background-image: linear-gradient(310deg, #7928CA, #FF0080);
          border:0; color:#fff; box-shadow:0 8px 24px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }

        .toggle{
          width:46px; height:26px; border-radius:999px; position:relative;
          background:#e4e8f1; transition:.2s; cursor:pointer; display:inline-block;
        }
        .toggle.on{ background:#a78bfa; } /* lilac */
        .dot{
          position:absolute; top:3px; left:3px; width:20px; height:20px; background:#fff;
          border-radius:50%; transition:.2s; box-shadow:0 2px 6px rgba(15,23,42,.2);
        }
        .toggle.on .dot{ left:23px; }

        table.cookies{
          width:100%; border-collapse:collapse;
        }
        table.cookies th, table.cookies td{
          padding:.75rem 1rem; border-bottom:1px solid rgba(15,23,42,.06);
          vertical-align:top;
        }
        table.cookies th{ color:#20314d; font-weight:700; }
        table.cookies td{ color:#6b7c90; }
      `}</style>

      {/* HERO */}
      <section className="hero py-5">
        <div className="container">
          <span className="chip">Legal</span>
          <h1 className="display-6 fw-bold mt-2 title">Política de Cookies</h1>
          <p className="lead muted m-0">
            Te explicamos qué cookies usamos, para qué sirven y cómo puedes gestionarlas.
          </p>
          <small className="muted d-block mt-2">
            Última actualización: {new Date().toLocaleDateString()}
          </small>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="py-4">
        <div className="container">
          <div className="card-soft p-4 p-md-5">
            <div className="row g-4">
              <div className="col-12">
                <h5 className="title">¿Qué son las cookies?</h5>
                <p className="muted">
                  Las cookies son pequeños archivos que se almacenan en tu dispositivo para
                  recordar información cuando navegas. En Playgrounds & Bets usamos cookies
                  técnicas para que la app funcione y, de forma opcional, cookies para
                  analítica agregada y/o marketing (que puedes activar o desactivar).
                </p>
              </div>

              <div className="col-12 col-lg-6">
                <h5 className="title">Tipos de cookies que usamos</h5>
                <ul className="muted mb-0">
                  <li><strong>Técnicas/funcionales (siempre activas):</strong> imprescindibles para autenticación, seguridad y funcionamiento básico.</li>
                  <li><strong>Analítica agregada (opcional):</strong> nos ayuda a entender el uso de la app de manera anónima para mejorarla.</li>
                  <li><strong>Marketing (opcional):</strong> orientadas a comunicaciones personalizadas. No usamos por defecto.</li>
                </ul>
              </div>

              <div className="col-12 col-lg-6">
                <h5 className="title">Gestión de preferencias</h5>
                <div className="d-flex align-items-center justify-content-between py-2">
                  <div>
                    <div className="fw-semibold">Técnicas/funcionales</div>
                    <small className="muted">Necesarias para que el sitio funcione</small>
                  </div>
                  <div className={`toggle on`} title="Siempre activas">
                    <div className="dot" />
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between py-2">
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
                <div className="d-flex align-items-center justify-content-between py-2">
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
                  <button className="btn btn-brand" onClick={savePrefs}>
                    Guardar preferencias
                  </button>
                  <button className="btn btn-outline-success" onClick={acceptAll}>
                    Aceptar todo
                  </button>
                  <button className="btn btn-outline-danger" onClick={rejectNonEssential}>
                    Rechazar no esenciales
                  </button>
                </div>
              </div>

              <div className="col-12">
                <h5 className="title mt-2 mt-lg-4">Cookies que podrías encontrar</h5>
                <div className="table-responsive">
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
                        <td>Sessión</td>
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
                <h5 className="title">Cómo deshabilitar cookies en tu navegador</h5>
                <p className="muted">
                  Puedes bloquear o eliminar cookies desde la configuración de tu navegador.
                  Consulta la ayuda de Chrome, Firefox, Edge o Safari para instrucciones
                  detalladas. Ten en cuenta que desactivar cookies técnicas puede impedir
                  el funcionamiento de la app.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 className="title">Contacto</h5>
                <p className="muted">
                  Dudas sobre esta política:{" "}
                  <a href="mailto:hola@playbets.app">hola@playbets.app</a> o la página de{" "}
                  <Link to="/company/contact">Contacto</Link>.
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
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
    </div>
  );
}
