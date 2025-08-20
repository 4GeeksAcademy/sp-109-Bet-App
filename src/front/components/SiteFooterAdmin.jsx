// src/front/components/SiteFooterAdmin.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt, FaFutbol, FaListOl, FaTrophy, FaUsers, FaSignOutAlt,
} from "react-icons/fa";

export default function SiteFooterAdmin({ onLogout }) {
  return (
    <footer className="admin-footer">
      <style>{`
        :root{
          --su-primary:#cb0c9f; --su-info:#17c1e8; --su-dark:#0f1b33;
          --su-muted:#6b7c90; --su-gradient: linear-gradient(310deg,#7928CA,#FF0080);
        }
        .admin-footer{
          position: relative; margin-top: 40px;
          background:
            radial-gradient(1200px 420px at 8% -20%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 380px at 92% -18%, #e6f9ff 0%, transparent 55%),
            #fff;
          border-top: 1px solid #edf1f6;
        }
        .admin-footer::before{
          content:""; position:absolute; left:0; right:0; top:-40px; height:40px;
          background: linear-gradient(to bottom, rgba(0,0,0,.04), transparent);
          pointer-events:none;
        }
        .container-neo{ max-width:1180px; margin:0 auto; padding:22px 16px; }
        .f-grid{ display:grid; gap:16px; grid-template-columns: 1.2fr 2fr auto; align-items:center; }
        @media (max-width:900px){ .f-grid{ grid-template-columns:1fr; text-align:center; } .actions{ justify-content:center; } }
        .brand{ font-weight:900; letter-spacing:.2px; color:#20314d; display:flex; align-items:center; gap:.5rem; }
        .brand .pill{ padding:.28rem .6rem; border-radius:999px; font-weight:800; background-image:var(--su-gradient); color:#fff; font-size:.78rem; box-shadow:0 10px 26px rgba(203,12,159,.35); }
        .links{ display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
        .f-link{
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.55rem .8rem; border-radius:12px; font-weight:700;
          text-decoration:none; color:#20314d; background:#fff;
          border:1px solid #e9edf4; box-shadow:0 8px 20px rgba(15,23,42,.06);
          transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
        }
        .f-link:hover{ transform:translateY(-1px); background:#f8fbff; border-color:#d7e3ff; }
        .actions{ display:flex; justify-content:flex-end; }
        .btn-logout{
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.6rem 1rem; border-radius:12px; font-weight:800;
          border:1px solid #ffd2d2; color:#b4232a; background:#fff;
          box-shadow:0 8px 22px rgba(244,63,94,.16);
        }
        .btn-logout:hover{ transform:translateY(-1px); }
        .meta{ margin-top:10px; color:var(--su-muted); font-size:.9rem; display:flex; justify-content:center; }
      `}</style>

      <div className="container-neo">
        <div className="f-grid">
          <div className="brand">BETS APP <span className="pill">Admin</span></div>

          <nav className="links" aria-label="Enlaces de administración">
            <Link to="/admin-board" className="f-link"><FaTachometerAlt/> Admin Dashboard</Link>
            <Link to="/admin-playgrounds" className="f-link"><FaFutbol/> Manage Playgrounds</Link>
            <Link to="/admin-bets" className="f-link"><FaListOl/> Manage Bets</Link>
            <Link to="/admin/winners" className="f-link"><FaTrophy/> All Bet Winners</Link>
            <Link to="/admin-users" className="f-link"><FaUsers/> Manage Users</Link>
          </nav>

          <div className="actions">
            <button type="button" className="btn-logout" onClick={onLogout} title="Cerrar sesión de administrador">
              <FaSignOutAlt/> Logout
            </button>
          </div>
        </div>

        <div className="meta">
          <small>© {new Date().getFullYear()} Bets App — Admin</small>
        </div>
      </div>
    </footer>
  );
}
