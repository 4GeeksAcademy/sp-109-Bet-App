import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    // Montamos el cuerpo del correo
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

    // Abre el cliente de correo por defecto
    window.location.href = `mailto:${TO_EMAIL}?${params.toString()}`;
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(TO_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // noop
    }
  };

  return (
    <div className="contact-scope">
      <style>{`
        /* ====== HERO azul ====== */
        .contact-hero{
          position:relative;
          color:#eaf2ff;
          padding:80px 0 140px;
          background:
            radial-gradient(1400px 600px at 50% -280px, #20314d 0%, #0f1b33 62%);
          overflow:hidden;
        }
        .contact-hero h1{ font-weight:800; letter-spacing:.2px; }
        .contact-hero p{ color:#a9b8cc; max-width:780px; }
        .wave{ position:absolute; left:0; right:0; bottom:-1px; height:120px; width:100%; }

        /* ====== CARD ====== */
        .card-soft{
          background:#fff;
          border-radius:22px;
          box-shadow:0 22px 70px rgba(15,23,42,.16);
          padding:24px;
        }
        .label{ font-weight:600; color:#20314d; }
        .muted{ color:#6b7c90; }

        .btn-brand{
          background-image: linear-gradient(310deg, #7928CA, #FF0080);
          border:0; color:#fff;
          padding:.9rem 1.3rem;
          border-radius:12px;
          box-shadow:0 10px 26px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
        .btn-ghost{
          border:1px solid #e9e9f3;
          background:#fff; color:#20314d;
          border-radius:12px; padding:.9rem 1.1rem;
        }

        .address-chip{
          display:inline-flex; align-items:center; gap:.5rem;
          border:1px solid #e9e9f3; border-radius:999px; padding:.4rem .75rem;
          background:#fff; color:#20314d; user-select:all;
        }

        .ok-badge{
          display:inline-block; margin-left:.5rem;
          background:#eaffe9; color:#14823b;
          border:1px solid #c8f1cf; border-radius:999px;
          padding:.15rem .55rem; font-size:.8rem;
        }

        .form-actions{ margin-top: 2rem; padding-top: .75rem; }
      `}</style>

      {/* HERO */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="mb-2">Contacto</h1>
          <p className="mb-0">
            ¿Tienes dudas, sugerencias o quieres saludarnos? Escribe tu mensaje y
            abriremos tu cliente de correo para que lo envíes directamente.
          </p>
        </div>
        <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64 C240,128 480,0 720,32 C960,64 1200,144 1440,80 L1440,120 L0,120 Z" fill="#ffffff"/>
        </svg>
      </section>

      {/* FORM */}
      <section className="py-4 py-md-5">
        <div className="container">
          <div className="card-soft">
            <form onSubmit={openMailClient}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="label mb-1">Tu nombre</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="¿Cómo te llamas?"
                  />
                </div>
                <div className="col-md-6">
                  <label className="label mb-1">Tu email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>

                <div className="col-12">
                  <label className="label mb-1">Asunto</label>
                  <input
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Tema del mensaje"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="label mb-1">Mensaje</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Cuéntanos en qué podemos ayudarte"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <div className="form-check mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="ccSelf"
                      checked={ccSelf}
                      onChange={(e) => setCcSelf(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="ccSelf">
                      Enviarme una copia (CC) a mi email
                    </label>
                  </div>
                </div>

                <div className="col-md-6 text-md-end">
                  <div className="muted">
                    También puedes escribirnos a:
                    <span className="address-chip ms-2">
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
                    </span>
                  </div>
                </div>

                {/* Acciones separadas hacia abajo */}
                <div className="col-12 d-flex flex-wrap gap-3 form-actions">
                  <button className="btn btn-brand" type="submit">
                    Abrir cliente de correo
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigate(-1)}
                  >
                    ← Volver
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
