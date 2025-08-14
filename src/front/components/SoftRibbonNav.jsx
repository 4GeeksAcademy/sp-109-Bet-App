// src/front/components/SoftRibbonNav.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SoftRibbonNav() {
  return (
    <div className="soft-ribbon-wrapper">
      <style>{`
        .soft-ribbon-wrapper{
          position: sticky; top: 12px; z-index: 1040;
        }
        .soft-ribbon{
          max-width: 1180px; margin: 0 auto;
          display: flex; align-items: center; gap: 18px;
          padding: 12px 16px 12px 18px;
          border-radius: 28px;
          background: linear-gradient(90deg, rgba(255,255,255,.92), rgba(255,255,255,.86));
          border: 1px solid rgba(203,12,159,.12);
          backdrop-filter: blur(8px);
          box-shadow: 0 14px 48px rgba(15,23,42,.15);
        }
        .soft-brand{
          font-weight: 800; color: #20314d; letter-spacing:.2px;
          background: linear-gradient(90deg,#17c1e8,#cb0c9f);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          white-space: nowrap;
        }
        .soft-menu{ display:flex; gap:10px; align-items:center; flex:1 1 auto; }
        .soft-dd{ position: relative; }
        .soft-dd > summary{
          list-style: none; cursor: pointer;
          border-radius: 999px;
          padding: 8px 12px; font-weight: 600; color:#20314d;
          transition: .15s ease;
        }
        .soft-dd > summary::-webkit-details-marker{ display:none; }
        .soft-dd[open] > summary{ background: rgba(23,193,232,.08); }
        .soft-panel{
          position: absolute; top: 46px; left: 0;
          min-width: 240px;
          background: #fff; border-radius: 14px;
          border: 1px solid rgba(15,23,42,.06);
          box-shadow: 0 18px 48px rgba(15,23,42,.18);
          padding: 10px; display: grid; gap: 6px;
        }
        .soft-link{
          padding: 8px 10px; border-radius: 10px;
          color:#20314d; text-decoration:none; font-weight:600;
        }
        .soft-link:hover{ background:#f4f7fb; color:#0f1b33; }
        .soft-cta{
          text-decoration: none; white-space: nowrap;
          padding: 10px 16px; border-radius: 999px;
          color:#fff; font-weight:800;
          background: linear-gradient(310deg, #7928CA, #FF0080);
          box-shadow: 0 12px 30px rgba(203,12,159,.35);
        }
        .soft-cta:hover{ filter:brightness(1.06); transform: translateY(-1px); }
        @media (max-width: 980px){
          .soft-ribbon{ gap: 10px; padding: 10px 12px; }
          .soft-menu{ gap: 6px; }
          .soft-dd > summary{ padding: 8px 10px; }
          .soft-panel{ min-width: 200px; }
          .soft-brand{ font-size: 16px; }
        }
      `}</style>

      <nav className="soft-ribbon">
        {/* Título fijo (sin enlace) */}
        <div className="soft-brand" aria-label="BETS APP">BETS APP</div>

        <div className="soft-menu">
          {/* Compañía */}
          <details className="soft-dd">
            <summary>Compañía ▾</summary>
            <div className="soft-panel">
              <Link className="soft-link" to="/company/team">Equipo</Link>
              <Link className="soft-link" to="/company/jobs">Trabaja con nosotros</Link>
              <Link className="soft-link" to="/company/contact">Contacto</Link>
            </div>
          </details>

          {/* Cuenta (sin Mi perfil) */}
          <details className="soft-dd">
            <summary>Cuenta ▾</summary>
            <div className="soft-panel">
              <Link className="soft-link" to="/login">Iniciar sesión</Link>
              <Link className="soft-link" to="/create">Crear usuario</Link>
            </div>
          </details>

          {/* (Eliminado) Playgrounds */}

          {/* Admin (solo Login admin) */}
          <details className="soft-dd">
            <summary>Admin ▾</summary>
            <div className="soft-panel">
              <Link className="soft-link" to="/admin/login">Login admin</Link>
            </div>
          </details>

          {/* Recursos */}
          <details className="soft-dd">
            <summary>Recursos ▾</summary>
            <div className="soft-panel">
              <Link className="soft-link" to="/resources/guides">Guías rápidas</Link>
              <Link className="soft-link" to="/resources/changelog">Changelog</Link>
              <Link className="soft-link" to="/resources/roadmap">Roadmap</Link>
              <Link className="soft-link" to="/resources/status">Estado del servicio</Link>
            </div>
          </details>

          {/* Legal */}
          <details className="soft-dd">
            <summary>Legal ▾</summary>
            <div className="soft-panel">
              <Link className="soft-link" to="/legal/terms">Términos</Link>
              <Link className="soft-link" to="/legal/privacy">Privacidad</Link>
              <Link className="soft-link" to="/legal/cookies">Cookies</Link>
              <Link className="soft-link" to="/legal/responsible">Juego responsable</Link>
            </div>
          </details>
        </div>

        {/* CTA */}
        <Link to="/create" className="soft-cta">Crear usuario</Link>
      </nav>
    </div>
  );
}

