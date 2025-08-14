// src/front/pages/LegalResponsible.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

        .form-range::-webkit-slider-thumb{ background:#a78bfa; }
        .badge-pill{ background:#eef; color:#3b2d6b; border-radius:999px; padding:.2rem .6rem; }
      `}</style>

      {/* HERO */}
      <section className="hero py-5">
        <div className="container">
          <span className="chip">Legal</span>
          <h1 className="display-6 fw-bold mt-2 title">Juego responsable</h1>
          <p className="lead muted m-0">
            Jugar es diversión. Si deja de serlo, para. Aquí tienes consejos, límites y recursos de ayuda.
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
              <div className="col-12 col-lg-6">
                <h5 className="title">Principios básicos</h5>
                <ul className="muted">
                  <li>La participación es solo para mayores de 18 años.</li>
                  <li>Establece un presupuesto previo y no lo superes.</li>
                  <li>Nunca persigas pérdidas: el juego no es una forma de ingresos.</li>
                  <li>Haz pausas frecuentes y separa el juego de tus obligaciones.</li>
                  <li>Si sientes que pierdes control, busca ayuda profesional.</li>
                </ul>

                <h5 className="title mt-4">Señales de alerta</h5>
                <ul className="muted">
                  <li>Juegas más tiempo o dinero del previsto.</li>
                  <li>Intentas recuperar pérdidas a cualquier precio.</li>
                  <li>Afecta a tu trabajo, estudios o relaciones.</li>
                  <li>Ocultas tu actividad o te sientes culpable tras jugar.</li>
                </ul>
              </div>

              {/* Controles DEMO */}
              <div className="col-12 col-lg-6">
                <h5 className="title">Tus límites (este dispositivo)</h5>
                <p className="muted">
                  Estos controles son **demostrativos**. Guardamos tus preferencias en este dispositivo para recordarte tus límites.
                </p>

                <div className="mb-3">
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

                <div className="mb-3">
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
                <h5 className="title mt-3">Recursos y ayuda</h5>
                <p className="muted mb-2">
                  Si necesitas hablar con alguien o buscas información especializada:
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 rounded border">
                      <div className="fw-semibold">Línea de ayuda (ejemplo)</div>
                      <div className="muted">Teléfono: 900 200 225</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded border">
                      <div className="fw-semibold">Asociación local (ejemplo)</div>
                      <div className="muted">info@asociacion-ayuda.org</div>
                    </div>
                  </div>
                </div>
                <p className="muted mt-3">
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
    </div>
  );
}
