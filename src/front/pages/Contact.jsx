// src/front/pages/Contact.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const Contact = () => {
  const navigate = useNavigate();

  const TO_EMAIL = "hola@playbets.app";
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ccSelf, setCcSelf] = useState(true);
  const [copied, setCopied] = useState(false);

  const openMailClient = (e) => {
    e.preventDefault();
    const bodyLines = [
      `Nombre: ${name || "-"}`,
      `Email: ${fromEmail || "-"}`,
      ``,
      `Mensaje:`,
      `${message || "-"}`,
    ].join("\n");

    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    params.set("body", bodyLines);
    if (ccSelf && fromEmail) params.set("cc", fromEmail);

    window.location.href = `mailto:${TO_EMAIL}?${params.toString()}`;
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(TO_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="contact-new-scope">
      {/* Cabecera Bet APP */}
      <SoftRibbonNav />

      {/* Fondo artístico global (como el resto de vistas) */}
      <div className="bg-art" aria-hidden="true"></div>

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-grad: linear-gradient(310deg,#7928CA,#FF0080);
        }

        .contact-new-scope{
          position:relative;
          min-height:100dvh;
          background:
            radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 520px at 98% 0%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .contact-new-scope .bg-art{
          position:fixed; inset:0; pointer-events:none;
          background-image:url(${heroArt});
          background-size:cover; background-position:center;
          filter: blur(18px) saturate(1.05) contrast(1.04);
          opacity:.18; z-index:0;
        }
        .contact-new-scope .content{ position:relative; z-index:1; }

        .container-neo{ max-width: 1180px; margin: 0 auto; padding: 0 16px; }

        /* HERO split con imagen a la derecha */
        .contact-hero{ padding: 38px 0 64px; }
        .contact-wrap{
          display:grid; grid-template-columns: 1.05fr .95fr; gap: 26px;
          align-items: stretch; position: relative;
        }
        @media (max-width: 991.98px){ .contact-wrap{ grid-template-columns: 1fr; } }

        /* Tarjeta/form más ancha y translucida, sobre la imagen */
        .card-soft{
          position: relative; z-index: 2;
          margin-right: -50px;
          width: calc(100% + 70px);
          background: rgba(255,255,255,.82);
          backdrop-filter: blur(8px) saturate(1.05);
          -webkit-backdrop-filter: blur(8px) saturate(1.05);
          border: 1px solid rgba(255,255,255,.55);
          border-radius: 26px;
          box-shadow: 0 40px 120px rgba(15,23,42,.25);
          padding: 22px 22px;
        }
        @media (max-width: 991.98px){
          .card-soft{
            margin-right: 0; width: 100%;
            background:#fff; backdrop-filter:none; -webkit-backdrop-filter:none;
          }
        }

        .title{ font-weight:900; letter-spacing:.2px; margin:0 0 6px; color:#20314d; }
        .lead{ color:var(--su-muted); margin:0 0 16px; }

        /* Imagen derecha (misma que la landing) */
        .hero-art{
          position:relative; z-index:1; border-radius:26px; overflow:hidden;
          box-shadow:0 34px 120px rgba(15,23,42,.22);
          min-height: 520px; background:#fff;
        }
        .hero-art img{
          position:absolute; inset:-18% -18%;
          width:136%; height:136%;
          object-fit:cover; object-position:center;
          transform:skewX(14deg) translateX(-8%) scale(1.04);
          filter:saturate(1.06) contrast(1.04);
        }
        @media (max-width: 991.98px){ .hero-art{ min-height: 320px; } }

        /* Inputs y controles Soft-UI */
        label{ font-weight:700; color:#20314d; }
        .form-control{
          height:48px; border-radius:12px; border:1px solid #e8eef8;
          box-shadow:0 6px 16px rgba(15,23,42,.06);
          transition:border-color .15s ease, box-shadow .15s ease, transform .05s ease;
        }
        textarea.form-control{ height:auto; min-height:140px; }
        .form-control:focus{
          box-shadow:0 0 0 .22rem rgba(23,193,232,.20), 0 6px 16px rgba(15,23,42,.10);
          border-color:#bcd3ff; outline:none; transform:translateY(-1px);
        }
        .form-check-input{
          border-radius:6px; box-shadow:none; border:1px solid #dfe7f4;
        }
        .form-actions{ margin-top: 6px; }

        .address-chip{
          display:inline-flex; align-items:center; gap:.5rem;
          border:1px solid #edf1f6; border-radius:999px;
          padding:.45rem .75rem; background:#fff; color:#20314d;
          box-shadow:0 8px 24px rgba(15,23,42,.06);
        }
        .ok-badge{
          background:#eaffe9; color:#138a3b; border:1px solid #c8f1cf;
          border-radius:999px; padding:.15rem .55rem; font-size:.8rem;
        }

        .btn-brand{
          background-image:var(--su-grad); color:#fff; border:0;
          border-radius:12px; padding:.9rem 1.25rem; font-weight:800;
          box-shadow:0 14px 34px rgba(203,12,159,.35);
          transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
        .btn-ghost{
          border:1px solid #eaeef5; background:#fff; color:#20314d;
          border-radius:12px; padding:.9rem 1.1rem; font-weight:700;
          box-shadow:0 10px 26px rgba(15,23,42,.06);
          transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
        }
        .btn-ghost:hover{ background:#f2f8ff; transform:translateY(-1px); }

        /* Oculta SOLO la tira de botones del template (no la navbar entera) */
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn,
        nav.navbar + .container .btn-group,
        .template-links { display: none !important; }
      `}</style>

      <div className="content">
        <section className="contact-hero">
          <div className="container-neo contact-wrap">
            {/* Tarjeta izquierda: más ancha y semitransparente */}
            <div className="card-soft">
              <h1 className="title">Contacto</h1>
              <p className="lead">
                ¿Tienes dudas, sugerencias o quieres saludarnos? Completa el
                formulario y abriremos tu cliente de correo para enviarlo.
              </p>

              <form onSubmit={openMailClient}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Tu nombre</label>
                    <input
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="¿Cómo te llamas?"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tu email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Asunto</label>
                    <input
                      className="form-control"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Tema del mensaje"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Mensaje</label>
                    <textarea
                      className="form-control"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos en qué podemos ayudarte"
                      required
                    />
                  </div>

                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check mt-1">
                      <input
                        id="ccSelf"
                        className="form-check-input"
                        type="checkbox"
                        checked={ccSelf}
                        onChange={(e) => setCcSelf(e.target.checked)}
                      />
                      <label htmlFor="ccSelf" className="form-check-label">
                        Enviarme una copia (CC) a mi email
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6 text-md-end">
                    <div className="address-chip">
                      {TO_EMAIL}
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost py-1"
                        onClick={copyAddress}
                        title="Copiar dirección"
                      >
                        Copiar
                      </button>
                      {copied && <span className="ok-badge">Copiado</span>}
                    </div>
                  </div>

                  <div className="col-12 d-flex flex-wrap gap-2 form-actions">
                    <button type="submit" className="btn-brand">
                      Abrir cliente de correo
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => navigate(-1)}
                    >
                      ← Volver
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Imagen derecha (misma que la landing) */}
            <div className="hero-art" aria-hidden="true">
              <img src={heroArt} alt="" />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default Contact;
