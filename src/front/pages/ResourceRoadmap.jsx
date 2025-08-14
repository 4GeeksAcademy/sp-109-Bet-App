// src/front/pages/ResourceRoadmap.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ResourceRoadmap() {
  const navigate = useNavigate();

  return (
    <div className="roadmap-scope">
      <style>{`
        /* ====== Scope para no contaminar otros estilos ====== */
        .roadmap-scope .hero{
          background:
            radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 500px at 92% 0%, #e5f9ff 0%, transparent 55%),
            linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
        }
        .roadmap-scope .chip{
          display:inline-block; padding:.35rem .75rem; border-radius:999px;
          font-weight:600; background:#e8f6ff; color:#0ea5c6; font-size:.9rem;
        }
        .roadmap-scope .title{ color:#20314d; }
        .roadmap-scope .muted{ color:#6b7c90; }

        .roadmap-scope .board{
          display:grid; gap:1.25rem;
          grid-template-columns: repeat(3, minmax(0,1fr));
        }
        @media (max-width: 992px){
          .roadmap-scope .board{
            grid-template-columns: 1fr;
          }
        }

        .roadmap-scope .column{
          border:0; border-radius:18px; background:#fff;
          box-shadow:0 12px 40px rgba(15,23,42,.08);
          display:flex; flex-direction:column;
          min-height: 420px;
        }
        .roadmap-scope .column .head{
          padding:1rem 1.25rem;
          border-bottom:1px solid #eef2f7;
          display:flex; align-items:center; justify-content:space-between;
        }
        .roadmap-scope .column h5{
          margin:0; color:#20314d; font-weight:700;
        }
        .roadmap-scope .badge-count{
          background:#f1e4f9; color:#7a35c1;
          border-radius:999px; font-weight:700; padding:.25rem .6rem; font-size:.85rem;
        }

        .roadmap-scope .items{ padding:1rem; display:grid; gap:.8rem; }
        .roadmap-scope .card-item{
          border:1px solid #eef2f7; border-radius:14px; background:#fff;
          padding:.85rem .9rem;
        }
        .roadmap-scope .label{
          display:inline-block; padding:.15rem .5rem; border-radius:999px;
          font-size:.75rem; font-weight:700; margin-right:.4rem;
        }
        .roadmap-scope .label.feature{ background:#e9faf0; color:#1f9254; }
        .roadmap-scope .label.improve{ background:#fff7e6; color:#a76a00; }
        .roadmap-scope .label.quality{ background:#e7f0ff; color:#2b62b4; }
        .roadmap-scope .label.research{ background:#f7e8ff; color:#7a35c1; }

        .roadmap-scope .item-title{ color:#20314d; font-weight:600; }
        .roadmap-scope .item-desc{ color:#6b7c90; margin:0; }
        .roadmap-scope .item-meta{ color:#8aa0b6; font-size:.85rem; }

        .roadmap-scope .btn-brand{
          background-image: linear-gradient(310deg, #7928CA, #FF0080);
          border:0; color:#fff; box-shadow:0 8px 24px rgba(203,12,159,.35);
        }
        .roadmap-scope .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      `}</style>

      {/* HERO */}
      <section className="hero py-5">
        <div className="container">
          <span className="chip">Recursos</span>
          <h1 className="display-6 fw-bold mt-2 title">Roadmap</h1>
          <p className="lead muted m-0">
            Lo que estamos construyendo ahora, lo siguiente y lo que viene después.
          </p>
        </div>
      </section>

      {/* TABLERO */}
      <section className="py-4">
        <div className="container">
          <div className="board">
            {/* AHORA */}
            <div className="column">
              <div className="head">
                <h5>Ahora</h5>
                <span className="badge-count">3</span>
              </div>
              <div className="items">
                <div className="card-item">
                  <div className="mb-1">
                    <span className="label feature">Feature</span>
                    <span className="item-title"> Tablero de apuestas en tiempo real</span>
                  </div>
                  <p className="item-desc">
                    Actualización en vivo de opciones, chat y estado. Latencia optimizada.
                  </p>
                  <div className="item-meta">En curso · Est. 2 semanas</div>
                </div>

                <div className="card-item">
                  <div className="mb-1">
                    <span className="label improve">Mejora</span>
                    <span className="item-title"> Mejoras de accesibilidad</span>
                  </div>
                  <p className="item-desc">
                    Contraste, roles ARIA y navegación con teclado en todo el flujo.
                  </p>
                  <div className="item-meta">En curso · Est. 1 semana</div>
                </div>

                <div className="card-item">
                  <div className="mb-1">
                    <span className="label quality">Calidad</span>
                    <span className="item-title"> Refactor de subida de imágenes</span>
                  </div>
                  <p className="item-desc">
                    Menos fallos en móvil y subida concurrente más estable.
                  </p>
                  <div className="item-meta">QA · Est. 3 días</div>
                </div>
              </div>
            </div>

            {/* PRÓXIMO */}
            <div className="column">
              <div className="head">
                <h5>Próximo</h5>
                <span className="badge-count">3</span>
              </div>
              <div className="items">
                <div className="card-item">
                  <div className="mb-1">
                    <span className="label feature">Feature</span>
                    <span className="item-title"> Invitaciones por enlace mágico</span>
                  </div>
                  <p className="item-desc">
                    Link único para unirse a un playground sin pasos extras.
                  </p>
                  <div className="item-meta">Pendiente · Est. 1 semana</div>
                </div>

                <div className="card-item">
                  <div className="mb-1">
                    <span className="label improve">Mejora</span>
                    <span className="item-title"> Reportes de actividad</span>
                  </div>
                  <p className="item-desc">Resumen semanales para admins con participación y nuevas salas.</p>
                  <div className="item-meta">Pendiente · Est. 1.5 semanas</div>
                </div>

                <div className="card-item">
                  <div className="mb-1">
                    <span className="label research">Research</span>
                    <span className="item-title"> Moderación asistida por IA</span>
                  </div>
                  <p className="item-desc">
                    Prototipo para detectar spam y lenguaje tóxico en chats.
                  </p>
                  <div className="item-meta">Descubrimiento · Est. 2 semanas</div>
                </div>
              </div>
            </div>

            {/* MÁS ADELANTE */}
            <div className="column">
              <div className="head">
                <h5>Más adelante</h5>
                <span className="badge-count">3</span>
              </div>
              <div className="items">
                <div className="card-item">
                  <div className="mb-1">
                    <span className="label feature">Feature</span>
                    <span className="item-title"> App móvil (iOS/Android)</span>
                  </div>
                  <p className="item-desc">Notificaciones push y acceso rápido a tus salas.</p>
                  <div className="item-meta">Backlog · Planificación Q4</div>
                </div>

                <div className="card-item">
                  <div className="mb-1">
                    <span className="label quality">Calidad</span>
                    <span className="item-title"> Internacionalización</span>
                  </div>
                  <p className="item-desc">ES/EN de inicio, con estructura para más idiomas.</p>
                  <div className="item-meta">Backlog · Planificación Q4</div>
                </div>

                <div className="card-item">
                  <div className="mb-1">
                    <span className="label improve">Mejora</span>
                    <span className="item-title"> Métricas y analítica</span>
                  </div>
                  <p className="item-desc">KPIs claros para administradores de salas.</p>
                  <div className="item-meta">Backlog · Por priorizar</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA inferior */}
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
            <Link to="/create" className="btn btn-brand">Crear usuario</Link>
            <Link to="/login" className="btn btn-outline-primary">Iniciar sesión</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
