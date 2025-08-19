// src/front/components/SoftRibbonNav.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export default function SoftRibbonNav() {
  const { token } = useAuth() ?? {};
  const loggedIn = Boolean(token);

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
          z-index: 10;
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

      <nav className="soft-ribbon" aria-label="Soft ribbon navigation">
        <div className="soft-brand" aria-label="BETS APP">BETS APP</div>

        {/* --------- VARIANTE INVITADO --------- */}
        {!loggedIn && (
          <>
            <div className="soft-menu">
              <details className="soft-dd">
                <summary>Company ▾</summary>
                <div className="soft-panel">
                  <Link className="soft-link" to="/company/team">Team</Link>
                  <Link className="soft-link" to="/company/jobs">Work with us</Link>
                  <Link className="soft-link" to="/company/contact">Contact</Link>
                </div>
              </details>

              <details className="soft-dd">
                <summary>Account ▾</summary>
                <div className="soft-panel">
                  <Link className="soft-link" to="/login">Log In</Link>
                  <Link className="soft-link" to="/create">Sign Up</Link>
                  {/* Admin siempre visible */}
                  <Link className="soft-link" to="/admin/login">Admin Log In</Link>
                </div>
              </details>

              <details className="soft-dd">
                <summary>Resource ▾</summary>
                <div className="soft-panel">
                  <Link className="soft-link" to="/guides">Guides</Link>
                  <Link className="soft-link" to="/changelog">Changelog</Link>
                  <Link className="soft-link" to="/roadmap">Roadmap</Link>
                  <Link className="soft-link" to="/status">Status</Link>
                </div>
              </details>

              <details className="soft-dd">
                <summary>Legal ▾</summary>
                <div className="soft-panel">
                  <Link className="soft-link" to="/legal/terms">Terms</Link>
                  <Link className="soft-link" to="/legal/privacy">Privacy</Link>
                  <Link className="soft-link" to="/legal/cookies">Cookies</Link>
                  <Link className="soft-link" to="/legal/responsible">Responsible</Link>
                </div>
              </details>
            </div>
            {/* CTA público si quisieras algo aquí (ahora no) */}
          </>
        )}

        {/* --------- VARIANTE LOGUEADO --------- */}
        {loggedIn && (
          <>
            <div className="soft-menu">
              <details className="soft-dd">
                <summary>User ▾</summary>
                <div className="soft-panel">
                  <Link className="soft-link" to="/my-profile">My Profile</Link>
                  <Link className="soft-link" to="/logout">Log out</Link>
                </div>
              </details>

              <details className="soft-dd">
                <summary>Account ▾</summary>
                <div className="soft-panel">
                  <Link className="soft-link" to="/playground">Playgrounds</Link>
                  <Link className="soft-link" to="/requests">Requests</Link>
                  <Link className="soft-link" to="/my-profile">My Profile</Link>
                </div>
              </details>

              <details className="soft-dd">
                <summary>Admin ▾</summary>
                <div className="soft-panel">
                  <Link className="soft-link" to="/admin/login">Admin Log In</Link>
                </div>
              </details>

              <details className="soft-dd">
                <summary>Legal ▾</summary>
                <div className="soft-panel">
                  <Link className="soft-link" to="/legal/terms">Terms</Link>
                  <Link className="soft-link" to="/legal/privacy">Privacy</Link>
                  <Link className="soft-link" to="/legal/cookies">Cookies</Link>
                  <Link className="soft-link" to="/legal/responsible">Responsible</Link>
                </div>
              </details>
            </div>

            {/* CTA a la derecha (mismo estilo) */}
            <Link to="/wallet/topup" className="soft-cta" title="Add Money to your balance">
              Add Money
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
