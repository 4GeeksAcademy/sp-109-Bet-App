// src/front/components/SoftRibbonNav.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import "./SoftRibbonNav.css";
import logo from "../assets/img/BetMate_logo_transparent.png"


export default function SoftRibbonNav() {
  const auth = useAuth() ?? {};
  const { token, role, logout } = auth;
  const loggedIn = Boolean(token);
  const isAdmin = role === "admin";
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    try {
      logout?.();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="soft-ribbon-wrapper">
      <nav className="soft-ribbon" aria-label="Soft ribbon navigation">
        <Link to="/" className="soft-brand">
          <img
            src={logo}
            alt="BetMate Logo"
            className="soft-logo"
          />
        </Link>
        {/* --------- VARIANTE ADMIN --------- */}
        {isAdmin ? (
          <>
            <div className="soft-menu" role="menubar" aria-label="Admin navigation">
              <Link className="soft-link" to="/admin">Admin Dashboard</Link>
              <Link className="soft-link" to="/admin/playgrounds">Manage Playgrounds</Link>
              <Link className="soft-link" to="/admin/bets">Manage Bets</Link>
              <Link className="soft-link" to="/admin/winners">All Bet Winners</Link>
              <Link className="soft-link" to="/admin/users">Manage Users</Link>
            </div>

            {/* Botón de logout para admin */}
            <button type="button" className="soft-cta" onClick={handleAdminLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
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
              </>
            )}

            {/* --------- VARIANTE LOGUEADO (no-admin) --------- */}
            {loggedIn && !isAdmin && (
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

                <Link to="/wallet/topup" className="soft-cta" title="Add Money to your balance">
                  Add Money
                </Link>
              </>
            )}
          </>
        )}
      </nav>
    </div>
  );
}
