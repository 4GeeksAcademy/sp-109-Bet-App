import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const WorkWithUs = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    linkedin: "",
    portfolio: "",
    location: "",
    availability: "Inmediata",
    salary: 40000,
    remote: true,
    relocate: false,
    skills: [],
    about: "",
    cvFile: null,
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    "Frontend React",
    "Backend (Python/Node)",
    "Full-stack",
    "UI/UX",
    "Data / Analytics",
    "DevOps",
    "QA / Automation",
    "Product Management",
  ];

  const allSkills = [
    "React",
    "TypeScript",
    "Node",
    "Python",
    "SQL/ETL",
    "Figma/UX",
    "Cypress/Playwright",
    "AWS/GCP",
    "CI/CD",
  ];

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox" && name === "consent") {
      setForm((f) => ({ ...f, consent: checked }));
      return;
    }
    if (type === "checkbox" && name === "relocate") {
      setForm((f) => ({ ...f, relocate: checked }));
      return;
    }
    if (type === "checkbox" && name === "remote") {
      setForm((f) => ({ ...f, remote: checked }));
      return;
    }
    if (type === "file") {
      setForm((f) => ({ ...f, cvFile: files?.[0] ?? null }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleSkill = (skill) => {
    setForm((f) =>
      f.skills.includes(skill)
        ? { ...f, skills: f.skills.filter((s) => s !== skill) }
        : { ...f, skills: [...f.skills, skill] }
    );
  };

  const validate = () => {
    if (!form.name.trim()) return "Por favor, indícanos tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email no válido.";
    if (!form.role) return "Elige un perfil/rol.";
    if (!form.about.trim() || form.about.length < 40)
      return "Cuéntanos un poco más de ti (mín. 40 caracteres).";
    if (!form.consent)
      return "Necesitamos tu consentimiento para tratar tus datos.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      // Simulación de envío
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
    } catch (e) {
      setError("Algo no fue bien. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="workwithus-scope">
      <SoftRibbonNav />

      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-grad: linear-gradient(310deg,#7928CA,#FF0080);
        }

        .workwithus-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1500px 650px at 7% -15%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 540px at 98% -10%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .workwithus-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.14;
        }
        .content{ position:relative; z-index:1; }
        .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

        
        .navbar .btn, .navbar .btn-group,
        nav.navbar + .container .btn, nav.navbar + .container .btn-group,
        .template-links { display:none !important; }

        
        .jobs-hero{
          position:relative; color:#eaf2ff; padding:80px 0 140px;
          background: radial-gradient(1400px 600px at 50% -280px, #20314d 0%, #0f1b33 62%);
          overflow:hidden;
        }
        .jobs-hero h1{ font-weight:900; letter-spacing:.2px; margin:0 0 .3rem; }
        .jobs-hero p{ color:#a9b8cc; max-width:780px; font-size:1.05rem; }
        .wave{ position:absolute; left:0; right:0; bottom:-1px; height:120px; width:100%; }

       
        .card-soft{
          background:#fff; border:1px solid rgba(255,255,255,.65);
          border-radius:22px; box-shadow:0 22px 70px rgba(15,23,42,.14);
          padding:22px;
        }
        @media (min-width: 768px){ .card-soft{ padding:28px; } }

        .label{ font-weight:700; color:#20314d; }
        .muted{ color:#6b7c90; }

        .form-control, .form-select{
          border-radius:12px; border:1px solid #e8eef8;
          box-shadow:0 6px 16px rgba(15,23,42,.06);
          transition:border-color .15s ease, box-shadow .15s ease, transform .05s ease;
        }
        .form-control:focus, .form-select:focus{
          border-color:#bcd3ff;
          box-shadow:0 0 0 .22rem rgba(23,193,232,.18), 0 6px 16px rgba(15,23,42,.10);
          transform:translateY(-1px);
          outline:none;
        }

        
        .form-range{ accent-color:#a78bfa; }
        .form-range::-webkit-slider-thumb{ background:#a78bfa; }
        .form-range::-moz-range-thumb{ background:#a78bfa; }
        .salary-value{
          display:inline-flex; align-items:center; gap:.35rem;
          padding:.2rem .6rem; border-radius:999px; font-weight:800;
          background:#f4f0ff; color:#6c4bd5; border:1px solid #e6dcff;
          box-shadow:0 6px 16px rgba(15,23,42,.06);
        }

        
        .chip{
          border:1px solid #e9e9f3; border-radius:999px;
          padding:.38rem .78rem; cursor:pointer; user-select:none;
          color:#20314d; background:#fff;
          transition:transform .12s ease, box-shadow .12s ease, filter .12s ease;
          box-shadow:0 8px 20px rgba(15,23,42,.06);
        }
        .chip:hover{ transform:translateY(-1px); }
        .chip.active{
          background:var(--su-grad); color:#fff; border-color:transparent;
          box-shadow:0 12px 28px rgba(203,12,159,.30);
        }

        
        .btn{ border-radius:12px; font-weight:800; }
        .btn-brand{
          background-image: var(--su-grad); border:0; color:#fff;
          padding:.9rem 1.3rem; box-shadow:0 12px 30px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
        .btn-ghost{
          border:1px solid #e9e9f3; background:#fff; color:#20314d;
          border-radius:12px; padding:.9rem 1.1rem; box-shadow:0 8px 22px rgba(15,23,42,.06);
        }
        .btn-ghost:hover{ transform:translateY(-1px); }

        .hint{ font-size:.875rem; color:#8aa0b8 }
        .error{
          background:#fff2f2; color:#b42318; border:1px solid #fac5c1;
          padding:.75rem 1rem; border-radius:12px;
        }
        .success{
          background:#f0fbf5; color:#0d7a43; border:1px solid #afe3c2;
          padding:1rem; border-radius:14px;
        }

        
        .block-title{
          font-weight:900; color:#20314d; margin:8px 0 2px;
        }
        .block-sub{ color:#6b7c90; margin-bottom:8px; }

        
        .form-actions{ margin-top: 1.35rem; padding-top: .35rem; }
      `}</style>

      <div className="bg-art" aria-hidden="true"></div>

      
      <section className="jobs-hero">
        <div className="container-neo">
          <h1 className="mb-1">Trabaja con nosotros</h1>
          <p className="mb-0">
            ¿Te apetece construir una app que hace que las porras entre amigos sean
            rápidas, claras y divertidas? Cuéntanos quién eres y nos pondremos en contacto.
          </p>
        </div>
        <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64 C240,128 480,0 720,32 C960,64 1200,144 1440,80 L1440,120 L0,120 Z" fill="#ffffff"/>
        </svg>
      </section>

      
      <section className="content py-4 py-md-5">
        <div className="container-neo">
          <div className="card-soft">
            {!sent ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  
                  <div className="col-12">
                    <div className="block-title">Datos básicos</div>
                    <div className="block-sub">Tu info de contacto y rol preferido.</div>
                  </div>

                  <div className="col-md-6">
                    <label className="label mb-1">Nombre</label>
                    <input
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="label mb-1">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="tucorreo@ejemplo.com"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="label mb-1">Perfil/rol</label>
                    <select
                      className="form-select"
                      name="role"
                      value={form.role}
                      onChange={onChange}
                      required
                    >
                      <option value="">Elige un rol</option>
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="label mb-1">Disponibilidad</label>
                    <select
                      className="form-select"
                      name="availability"
                      value={form.availability}
                      onChange={onChange}
                    >
                      <option>Inmediata</option>
                      <option>En 2 semanas</option>
                      <option>En 1 mes</option>
                      <option>Flexible</option>
                    </select>
                  </div>

                  
                  <div className="col-12">
                    <div className="block-title mt-1">Enlaces</div>
                  </div>

                  <div className="col-md-6">
                    <label className="label mb-1">LinkedIn</label>
                    <input
                      className="form-control"
                      name="linkedin"
                      value={form.linkedin}
                      onChange={onChange}
                      placeholder="https://www.linkedin.com/in/tu-perfil"
                    />
                    <div className="hint mt-1">Opcional, pero nos ayuda a conocerte.</div>
                  </div>

                  <div className="col-md-6">
                    <label className="label mb-1">Portfolio / GitHub / Web</label>
                    <input
                      className="form-control"
                      name="portfolio"
                      value={form.portfolio}
                      onChange={onChange}
                      placeholder="URL de portfolio, GitHub o sitio personal"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="label mb-1">Ubicación</label>
                    <input
                      className="form-control"
                      name="location"
                      value={form.location}
                      onChange={onChange}
                      placeholder="Ciudad, país"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="label mb-1">Expectativa salarial</label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="range"
                        min={18000}
                        max={120000}
                        step={1000}
                        className="form-range"
                        name="salary"
                        value={form.salary}
                        onChange={onChange}
                      />
                      <span className="salary-value">
                        {form.salary.toLocaleString("es-ES")} €
                      </span>
                    </div>
                  </div>

                  
                  <div className="col-12">
                    <label className="label mb-2 d-block">Skills principales</label>
                    <div className="d-flex flex-wrap gap-2">
                      {allSkills.map((s) => (
                        <span
                          key={s}
                          role="button"
                          className={`chip ${form.skills.includes(s) ? "active" : ""}`}
                          onClick={() => toggleSkill(s)}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  
                  <div className="col-12">
                    <label className="label mb-1">Sobre ti</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      name="about"
                      value={form.about}
                      onChange={onChange}
                      placeholder="Cuéntanos brevemente tu experiencia y por qué te apetece unirte."
                      required
                    />
                    <div className="hint mt-1">Mínimo 40 caracteres.</div>
                  </div>

                  
                  <div className="col-md-6">
                    <label className="label mb-1">CV (PDF o DOCX)</label>
                    <input
                      className="form-control"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      name="cvFile"
                      onChange={onChange}
                    />
                    {form.cvFile && (
                      <div className="hint mt-1">Archivo: {form.cvFile.name}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="remote"
                        id="remote"
                        checked={form.remote}
                        onChange={onChange}
                      />
                      <label className="form-check-label" htmlFor="remote">
                        Prefiero trabajar en remoto
                      </label>
                    </div>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="relocate"
                        id="relocate"
                        checked={form.relocate}
                        onChange={onChange}
                      />
                      <label className="form-check-label" htmlFor="relocate">
                        Consideraría reubicarme
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={form.consent}
                        onChange={onChange}
                      />
                      <label className="form-check-label" htmlFor="consent">
                        Acepto que tratéis mis datos para gestionar esta candidatura.
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div className="col-12">
                      <div className="error">{error}</div>
                    </div>
                  )}

                  
                  <div className="col-12 d-flex flex-wrap gap-3 form-actions">
                    <button className="btn btn-brand" type="submit" disabled={submitting}>
                      {submitting ? "Enviando…" : "Enviar solicitud"}
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
            ) : (
              <div className="text-center">
                <div className="success mb-4">
                  ¡Solicitud enviada! 🎉 <br />
                  Te contactaremos muy pronto. Gracias por tu interés.
                </div>
                <button className="btn btn-brand" onClick={() => navigate(-1)}>
                  ← Volver
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default WorkWithUs;
