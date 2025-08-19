// src/front/components/SiteFooterApp.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooterApp() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-soft footer--app footer--compact">
      <style>{`
        /* SOLO estilos visuales (nada sticky aquí) */
        .footer-soft{
          border-top:6px solid rgba(23,193,232,.18);
          background:
            radial-gradient(900px 300px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(600px 240px at 92% 0%, #e6f9ff 0%, transparent 55%),
            linear-gradient(#fff,#fff);
        }
        .footer--compact .container{ padding-top:1rem; padding-bottom:1rem; }
        .footer--compact hr{ margin:.6rem 0 !important; opacity:.12; }

        .footer-soft .brand{
          font-weight:800; letter-spacing:.2px;
          background: linear-gradient(90deg,#17c1e8,#cb0c9f);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
        }
        .footer-soft h6{ color:#20314d; font-weight:700; margin:0 0 .45rem; }
        .footer-soft p, .footer-soft a, .footer-soft small{ color:#6b7c90; }
        .footer-soft a{text-decoration:none}
        .footer-soft a:hover{ color:#cb0c9f; }

        /* RRSS (scopeado al footer) */
        .footer-soft .socials{ display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; }
        .footer-soft .social{
          position:relative; width:40px; height:40px; flex:0 0 40px;
          border-radius:12px; display:inline-grid; place-items:center;
          background:
            radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 50%, transparent 70%),
            linear-gradient(135deg,#FF0080 0%,#7928CA 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.6), 0 10px 24px rgba(15,23,42,.18);
          transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
          overflow:hidden; isolation:isolate;
        }
        .footer-soft .social::after{
          content:""; position:absolute; inset:0; border-radius:12px;
          background:
            radial-gradient(60% 60% at 70% 30%, rgba(23,193,232,.25), transparent 60%),
            radial-gradient(70% 70% at 10% 85%, rgba(203,12,159,.22), transparent 70%);
          opacity:.6; pointer-events:none; mix-blend:overlay;
        }
        .footer-soft .social:hover{
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.65), 0 12px 28px rgba(15,23,42,.22);
          filter:saturate(1.04);
        }
        /* evita reglas globales que agranden los iconos */
        .footer-soft .social svg{ width:18px !important; height:18px !important; color:#fff; z-index:1; }

        .footer-soft .social--x{ background: linear-gradient(135deg,#111,#333); }
        .footer-soft .social--ig{
          background:
            radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 50%, transparent 70%),
            radial-gradient(120% 120% at 85% 100%, #F58529 0%, rgba(245,133,41,0) 60%),
            linear-gradient(135deg,#7232bd 0%, #ff0080 60%, #fcb045 100%);
        }
        .footer-soft .social--dc{
          background:
            radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 50%, transparent 70%),
            linear-gradient(135deg,#5865F2 0%, #4752C4 100%);
        }
        .footer-soft .social--mail{
          background:
            radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 50%, transparent 70%),
            linear-gradient(135deg,#17c1e8 0%, #0ea5b7 100%);
        }

        .footer-soft .dot{
          width:10px;height:10px;border-radius:999px;
          background:linear-gradient(310deg,#7928CA,#FF0080);
          box-shadow:0 4px 12px rgba(203,12,159,.25);
        }
      `}</style>

      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <h5 className="brand mb-1">Playgrounds & Bets</h5>
            <p className="small mb-2">Nuestras RRSS.</p>
            <div className="socials">
              <a className="social social--x" href="https://twitter.com/Hello_bettapp" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 2h4l5 6 5-6h4l-7 8 7 8h-4l-5-6-5 6H3l7-8L3 2z"/>
                </svg>
              </a>
              <a className="social social--ig" href="https://www.instagram.com/hello.betapp/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 5.5zm6 .75a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 18 6.25Z"/>
                </svg>
              </a>
              <a className="social social--dc" href="https://discord.com/users/1405858847951687690" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 4a16 16 0 0 0-4-.9l-.4.8A13 13 0 0 1 12 4a13 13 0 0 1-3.6-.1l-.4-.8A16 16 0 0 0 4 4C2 7.1 1.4 10 1.5 12.9a15.7 15.7 0 0 0 5 2.6l.7-1.1a10.5 10.5 0 0 1-1.8-.9l.4-.3a10.9 10.9 0 0 0 9.4 0l.4.3a10.5 10.5 0 0 1-1.8.9l.7 1.1a15.7 15.7 0 0 0 5-2.6C22.6 10 22 7.1 20 4ZM9.2 13.3c-.9 0-1.6-.9-1.6-2s.7-2 1.6-2 1.7.9 1.7 2-.8 2-1.7 2Zm5.6 0c-.9 0-1.7-.9-1.7-2s.8-2 1.7-2 1.6.9 1.6 2-.7 2-1.6 2Z"/>
                </svg>
              </a>
              <a className="social social--mail" href="mailto:hola@playbets.app" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Zm2 1 7 4.5L19 7"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6>User</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/my-profile">My Profile</Link></li>
              <li><Link to="/logout">Log out</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Account</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/playground">Playgrounds</Link></li>
              <li><Link to="/requests">Requests</Link></li>
              <li><Link to="/my-profile">My Profile</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Admin</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/admin/login">Admin Log In</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Legal</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/legal/terms">Terms</Link></li>
              <li><Link to="/legal/privacy">Privacy</Link></li>
              <li><Link to="/legal/cookies">Cookies</Link></li>
              <li><Link to="/legal/responsible">Responsible</Link></li>
            </ul>
          </div>
        </div>

        <hr />

        <div className="row gy-2 small">
          <div className="col-md-6 d-flex align-items-center gap-2">
            <span className="dot"></span>
            <span>© {year} Playgrounds & Bets — Todos los derechos reservados.</span>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="text-muted">Sigue creando salas y pasándolo bien.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
