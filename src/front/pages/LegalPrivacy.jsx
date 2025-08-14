// src/front/pages/LegalPrivacy.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LegalPrivacy() {
  const navigate = useNavigate();

  return (
    <div className="legal-privacy-scope">
      <style>{`
        .legal-privacy-scope .hero{
          background:
            radial-gradient(1200px 600px at 8% -10%, #eef0ff 0%, transparent 60%),
            radial-gradient(900px 500px at 92% 0%, #e5f9ff 0%, transparent 55%),
            linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
        }
        .chip{
          display:inline-block; padding:.35rem .75rem; border-radius:999px;
          font-weight:600; background:#f6e9f3; color:#cb0c9f; font-size:.9rem;
        }
        .title{ color:#20314d; }
        .muted{ color:#6b7c90; }
        .card-soft{
          border:0; border-radius:1.25rem;
          box-shadow:0 12px 40px rgba(15,23,42,.08);
          background:#fff;
        }
        .btn-brand{
          background-image: linear-gradient(310deg, #7928CA, #FF0080);
          border:0; color:#fff; box-shadow:0 8px 24px rgba(203,12,159,.35);
        }
        .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      `}</style>

      {/* HERO */}
      <section className="hero py-5">
        <div className="container">
          <span className="chip">Legal</span>
          <h1 className="display-6 fw-bold mt-2 title">Política de Privacidad</h1>
          <p className="lead muted m-0">
            Cómo recopilamos, usamos y protegemos tu información en Playgrounds & Bets.
          </p>
          <small className="muted d-block mt-2">
            Última actualización: {new Date().toLocaleDateString()}
          </small>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="py-4">
        <div className="container">
          <div className="card-soft p-4 p-md-5">
            <div className="row g-4">
              <div className="col-12">
                <h5 className="title">Datos que recopilamos</h5>
                <p className="muted">
                  Recopilamos información que nos proporcionas al crear una cuenta o usar
                  la app, como nombre, email, avatar/foto y preferencias. También
                  registramos de forma automática datos técnicos básicos (IP, dispositivo,
                  navegador) para seguridad y rendimiento.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 className="title">Cómo usamos tus datos</h5>
                <ul className="muted mb-0">
                  <li>Proveer el servicio (salas privadas, apuestas y chats).</li>
                  <li>Autenticación, soporte y prevención de fraude.</li>
                  <li>Mejora de la experiencia y métricas agregadas.</li>
                  <li>Envío de notificaciones esenciales (no marketing intrusivo).</li>
                </ul>
              </div>

              <div className="col-12 col-md-6">
                <h5 className="title">Base legal (RGPD)</h5>
                <ul className="muted mb-0">
                  <li>Ejecución de contrato (prestación del servicio).</li>
                  <li>Interés legítimo (seguridad, analítica agregada).</li>
                  <li>Consentimiento (opciones que tú aceptes explícitamente).</li>
                </ul>
              </div>

              <div className="col-12 col-lg-6">
                <h5 className="title">Conservación</h5>
                <p className="muted">
                  Mantenemos los datos el tiempo necesario para el uso previsto y por los
                  plazos exigidos por ley. Podrás solicitar la supresión cuando proceda.
                </p>
              </div>

              <div className="col-12 col-lg-6">
                <h5 className="title">Cesiones y encargados</h5>
                <p className="muted">
                  No vendemos tus datos. Podemos apoyarnos en proveedores
                  (almacenamiento, email, analítica agregada) con contratos de
                  tratamiento adecuados y ubicados en regiones con garantías.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 className="title">Tus derechos</h5>
                <ul className="muted mb-0">
                  <li>Acceso, rectificación y supresión.</li>
                  <li>Limitación u oposición al tratamiento.</li>
                  <li>Portabilidad de datos.</li>
                  <li>Retirar el consentimiento en cualquier momento.</li>
                </ul>
              </div>

              <div className="col-12 col-md-6">
                <h5 className="title">Cookies</h5>
                <p className="muted">
                  Usamos cookies técnicas para el funcionamiento y, en su caso, de
                  medición agregada. Puedes ampliar en{" "}
                  <Link to="/legal/cookies">nuestra política de cookies</Link>.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 className="title">Seguridad</h5>
                <p className="muted">
                  Aplicamos medidas razonables de seguridad (cifrado en tránsito, controles
                  de acceso y auditoría) para proteger tu información frente a accesos no
                  autorizados.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <h5 className="title">Menores</h5>
                <p className="muted">
                  El servicio está orientado a mayores de 16 años (o edad equivalente según
                  normativa local). Si detectamos cuentas de menores sin consentimiento
                  válido, procederemos a su eliminación.
                </p>
              </div>

              <div className="col-12">
                <h5 className="title">Cambios</h5>
                <p className="muted">
                  Podremos actualizar esta política. Publicaremos la versión vigente y la
                  fecha de última modificación. Los cambios sustanciales se comunicarán de
                  forma destacada.
                </p>
              </div>

              <div className="col-12">
                <h5 className="title">Contacto</h5>
                <p className="muted mb-0">
                  Para ejercer derechos o resolver dudas:{" "}
                  <a href="mailto:hola@playbets.app">hola@playbets.app</a> o desde{" "}
                  <Link to="/company/contact">Contacto</Link>.
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                ← Volver
              </button>
              <Link to="/company/contact" className="btn btn-brand">
                Enviar consulta
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
