// src/front/pages/ResourceGuides.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ResourceGuides() {
  const navigate = useNavigate();

  return (
    <div className="guides-scope">
      <style>{`
        /* ====== TODO está scopeado con .guides-scope ====== */
        .guides-scope .hero{
          background:
            radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 500px at 92% 0%, #e5f9ff 0%, transparent 55%),
            linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
        }
        .guides-scope .chip{
          display:inline-block; padding:.35rem .75rem; border-radius:999px;
          font-weight:600; background:#e6f9ff; color:#1494b8; font-size:.9rem;
        }
        .guides-scope .title{ color:#20314d; }
        .guides-scope .muted{ color:#6b7c90; }
        .guides-scope .card-soft{
          border:0; border-radius:1.25rem; background:#fff;
          box-shadow:0 12px 40px rgba(15,23,42,.08);
          height:100%;
        }
        .guides-scope .emoji{
          width:48px;height:48px; display:grid; place-items:center;
          font-size:28px; border-radius:12px; background:#f3f0ff; color:#6c4bd5;
        }
        .guides-scope .btn-brand{
          background-image: linear-gradient(310deg, #7928CA, #FF0080);
          border:0; color:#fff; box-shadow:0 8px 24px rgba(203,12,159,.35);
        }
        .guides-scope .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }

        /* Acordeones (scopeados) */
        .guides-scope details{
          background:#fff; border-radius:1rem; padding:1rem 1.2rem;
          box-shadow:0 12px 40px rgba(15,23,42,.06); border:1px solid #eef2f7;
        }
        .guides-scope details + details{ margin-top:.75rem; }
        .guides-scope details summary{
          cursor:pointer; list-style:none; user-select:none;
          font-weight:600; color:#20314d;
        }
        .guides-scope details[open] summary{ color:#6c4bd5; }
        .guides-scope details summary::-webkit-details-marker{ display:none; }
      `}</style>

      {/* HERO */}
      <section className="hero py-5">
        <div className="container">
          <span className="chip">Recursos</span>
          <h1 className="display-6 fw-bold mt-2 title">Guías rápidas</h1>
          <p className="lead muted m-0">
            Empieza en minutos: crea tu sala, invita a tus amigos y publica tu primera apuesta.
          </p>
        </div>
      </section>

      {/* GUÍAS */}
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            {/* Guía 1 */}
            <div className="col-md-6 col-lg-4">
              <div className="card-soft p-4">
                <div className="emoji mb-3">🧩</div>
                <h5 className="fw-semibold title">Crea tu primer playground</h5>
                <ol className="muted mt-2 mb-3">
                  <li>Ve a <strong>Playgrounds</strong> → <em>Crear</em>.</li>
                  <li>Elige nombre, imagen y descripción.</li>
                  <li>Guarda y abre el tablero.</li>
                </ol>
                {/* SOLO crear usuario / iniciar sesión */}
                <div className="d-flex gap-2">
                  <Link to="/create" className="btn btn-brand btn-sm">Crear usuario</Link>
                  <Link to="/login" className="btn btn-outline-secondary btn-sm">Iniciar sesión</Link>
                </div>
              </div>
            </div>

            {/* Guía 2 */}
            <div className="col-md-6 col-lg-4">
              <div className="card-soft p-4">
                <div className="emoji mb-3">👥</div>
                <h5 className="fw-semibold title">Invita a tus amigos</h5>
                <ol className="muted mt-2 mb-3">
                  <li>Desde el tablero, pulsa <strong>Invitar</strong>.</li>
                  <li>Busca por usuario o email y envía la invitación.</li>
                  <li>Confirma cuando acepten y listo.</li>
                </ol>
                {/* SOLO crear usuario / iniciar sesión */}
                <div className="d-flex gap-2">
                  <Link to="/create" className="btn btn-brand btn-sm">Crear usuario</Link>
                  <Link to="/login" className="btn btn-outline-secondary btn-sm">Iniciar sesión</Link>
                </div>
              </div>
            </div>

            {/* Guía 3 */}
            <div className="col-md-6 col-lg-4">
              <div className="card-soft p-4">
                <div className="emoji mb-3">🎯</div>
                <h5 className="fw-semibold title">Publica tu primera apuesta</h5>
                <ol className="muted mt-2 mb-3">
                  <li>En el tablero, pulsa <strong>Nueva apuesta</strong>.</li>
                  <li>Define el evento, opciones y fecha límite.</li>
                  <li>Comparte y sigue el chat. ¡A jugar!</li>
                </ol>
                {/* SOLO crear usuario / iniciar sesión */}
                <div className="d-flex gap-2">
                  <Link to="/create" className="btn btn-brand btn-sm">Crear usuario</Link>
                  <Link to="/login" className="btn btn-outline-secondary btn-sm">Iniciar sesión</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tips & FAQ */}
          <div className="row g-4 mt-2">
            <div className="col-lg-6">
              <h5 className="fw-semibold title mb-3">Consejos rápidos</h5>
              <details>
                <summary>¿Cómo elijo una buena imagen para la sala?</summary>
                <p className="muted mt-2 mb-0">
                  Usa fotos horizontales, que representen el tema del grupo y mantengan buen contraste.
                  Se verán perfectas en el tablero.
                </p>
              </details>
              <details>
                <summary>¿Puedo editar una apuesta ya publicada?</summary>
                <p className="muted mt-2 mb-0">
                  Sí, mientras no haya pasado la fecha límite. Cambia nombre, opciones o imagen.
                </p>
              </details>
              <details>
                <summary>¿Cómo exporto resultados?</summary>
                <p className="muted mt-2 mb-0">
                  Desde el tablero, abre <em>Más</em> → <em>Exportar</em> para descargar un resumen en CSV.
                </p>
              </details>
            </div>

            <div className="col-lg-6">
              <h5 className="fw-semibold title mb-3">Sigue con…</h5>
              <div className="card-soft p-4 mb-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="muted">
                    ¿Tienes dudas? Escribe por el <Link to="/message-board">Message Board</Link> o contáctanos.
                  </div>
                  <Link to="/company/contact" className="btn btn-outline-secondary btn-sm">Contacto</Link>
                </div>
              </div>
              <div className="card-soft p-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="muted">
                    ¿Aún no tienes cuenta? Crea la tuya gratis y empieza hoy.
                  </div>
                  <Link to="/create" className="btn btn-brand btn-sm">Crear usuario</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
            <Link to="/" className="btn btn-outline-primary">Ir al inicio</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
