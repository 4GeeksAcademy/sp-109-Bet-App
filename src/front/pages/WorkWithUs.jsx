import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <style>{`
        /* ====== HERO azul con onda ====== */
        .jobs-hero{
          position:relative;
          color:#eaf2ff;
          padding:80px 0 140px;
          background:
            radial-gradient(1400px 600px at 50% -280px, #20314d 0%, #0f1b33 62%);
          overflow:hidden;
        }
        .jobs-hero h1{ font-weight:800; letter-spacing:.2px; }
        .jobs-hero p{ color:#a9b8cc; max-width:780px; }
        .wave{ position:absolute; left:0; right:0; bottom:-1px; height:120px; width:100%; }

        /* ====== FORM CARD ====== */
        .card-soft{
          background:#fff;
          border-radius:22px;
          box-shadow:0 22px 70px rgba(15,23,42,.16);
          padding:24px;
        }
        .label{ font-weight:600; color:#20314d; }
        .muted{ color:#6b7c90; }

        .chip{
          border:1px solid #e9e9f3;
          border-radius:999px;
          padding:.35rem .75rem;
          cursor:pointer;
          user-select:none;
          color:#20314d;
          background:#fff;
        }
        .chip.active{
          background:linear-gradient(310deg,#7928CA,#FF0080);
          color:#fff; border-color:transparent;
          box-shadow:0 10px 26px rgba(203,12,159,.25);
        }
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
        .hint{ font-size:.875rem; color:#8aa0b8 }
        .error{
          background:#fff2f2; color:#b42318; border:1px solid #fac5c1;
          padding:.75rem 1rem; border-radius:12px;
        }
        .success{
          background:#f0fbf5; color:#0d7a43; border:1px solid #afe3c2;
          padding:1rem; border-radius:14px;
        }

        /* más separación arriba de los botones */
        .form-actions{
          margin-top: 2rem;   /* <— AQUI el extra de espacio */
          padding-top: .75rem;
        }
      `}</style>

      {/* HERO */}
      <section className="jobs-hero">
        <div className="container">
          <h1 className="mb-2">Trabaja con nosotros</h1>
          <p className="mb-0">
            ¿Te apetece construir una app que hace que las porras entre amigos sean
            rápidas, claras y divertidas? Cuéntanos quién eres y nos pondremos en contacto.
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
            {!sent ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
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
                      <strong>{form.salary.toLocaleString("es-ES")} €</strong>
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

                  {/* acciones con más separación hacia abajo */}
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
    </div>
  );
};

export default WorkWithUs;
