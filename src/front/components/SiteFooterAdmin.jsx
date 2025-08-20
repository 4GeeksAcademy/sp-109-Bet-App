// src/front/components/SiteFooterAdmin.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import {
  FaTachometerAlt,
  FaFutbol,
  FaListOl,
  FaTrophy,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

export default function SiteFooterAdmin({ onLogout }) {
  const year = new Date().getFullYear();
  const auth = useAuth() ?? {};
  const navigate = useNavigate();

  const handleLogout = () => {
    // Si te pasan un handler, úsalo
    if (typeof onLogout === "function") return onLogout();
    // Fallback: usa el logout del contexto y lleva a /admin/login
    try {
      auth.logout?.();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <footer className="footer-soft footer-admin">
      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-grad: linear-gradient(310deg,#7928CA,#FF0080);
        }

        .footer-soft.footer-admin{
          border-top:1px solid rgba(203,12,159,.12);
          background:
            radial-gradient(900px 300px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(600px 240px at 92% 0%, #e6f9ff 0%, transparent 55%),
            linear-gradient(#fff,#fff);
        }
        .footer-admin .container{
          max-width:1180px; padding:18px 16px; margin:0 auto;
        }

        .footer-admin .top{
          display:flex; align-items:center; gap:16px;
          justify-content:space-between; flex-wrap:wrap;
        }

        /* Marca */
        .footer-admin .brand{ display:flex; align-items:center; gap:.5rem; white-space:nowrap; }
        .footer-admin .title{
          font-weight:800; letter-spacing:.2px;
          background: linear-gradient(90deg,#17c1e8,#cb0c9f);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
        }
        .footer-admin .pill{
          padding:.24rem .55rem; border-radius:999px;
          font-size:.78rem; font-weight:800;
          background-image:var(--su-grad);
          color:#fff; -webkit-text-fill-color:#fff;
          box-shadow:0 10px 26px rgba(203,12,159,.28);
        }

        /* Chips */
        .footer-admin .chipbar{ display:flex; gap:10px; flex-wrap:wrap; justify-content:center; flex:1 1 auto; }
        .footer-admin .chip{
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.55rem .8rem; border-radius:12px;
          font-weight:700; text-decoration:none; color:#20314d;
          background:#fff; border:1px solid #e9edf4;
          box-shadow:0 8px 20px rgba(15,23,42,.06);
          transition: transform .15s ease, filter .15s ease, box-shadow .15s ease, border-color .15s ease;
        }
        .footer-admin .chip:hover{ transform:translateY(-1px); background:#f8fbff; border-color:#d7e3ff; }
        .footer-admin .chip:focus-visible{ outline:2px solid rgba(23,193,232,.45); outline-offset:2px; }
        .footer-admin .chip svg{ width:14px; height:14px; opacity:.9; }

        /* Logout */
        .footer-admin .logout{
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.6rem 1rem; border-radius:12px; font-weight:800;
          color:#b4232a; background:#fff; text-decoration:none;
          border:1px solid #ffd2d2;
          box-shadow:0 8px 22px rgba(244,63,94,.12);
          transition: transform .15s ease;
        }
        .footer-admin .logout:hover{ transform:translateY(-1px); }

        .footer-admin hr{ margin:.7rem 0; opacity:.12; }
        .footer-admin .bottom{
          display:flex; align-items:center; justify-content:center; gap:.6rem;
          color:var(--su-muted); font-size:.9rem;
        }
        .footer-admin .dot{
          width:10px; height:10px; border-radius:999px;
          background:linear-gradient(310deg,#7928CA,#FF0080);
          box-shadow:0 4px 12px rgba(203,12,159,.25);
        }

        @media (max-width:780px){
          .footer-admin .top{ justify-content:center; gap:12px; }
        }
      `}</style>

      <div className="container">
        <div className="top" aria-label="Admin footer navigation">
          <div className="brand">
            <span className="title">Playgrounds & Bets</span>
            <span className="pill">Admin</span>
          </div>

          <nav className="chipbar">
            <Link to="/admin-board" className="chip">
              <FaTachometerAlt /> Admin Dashboard
            </Link>
            <Link to="/adminplaygrounds" className="chip">
              <FaFutbol /> Manage Playgrounds
            </Link>
            <Link to="/adminbets" className="chip">
              <FaListOl /> Manage Bets
            </Link>
            <Link to="/betwinners" className="chip">
              <FaTrophy /> All Bet Winners
            </Link>
            <Link to="/adminusers" className="chip">
              <FaUsers /> Manage Users
            </Link>
          </nav>

          <button
            type="button"
            className="logout"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <hr />

        <div className="bottom">
          <span className="dot" aria-hidden="true"></span>
          <small>© {year} Bets App — Admin</small>
        </div>
      </div>
    </footer>
  );
}
