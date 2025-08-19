import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooterPublic() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-soft footer--public">
      <style>{`
        /* ===== Sticky helper (úsala en la página) =====
           <div class="sticky-footer-page"> ... <SiteFooterPublic/> </div> */
        .sticky-footer-page{ min-height:100dvh; display:flex; flex-direction:column; }
        .sticky-footer-page > .footer-soft{ margin-top:auto; }

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
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
        }
        .footer-soft h6{ color:#20314d; font-weight:700; }
        .footer-soft p, .footer-soft a, .footer-soft small{ color:#6b7c90; }
        .footer-soft a{text-decoration:none}
        .footer-soft a:hover{ color:#cb0c9f; }

        .socials { display:flex; gap:.75rem; }
        .social{
          width:40px;height:40px;border-radius:12px; display:grid; place-items:center;
          background: linear-gradient(135deg,#FF0080 0%,#7928CA 100%);
          color:#fff; box-shadow:0 10px 24px rgba(15,23,42,.18);
          transition:transform .18s ease, box-shadow .18s ease;
        }
        .social:hover{ transform:translateY(-3px); box-shadow:0 16px 40px rgba(15,23,42,.22); }
        .social svg{ width:18px;height:18px; }

        .dot{ width:10px;height:10px;border-radius:999px;
              background:linear-gradient(310deg,#7928CA,#FF0080);
              box-shadow:0 4px 12px rgba(203,12,159,.25); }
      `}</style>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <h5 className="brand mb-2">Playgrounds & Bets</h5>
            <p className="small mb-3">
              Crea salas privadas, monta apuestas entre amigos y charla todo en un mismo sitio.
            </p>
            <div className="socials">
              <a className="social" href="https://twitter.com/Hello_bettapp" target="_blank" rel="noreferrer" aria-label="X">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 2h4l5 6 5-6h4l-7 8 7 8h-4l-5-6-5 6H3l7-8L3 2z"/></svg>
              </a>
              <a className="social" href="https://www.instagram.com/hello.betapp/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 5.5zm6 0a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"/></svg>
              </a>
              <a className="social" href="mailto:hola@playbets.app" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Zm2 1 7 4.5L19 7"/></svg>
              </a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Company</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/company/team">Team</Link></li>
              <li><Link to="/company/jobs">Work with us</Link></li>
              <li><Link to="/company/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Account</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/login">Log In</Link></li>
              <li><Link to="/create">Sign Up</Link></li>
              <li><Link to="/my-profile">My Profile</Link></li>
              <li><Link to="/admin/login">Admin Log In</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Resource</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/guides">Guides</Link></li>
              <li><Link to="/changelog">Changelog</Link></li>
              <li><Link to="/roadmap">Roadmap</Link></li>
              <li><Link to="/status">Status</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Legal</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/legal/terms">Terms</Link></li>
              <li><Link to="/legal/privacy">Privacy</Link></li>
              <li><Link to="/legal/cookies">Cookies</Link></li>
              <li><Link to="/legal/responsible">Responsible</Link></li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{opacity:.12}} />
        <div className="row gy-3 small">
          <div className="col-md-6 d-flex align-items-center gap-2">
            <span className="dot"></span>
            <span>© {year} Playgrounds & Bets — Todos los derechos reservados.</span>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="text-muted">Hecho con ❤️ para tus apuestas.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
