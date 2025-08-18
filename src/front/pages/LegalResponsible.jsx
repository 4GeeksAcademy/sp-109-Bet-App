// src/front/pages/LegalResponsible.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* Solo visual extra (nav, footer y arte de fondo difuminado) */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export default function LegalResponsible() {
  const navigate = useNavigate();

  // Preferencias DEMO guardadas localmente (no son vinculantes)
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("rg_prefs") || "{}");
      return {
        dailyLimit: saved.dailyLimit ?? 20,         // € por día (demo)
        cooldown: saved.cooldown ?? false,          // modo pausa
        cooldownHours: saved.cooldownHours ?? 24,   // duración pausa (h)
        lockedUntil: saved.lockedUntil ?? null,     // bloqueo emergencia hasta (timestamp)
      };
    } catch {
      return { dailyLimit: 20, cooldown: false, cooldownHours: 24, lockedUntil: null };
    }
  });

  const savePrefs = () => {
    localStorage.setItem("rg_prefs", JSON.stringify(prefs));
    alert("Preferencias de juego responsable guardadas (local).");
  };

  const quickLock = (hours = 24) => {
    const until = Date.now() + hours * 60 * 60 * 1000;
    const next = { ...prefs, lockedUntil: until };
    setPrefs(next);
    localStorage.setItem("rg_prefs", JSON.stringify(next));
    alert(`Se activó un bloqueo de ${hours}h en este dispositivo (demo).`);
  };

  const clearLock = () => {
    const next = { ...prefs, lockedUntil: null };
    setPrefs(next);
    localStorage.setItem("rg_prefs", JSON.stringify(next));
    alert("Bloqueo temporal desactivado (demo).");
  };

  const lockedActive =
    prefs.lockedUntil && Number(prefs.lockedUntil) > Date.now();

  useEffect(() => {
    // Aquí podrías deshabilitar botones de apostar si lockedActive == true
  }, [lockedActive]);

  return (
    <div className="legal-rg-scope">
      <SoftRibbonNav />

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-gradient: linear-gradient(310deg,#7928CA,#FF0080);
        }

        /* Lienzo + arte difuminado Soft-UI */
        .legal-rg-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1500px 650px at 7% -15%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 540px at 98% -10%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .legal-rg-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.14;
        }
        .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

        /* Ocultar botones/links del template superior en esta vista */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn, nav.navbar + .container .btn-group,
        .template-links { display:none !important; }

        /* ===== HERO ===== */
        .hero{
          padding:38px 0 12px; background:transparent;
        }
        .chip{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.35rem .75rem; border-radius:999px; font-weight:800; font-size:.9rem;
          background:#f6e9f3; color:#cb0c9f; border:1px solid #f0d7e7;
          box-shadow:0 8px 20px rgba(203,12,159,.12);
        }
        .title{
          margin:.5rem 0 .4rem; color:#20314d;
          font-weight:900; letter-spacing:.2px;
        }
        .muted{ color:var(--su-muted); }
        .last-update{ color:#8aa0b6; }

        /* Estado actual (bloqueo) */
        .state-pill{
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.4rem .7rem; border-radius:999px; font-weight:800; font-size:.85rem;
          border:1px solid #e9edf6; background:#fff; color:#20314d;
          box-shadow:0 8px 22px rgba(15,23,42,.06);
        }
        .dot{ width:10px;height:10px;border-radius:999px; display:inline-block; }
        .up{ background:#16a34a; }
        .warn{ background:#f59e0b; }
        .down{ background:#ef4444; }

        /* ===== CARD ===== */
        .card-soft{
          border:1px solid rgba(255,255,255,.6);
          border-radius:20px; background:#fff;
          box-shadow:0 18px 55px rgba(15,23,42,.12);
        }
        .card-soft h5{ color:#20314d; font-weight:800; }
        .card-soft p, .card-soft li{ color:var(--su-muted); }

        /* ===== CONTROLES ===== */
        .pref-wrap{ border:1px dashed #e8eef8; border-radius:16px; padding:12px; }
        .badge-pill{
          background:#eef1ff; color:#3b2d6b;
          border:1px solid #e0e5ff; border-radius:999px; padding:.2rem .6rem; font-weight:800;
          box-shadow:0 6px 16px rgba(15,23,42,.06);
        }

        .form-range{ accent-color:#a78bfa; }
        .form-range::-webkit-slider-thumb{ background:#a78bfa; }
        .form-range::-moz-range-thumb{ background:#a78bfa; }
        .form-range:focus{ outline:none; }

        .form-control{
          border-radius:12px; border:1px solid #e8eef8;
          box-shadow:0 6px 16px rgba(15,23,42,.06);
        }
        .form-control:focus{
          border-color:#bcd3ff; box-shadow:0 0 0 .22rem rgba(23,193,232,.2);
        }

        /* Botones */
        .btn{ border-radius:12px; font-weight:800; }
        .btn-brand{
          background-image: var(--su-gradient); border:0; color:#fff;
          box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
        .btn-outline-danger{ border-color:#fecaca; }
        .btn-outline-secondary{ border-color:#e7ecf3; }

        /* Tarjetas simples de recursos */
        .mini-card{
          border:1px solid #edf1f6; border-radius:14px; background:#fff;
          box-shadow:0 10px 28px rgba(15,23,42,.06);
        }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      {/* HERO */}
      <section className="hero">
        <div className="container-neo">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <span className="chip">Legal</span>
              <h1 className="display-6 title">Juego responsable</h1>
              <p className="lead muted m-0">
                Jugar es diversión. Si deja de serlo, para. Aquí tienes consejos, límites y recursos de ayuda.
              </p>
              <small className="last-update d-block mt-2">
                Última actualización: {new Date().toLocaleDateString()}
              </small>
            </div>

            <div className="state-pill mt-2">
              <span className={`dot ${lockedActive ? "down" : "up"}`} />
              {lockedActive ? (
                <>Bloqueo activo hasta {new Date(Number(prefs.lockedUntil)).toLocaleString()}</>
              ) : (
                <>Sin bloqueo activo</>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="content pb-4">
        <div className="container-neo">
          <div className="card-soft p-4 p-md-5">
            <div className="row g-4">
              {/* Principios + Señales */}
              <div className="col-12 col-lg-6">
                <h5 className="mb-2">Principios básicos</h5>
                <ul className="mb-3">
                  <li>La participación es solo para mayores de 18 años.</li>
                  <li>Establece un presupuesto previo y no lo superes.</li>
                  <li>Nunca persigas pérdidas: el juego no es una forma de ingresos.</li>
                  <li>Haz pausas frecuentes y separa el juego de tus obligaciones.</li>
                  <li>Si sientes que pierdes control, busca ayuda profesional.</li>
                </ul>

                <h5 className="mt-4 mb-2">Señales de alerta</h5>
                <ul className="mb-0">
                  <li>Juegas más tiempo o dinero del previsto.</li>
                  <li>Intentas recuperar pérdidas a cualquier precio.</li>
                  <li>Afecta a tu trabajo, estudios o relaciones.</li>
                  <li>Ocultas tu actividad o te sientes culpable tras jugar.</li>
                </ul>
              </div>

              {/* Controles DEMO */}
              <div className="col-12 col-lg-6">
                <h5 className="mb-2">Tus límites (este dispositivo)</h5>
                <p className="muted">
                  Estos controles son <strong>demostrativos</strong>. Guardamos tus preferencias en este dispositivo para recordarte tus límites.
                </p>

                <div className="pref-wrap mb-3">
                  <label className="form-label fw-semibold">Límite diario (€/día)</label>
                  <input
                    type="range"
                    className="form-range"
                    min={5}
                    max={200}
                    step={5}
                    value={prefs.dailyLimit}
                    onChange={(e) => setPrefs(p => ({ ...p, dailyLimit: Number(e.target.value) }))}
                  />
                  <span className="badge-pill"> {prefs.dailyLimit} € </span>
                </div>

                <div className="pref-wrap mb-3">
                  <div className="form-check form-switch">
                    <input
                      id="cooldown"
                      className="form-check-input"
                      type="checkbox"
                      checked={prefs.cooldown}
                      onChange={(e) => setPrefs(p => ({ ...p, cooldown: e.target.checked }))}
                    />
                    <label htmlFor="cooldown" className="form-check-label">
                      Activar “modo pausa” tras sesiones largas
                    </label>
                  </div>
                  {prefs.cooldown && (
                    <div className="mt-2">
                      <label className="form-label fw-semibold mb-1">Duración de pausa (horas)</label>
                      <input
                        type="number"
                        className="form-control"
                        min={1}
                        max={72}
                        value={prefs.cooldownHours}
                        onChange={(e) => setPrefs(p => ({ ...p, cooldownHours: Number(e.target.value) }))}
                        style={{maxWidth:160}}
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-brand" onClick={savePrefs}>Guardar preferencias</button>
                  {!lockedActive ? (
                    <>
                      <button className="btn btn-outline-danger" onClick={() => quickLock(24)}>
                        Bloqueo de emergencia 24h
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => quickLock(72)}>
                        Bloqueo 72h
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-outline-secondary" onClick={clearLock}>
                      Quitar bloqueo (demo)
                    </button>
                  )}
                </div>

                {lockedActive && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <strong>Bloqueo activo:</strong> no podrás jugar desde este dispositivo hasta{" "}
                    {new Date(Number(prefs.lockedUntil)).toLocaleString()} (modo demostración).
                  </div>
                )}
              </div>

              {/* Recursos de ayuda */}
              <div className="col-12">
                <h5 className="mt-3 mb-2">Recursos y ayuda</h5>
                <p className="muted mb-2">
                  Si necesitas hablar con alguien o buscas información especializada:
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mini-card p-3">
                      <div className="fw-semibold">Línea de ayuda (ejemplo)</div>
                      <div className="muted">Teléfono: 900 200 225</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mini-card p-3">
                      <div className="fw-semibold">Asociación local (ejemplo)</div>
                      <div className="muted">info@asociacion-ayuda.org</div>
                    </div>
                  </div>
                </div>
                <p className="muted mt-3 mb-0">
                  También puedes escribirnos a <a href="mailto:hola@playbets.app">hola@playbets.app</a> o usar la página de{" "}
                  <Link to="/company/contact">Contacto</Link>. Esto no reemplaza la asistencia profesional.
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                ← Volver
              </button>
              <Link to="/legal/cookies" className="btn btn-outline-primary">
                Ver Cookies
              </Link>
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
