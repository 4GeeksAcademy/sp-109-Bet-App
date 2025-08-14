// src/front/pages/ResourceChangelog.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const ResourceChangelog = () => {
  const navigate = useNavigate();

  return (
    <div className="changelog-scope">
      <style>{`
        .changelog-scope .hero{
          background:
            radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 500px at 92% 0%, #e5f9ff 0%, transparent 55%),
            linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
        }
        .changelog-scope .chip{
          display:inline-block; padding:.35rem .75rem; border-radius:999px;
          font-weight:600; background:#f1e4f9; color:#7a35c1; font-size:.9rem;
        }
        .changelog-scope .title{ color:#20314d; }
        .changelog-scope .muted{ color:#6b7c90; }
        .changelog-scope .card-soft{
          border:0; border-radius:1.25rem; background:#fff;
          box-shadow:0 12px 40px rgba(15,23,42,.08);
        }
        .changelog-scope .tag{
          display:inline-block; padding:.25rem .55rem; border-radius:999px; font-size:.8rem; font-weight:600;
        }
        .changelog-scope .tag.added{ background:#e9faf0; color:#1f9254; }
        .changelog-scope .tag.changed{ background:#fff7e6; color:#a76a00; }
        .changelog-scope .tag.fixed{ background:#fdecec; color:#b42318; }
        .changelog-scope .version{ font-weight:800; color:#20314d; }
        .changelog-scope .date{ color:#8aa0b6; font-size:.95rem; }
        .changelog-scope .dot{
          width:10px;height:10px;border-radius:999px;
          background:linear-gradient(310deg,#7928CA,#FF0080);
          box-shadow:0 4px 12px rgba(203,12,159,.25);
          flex:0 0 10px;
        }
        .changelog-scope .line{
          width:2px; background:#edf1f6; flex:0 0 2px;
        }
        .changelog-scope .btn-brand{
          background-image: linear-gradient(310deg, #7928CA, #FF0080);
          border:0; color:#fff; box-shadow:0 8px 24px rgba(203,12,159,.35);
        }
        .changelog-scope .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      `}</style>

      {/* HERO */}
      <section className="hero py-5">
        <div className="container">
          <span className="chip">Recursos</span>
          <h1 className="display-6 fw-bold mt-2 title">Changelog</h1>
          <p className="lead muted m-0">
            Cambios y mejoras de <strong>Playgrounds & Bets</strong> resumidos por versión.
          </p>
        </div>
      </section>

      {/* LISTA DE VERSIONES */}
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-10 mx-auto">
              {/* v1.4.0 */}
              <div className="card-soft p-4 p-md-5">
                <div className="d-flex align-items-start gap-3">
                  <div className="dot mt-2"></div>
                  <div className="line h-100" />
                  <div className="w-100">
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                      <div className="version h5 m-0">v1.4.0</div>
                      <div className="date">14 Ago 2025</div>
                    </div>
                    <div className="mt-3">
                      <span className="tag added me-2">Añadido</span>
                      <ul className="muted mb-3">
                        <li>Vista pública de <strong>Guías rápidas</strong> con pasos básicos.</li>
                        <li>Nuevo <strong>footer</strong> con enlaces de Compañía, Recursos y Legal.</li>
                      </ul>
                      <span className="tag changed me-2">Mejorado</span>
                      <ul className="muted mb-3">
                        <li>Estilos Soft-UI aislados para evitar conflictos con otras páginas.</li>
                        <li>Responsive del hero y tarjetas “3 pasos”.</li>
                      </ul>
                      <span className="tag fixed me-2">Corregido</span>
                      <ul className="muted mb-0">
                        <li>Problema donde algunos estilos globales afectaban a vistas antiguas.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* v1.3.2 */}
              <div className="card-soft p-4 p-md-5 mt-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="dot mt-2"></div>
                  <div className="line h-100" />
                  <div className="w-100">
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                      <div className="version h5 m-0">v1.3.2</div>
                      <div className="date">2 Ago 2025</div>
                    </div>
                    <div className="mt-3">
                      <span className="tag added me-2">Añadido</span>
                      <ul className="muted mb-3">
                        <li>Vista de <strong>Equipo</strong> con fichas de miembros y CTA de vuelta.</li>
                      </ul>
                      <span className="tag changed me-2">Mejorado</span>
                      <ul className="muted mb-3">
                        <li>Animación sutil al pasar por encima de botones principales.</li>
                      </ul>
                      <span className="tag fixed me-2">Corregido</span>
                      <ul className="muted mb-0">
                        <li>Bug al compartir enlace de invitación desde móvil.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* v1.3.0 */}
              <div className="card-soft p-4 p-md-5 mt-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="dot mt-2"></div>
                  <div className="line h-100" />
                  <div className="w-100">
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                      <div className="version h5 m-0">v1.3.0</div>
                      <div className="date">18 Jul 2025</div>
                    </div>
                    <div className="mt-3">
                      <span className="tag added me-2">Añadido</span>
                      <ul className="muted mb-3">
                        <li>Sección <strong>Compañía</strong>: Equipo, Trabaja con nosotros y Contacto.</li>
                        <li>Páginas legales: Términos, Privacidad, Cookies y Juego responsable.</li>
                      </ul>
                      <span className="tag changed me-2">Mejorado</span>
                      <ul className="muted mb-3">
                        <li>Accesibilidad en botones e inputs; mejor contraste de colores.</li>
                      </ul>
                      <span className="tag fixed me-2">Corregido</span>
                      <ul className="muted mb-0">
                        <li>Desfase de layout en Safari al abrir el modal de “Nueva apuesta”.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA inferior */}
              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
                <Link to="/" className="btn btn-outline-primary">Ir al inicio</Link>
                <Link to="/create" className="btn btn-brand">Crear usuario</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// 👉 Export por defecto también, por si lo importas sin llaves
export default ResourceChangelog;
