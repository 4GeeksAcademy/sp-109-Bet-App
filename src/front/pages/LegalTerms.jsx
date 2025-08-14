// src/front/pages/LegalTerms.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export const LegalTerms = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="legal-terms-scope">
      <style>{`
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-secondary:#8796a8;
          --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
        }
        .hero-legal{
          background:
            radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 500px at 92% 0%, #e5f9ff 0%, transparent 55%),
            linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
        }
        .hero-legal h1{
          background: linear-gradient(90deg, var(--su-info), var(--su-primary));
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
          font-weight:800;
        }
        .section{ padding:2rem 0 2.75rem; }
        .soft-card{
          border:0;
          border-radius:1.25rem;
          background:#fff;
          box-shadow:0 18px 50px rgba(15,23,42,.10);
        }
        .soft-card h5{ color:#20314d; }
        .soft-card p, .soft-card li{ color:#6b7c90; }
        .badge-soft{ background:#f6e9f3; color:#cb0c9f; }
        .btn-brand{
          background-image: var(--su-gradient);
          border:0; color:#fff;
          box-shadow:0 8px 22px rgba(203,12,159,.30);
        }
        .btn-brand:hover{ filter:brightness(1.03); transform:translateY(-1px); }

        /* separar CTA del resto */
        .cta-wrap{ margin-top: 1.25rem; }
      `}</style>

      {/* HERO */}
      <header className="hero-legal py-5">
        <div className="container">
          <span className="badge badge-soft rounded-pill">Legal</span>
          <h1 className="display-5 mt-2 mb-2">Términos y Condiciones</h1>
          <p className="lead" style={{color:"var(--su-secondary)"}}>
            Bienvenido a Playgrounds & Bets. Estos términos regulan el acceso y uso
            de la plataforma. Léelos con calma; están pensados para que todos
            disfrutemos la experiencia con claridad y buen rollo.
          </p>
          <small className="text-muted">Última actualización: {today}</small>
        </div>
      </header>

      {/* CUERPO */}
      <main className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="soft-card p-4 p-lg-5 h-100">
                <h5>1) Introducción</h5>
                <p>
                  Al crear una cuenta o utilizar Playgrounds & Bets aceptas estos
                  Términos y nuestra Política de Privacidad. Si no estás de acuerdo,
                  por favor no uses el servicio. Podemos actualizar estas condiciones
                  para mejorar la plataforma; te avisaremos cuando haya cambios
                  relevantes.
                </p>

                <h5 className="mt-4">2) Uso Aceptable</h5>
                <ul className="mb-0">
                  <li>No publiques contenido ilegal, ofensivo o que infrinja derechos.</li>
                  <li>No intentes vulnerar o desactivar la plataforma.</li>
                  <li>Respeta a los demás usuarios y a tus grupos privados.</li>
                  <li>La plataforma está pensada para mayores de 18 años.</li>
                </ul>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="soft-card p-4 p-lg-5 h-100">
                <h5>3) Cuentas y Seguridad</h5>
                <p>
                  Eres responsable de mantener la confidencialidad de tu cuenta y
                  de la actividad que se produzca con ella. Usa contraseñas sólidas,
                  no compartas accesos y avísanos si detectas actividad sospechosa.
                </p>

                <h5 className="mt-4">4) Contenidos y Propiedad</h5>
                <p>
                  Tú conservas los derechos sobre el contenido que subas; nos
                  concedes una licencia limitada para alojarlo y mostrarlo en la
                  app. El software, marca y elementos visuales de Playgrounds & Bets
                  nos pertenecen o a nuestros licenciantes.
                </p>

                <h5 className="mt-4">5) Apuestas y Responsabilidad</h5>
                <p>
                  Las salas y apuestas son privadas entre usuarios. Playgrounds & Bets
                  proporciona herramientas de organización y no se hace responsable de
                  acuerdos, pagos, resultados o resultados deportivos. Usa la app con
                  responsabilidad y sentido común.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="soft-card p-4 p-lg-5 h-100">
                <h5>6) Pagos y Suscripciones</h5>
                <p>
                  Si en el futuro ofrecemos planes premium o servicios de pago, se
                  detallarán las condiciones de precio, facturación y cancelación
                  antes de contratar. Cualquier cargo será transparente y podrás
                  gestionar tu suscripción cuando quieras.
                </p>

                <h5 className="mt-4">7) Privacidad</h5>
                <p>
                  Tratamos tus datos según nuestra Política de Privacidad. Podrás
                  solicitar acceso, rectificación o eliminación conforme a la
                  normativa aplicable.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="soft-card p-4 p-lg-5 h-100">
                <h5>8) Cancelación</h5>
                <p>
                  Puedes dejar de usar la plataforma en cualquier momento. También
                  podremos suspender o cancelar cuentas que incumplan estos
                  Términos o que perjudiquen a la comunidad.
                </p>

                <h5 className="mt-4">9) Modificaciones y Ley Aplicable</h5>
                <p>
                  Podemos actualizar estas condiciones para introducir mejoras,
                  cambios legales o de producto. La ley aplicable y jurisdicción
                  serán las de tu país de residencia, salvo que la normativa disponga
                  lo contrario.
                </p>

                <h5 className="mt-4">10) Contacto</h5>
                <p className="mb-0">
                  ¿Dudas? Estamos para ayudarte:{" "}
                  <a href="mailto:hola@playbets.app">hola@playbets.app</a>
                </p>
              </div>
            </div>
          </div>

          {/* CTA / Volver */}
          <div className="cta-wrap d-flex flex-wrap gap-2">
            <button className="btn btn-brand btn-lg" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LegalTerms;
