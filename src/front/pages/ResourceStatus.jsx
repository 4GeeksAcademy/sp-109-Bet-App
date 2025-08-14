// src/front/pages/ResourceStatus.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ResourceStatus() {
  const navigate = useNavigate();

  return (
    <div className="status-scope">
      <style>{`
        .status-scope .hero{
          background:
            radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 500px at 92% 0%, #e5f9ff 0%, transparent 55%),
            linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
        }
        .status-scope .chip{
          display:inline-block; padding:.35rem .75rem; border-radius:999px;
          font-weight:600; background:#e8f6ff; color:#0ea5c6; font-size:.9rem;
        }
        .status-scope .title{ color:#20314d; }
        .status-scope .muted{ color:#6b7c90; }

        .status-scope .card-soft{
          border:0; border-radius:18px; background:#fff;
          box-shadow:0 12px 40px rgba(15,23,42,.08);
        }

        .status-scope .stat-title{ color:#6b7c90; font-size:.9rem; margin:0; }
        .status-scope .stat-value{ color:#20314d; font-weight:800; font-size:1.6rem; }

        .status-scope .dot{
          width:10px; height:10px; border-radius:999px; display:inline-block; margin-right:.4rem;
        }
        .status-scope .up{ background:#16a34a; }        /* operativo */
        .status-scope .warn{ background:#f59e0b; }      /* degradado */
        .status-scope .down{ background:#ef4444; }      /* caída */

        .status-scope .badge-soft{
          background:#f1e4f9; color:#7a35c1;
          border-radius:999px; font-weight:700; padding:.25rem .6rem; font-size:.85rem;
        }

        .status-scope .btn-brand{
          background-image: linear-gradient(310deg, #7928CA, #FF0080);
          border:0; color:#fff; box-shadow:0 8px 24px rgba(203,12,159,.35);
        }
        .status-scope .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      `}</style>

      {/* HERO */}
      <section className="hero py-5">
        <div className="container">
          <span className="chip">Recursos</span>
          <h1 className="display-6 fw-bold mt-2 title">Estado del servicio</h1>
          <p className="lead muted m-0">
            Salud de los sistemas de Playgrounds & Bets, métricas y últimas incidencias.
          </p>
        </div>
      </section>

      {/* ESTADO GENERAL */}
      <section className="py-4">
        <div className="container">
          <div className="card-soft p-4 p-md-5 mb-4">
            <div className="d-flex flex-wrap align-items-center gap-3">
              <span className="badge-soft">Actualizado hace 2 min</span>
              <div className="ms-auto">
                <span className="dot up"></span>
                <strong className="title">Todos los sistemas operativos</strong>
              </div>
            </div>
          </div>

          {/* GRID MÉTRICAS */}
          <div className="row g-3 mb-4">
            {[
              { t: "Uptime (30 días)", v: "99.98%" },
              { t: "Latencia media", v: "153 ms" },
              { t: "Peticiones /h", v: "1.2 M" },
              { t: "Errores", v: "0.04%" },
            ].map((m, i) => (
              <div className="col-6 col-lg-3" key={i}>
                <div className="card-soft p-3">
                  <p className="stat-title">{m.t}</p>
                  <div className="stat-value">{m.v}</div>
                </div>
              </div>
            ))}
          </div>

          {/* COMPONENTES */}
          <div className="row g-3 mb-4">
            <div className="col-lg-6">
              <div className="card-soft p-3">
                <h6 className="mb-3 title">Componentes</h6>
                <ul className="list-unstyled m-0">
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span><span className="dot up"></span>API principal</span>
                    <span className="muted">Operativo</span>
                  </li>
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span><span className="dot up"></span>Web App</span>
                    <span className="muted">Operativo</span>
                  </li>
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span><span className="dot up"></span>Autenticación</span>
                    <span className="muted">Operativo</span>
                  </li>
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span><span className="dot warn"></span>Almacenamiento</span>
                    <span className="muted">Rendimiento degradado</span>
                  </li>
                  <li className="d-flex justify-content-between py-2">
                    <span><span className="dot up"></span>Realtime (WS)</span>
                    <span className="muted">Operativo</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* HISTORIAL DE INCIDENCIAS */}
            <div className="col-lg-6">
              <div className="card-soft p-3 h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="m-0 title">Incidencias recientes</h6>
                  <span className="badge-soft">últimos 90 días</span>
                </div>
                <div className="mb-3">
                  <div className="small muted">07 Ago · 14:10–14:42</div>
                  <div><span className="dot warn"></span><strong> Latencia elevada</strong> en subida de imágenes.</div>
                  <div className="small muted">Mitigado ajustando tamaño de parte y reintentos.</div>
                </div>
                <div className="mb-3">
                  <div className="small muted">26 Jul · 09:02–09:18</div>
                  <div><span className="dot down"></span><strong> Interrupción parcial</strong> de WebSocket en región EU.</div>
                  <div className="small muted">Resuelto con failover automático.</div>
                </div>
                <div>
                  <div className="small muted">03 Jul · 22:33–22:36</div>
                  <div><span className="dot up"></span><strong> Mantenimiento</strong> menor en base de datos.</div>
                  <div className="small muted">Sin impacto al usuario.</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
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
