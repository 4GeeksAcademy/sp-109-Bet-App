// src/front/components/SiteFooter.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-soft mt-5">
      <style>{`
        .footer-soft{
          border-top:1px solid rgba(203,12,159,.12);
          background:
            radial-gradient(900px 300px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(600px 240px at 92% 0%, #e6f9ff 0%, transparent 55%),
            linear-gradient(#fff,#fff);
        }
        .footer-soft .brand{
          font-weight:800; letter-spacing:.2px;
          background: linear-gradient(90deg,#17c1e8,#cb0c9f);
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;color:transparent;
        }
        .footer-soft h6{ color:#20314d; font-weight:700; }
        .footer-soft p, .footer-soft a, .footer-soft small{ color:#6b7c90; }
        .footer-soft a{text-decoration:none}
        .footer-soft a:hover{ color:#cb0c9f; }

        /* ===== Redes bonitas ===== */
        .socials { display:flex; align-items:center; gap:.75rem; }

        .social {
          position:relative;
          width:44px; height:44px; border-radius:14px;
          display:grid; place-items:center;
          background: radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 50%, transparent 70%),
                      linear-gradient(135deg,#FF0080 0%,#7928CA 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.6),
            0 10px 24px rgba(15,23,42,.18);
          transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
          overflow:hidden;
          isolation:isolate;
        }
        .social:focus-visible{ outline:2px solid #17c1e8; outline-offset:2px; }
        .social::after{
          content:"";
          position:absolute; inset:0;
          border-radius:14px;
          background: radial-gradient(60% 60% at 70% 30%, rgba(23,193,232,.25), transparent 60%),
                      radial-gradient(70% 70% at 10% 85%, rgba(203,12,159,.22), transparent 70%);
          opacity:.8;
          pointer-events:none;
          mix-blend:overlay;
        }
        .social:hover{
          transform: translateY(-3px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.65),
            0 16px 40px rgba(15,23,42,.22);
          filter:saturate(1.05);
        }
        .social svg{
          width:20px; height:20px; color:#fff; z-index:1;
          filter: drop-shadow(0 1px 0 rgba(255,255,255,.25));
        }

        /* Variantes por marca (ligero tinte) */
        .social--x{ background: linear-gradient(135deg,#111,#333); }
        .social--ig{
          background:
            radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 50%, transparent 70%),
            radial-gradient(120% 120% at 85% 100%, #F58529 0%, rgba(245,133,41,0) 60%),
            linear-gradient(135deg,#7232bd 0%, #ff0080 60%, #fcb045 100%);
        }
        .social--dc{
          background:
            radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 50%, transparent 70%),
            linear-gradient(135deg,#5865F2 0%, #4752C4 100%);
        }
        .social--mail{
          background:
            radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 50%, transparent 70%),
            linear-gradient(135deg,#17c1e8 0%, #0ea5b7 100%);
        }

        /* Bullets de copyright */
        .footer-soft .bullet{ display:flex; gap:.75rem; align-items:center; }
        .footer-soft .dot{
          width:10px;height:10px;border-radius:999px;
          background:linear-gradient(310deg,#7928CA,#FF0080);
          box-shadow:0 4px 12px rgba(203,12,159,.25);
        }

        /* Utilidad accesible para lectores de pantalla */
        .sr-only {
          position:absolute!important; width:1px;height:1px; padding:0;margin:-1px;
          overflow:hidden; clip:rect(0,0,0,0); border:0;
        }
      `}</style>

      <div className="container py-5">
        <div className="row g-4">
          {/* Marca / descripción / redes */}
          <div className="col-12 col-lg-4">
            <h5 className="brand mb-2">Playgrounds & Bets</h5>
            <p className="small mb-3">
              Crea salas privadas, monta apuestas clásicas o personalizadas y conversa con tu grupo.
              Todo en un solo lugar, con buen rollo y organización.
            </p>

            <div className="socials">
              {/* X / Twitter */}
              <a className="social social--x" href="#" target="_blank" rel="noreferrer" aria-label="X (Twitter)" title="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 2h4l5 6 5-6h4l-7 8 7 8h-4l-5-6-5 6H3l7-8L3 2z"/>
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </a>

              {/* Instagram */}
              <a className="social social--ig" href="#" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm5.75-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z"/>
                </svg>
                <span className="sr-only">Instagram</span>
              </a>

              {/* Discord */}
              <a className="social social--dc" href="#" target="_blank" rel="noreferrer" aria-label="Discord" title="Discord">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 4a16 16 0 0 0-4-.9l-.4.8A13 13 0 0 1 12 4a13 13 0 0 1-3.6-.1l-.4-.8A16 16 0 0 0 4 4C2 7.1 1.4 10 1.5 12.9a15.7 15.7 0 0 0 5 2.6l.7-1.1a10.5 10.5 0 0 1-1.8-.9l.4-.3a10.9 10.9 0 0 0 9.4 0l.4.3a10.5 10.5 0 0 1-1.8.9l.7 1.1a15.7 15.7 0 0 0 5-2.6C22.6 10 22 7.1 20 4ZM9.2 13.3c-.9 0-1.6-.9-1.6-2s.7-2 1.6-2 1.7.9 1.7 2-.8 2-1.7 2Zm5.6 0c-.9 0-1.7-.9-1.7-2s.8-2 1.7-2 1.6.9 1.6 2-.7 2-1.6 2Z"/>
                </svg>
                <span className="sr-only">Discord</span>
              </a>

              {/* Email */}
              <a className="social social--mail" href="mailto:hola@playbets.app" aria-label="Email" title="Email">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Zm2 .5V7l7 4.5L19 7v-.5H5Zm0 3.2V18h14V9.7l-7 4.5-7-4.5Z"/>
                </svg>
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Columnas */}
          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Compañía</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/company/team">Equipo</Link></li>
              <li><Link to="/company/jobs">Trabaja con nosotros</Link></li>
              <li><Link to="/company/contact">Contacto</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Cuenta</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/create">Crear usuario</Link></li>
              <li><Link to="/my-profile">Mi perfil</Link></li>
              <li><Link to="/admin/login">Admin Login</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Recursos</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/guides">Guías rápidas</Link></li>
              <li><Link to="/changelog">Changelog</Link></li>
              <li><Link to="/roadmap">Roadmap</Link></li>
              <li><Link to="/status">Estado del servicio</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Legal</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/legal/terms">Términos</Link></li>
              <li><Link to="/legal/privacy">Privacidad</Link></li>
              <li><Link to="/legal/cookies">Cookies</Link></li>
              <li><Link to="/legal/responsible">Juego responsable</Link></li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{opacity:.12}} />

        <div className="row gy-3 small">
          <div className="col-md-6">
            <div className="bullet">
              <span className="dot"></span>
              <span>© {year} Playgrounds & Bets — Todos los derechos reservados.</span>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="text-muted">Hecho con ❤️ para tus apuestas.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
