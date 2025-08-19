import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

/* 👇 Solo visual */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const AdminEdit = () => {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, token, role, logout } = useAuth();

  useEffect(() => {
    const editAdmin = async () => {
      if (!token) {
        navigate("admin/login", { state: { fromProtected: true } });
        return;
      }

      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/admin_users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) throw new Error("Failed to get admin");

        const data = await resp.json();
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      }
    };

    editAdmin();
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin_users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) throw new Error("Update failed");

      navigate("/admin-board");
    } catch (err) {
      setError("Failed to update admin");
    }
  };

  /* ====== SOLO VISUAL (color de siempre + hasta arriba) ====== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-grad: linear-gradient(310deg,#7928CA,#FF0080);
      }

      /* Quita padding y navbar globales en esta vista */
      @supports selector(body:has(.admin-edit-scope)) {
        body:has(.admin-edit-scope) .content-wrapper,
        body:has(.admin-edit-scope) .flex-grow-1.main-content.d-flex.flex-column{
          padding-top:0 !important;
          background:transparent !important;
        }
        body:has(.admin-edit-scope) .navbar{ display:none !important; }
      }
      /* Fallback si :has() no existe */
      .admin-edit-scope{ margin-top:-72px; }
      @media (min-width:992px){ .admin-edit-scope{ margin-top:-84px; } }
      .admin-edit-scope nav.soft-ribbon{ margin-top:80px; }

      .admin-edit-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
      }
      .admin-edit-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .admin-edit-scope .content{ position:relative; z-index:1; }

      .container-neo{ max-width: 1080px; margin: 0 auto; padding: 0 16px; }

      /* Hero */
      .ae-hero{ padding:28px 0 14px; }
      .ae-title{ color:#20314d; font-weight:900; letter-spacing:.2px; margin:0; }
      .ae-sub{ color:var(--su-muted); margin:0; }

      /* Tarjeta suave */
      .card-soft{
        background:#fff; border:1px solid #edf1f6; border-radius:18px;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
        padding:22px;
      }

      /* Form estilos suaves (sin cambiar lógica) */
      .admin-edit-scope .form-label{ font-weight:700; color:#20314d; }
      .admin-edit-scope .form-control{
        height:48px; border-radius:12px; border:1px solid #e8eef8;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
      }
      .admin-edit-scope .form-control:focus{
        border-color:#c9dafc;
        box-shadow:0 0 0 .22rem rgba(23,193,232,.20), 0 8px 22px rgba(15,23,42,.12);
      }

      /* Botones */
      .admin-edit-scope .btn-primary{
        background-image:var(--su-grad) !important; border:0 !important; color:#fff !important;
        border-radius:12px; font-weight:800; padding:.8rem 1.1rem;
        box-shadow:0 12px 30px rgba(203,12,159,.35);
        transition: transform .15s ease, filter .15s ease;
      }
      .admin-edit-scope .btn-primary:hover{ filter:brightness(1.05); transform:translateY(-1px); }

      .admin-edit-scope .btn-danger{
        background: linear-gradient(180deg, #fff5f5, #ffe9e9) !important;
        color:#b4232a !important; border:1px solid #ffd2d2 !important;
        border-radius:12px; font-weight:800;
        box-shadow:0 8px 22px rgba(244,63,94,.16);
        margin-left:.5rem;
      }
      .admin-edit-scope .btn-danger:hover{ transform:translateY(-1px); }

      /* Alert suave */
      .alert-soft{
        border-radius:14px; border:1px solid #e9edf4;
        background:#f7fbff; color:#0f5676; font-weight:600;
        box-shadow:0 10px 26px rgba(15,23,42,.05);
      }
    `}</style>
  );

  return (
    <div className="admin-edit-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="ae-hero">
          <div className="container-neo">
            <h2 className="ae-title">Edit Admin</h2>
            <p className="ae-sub">Actualiza el email del administrador seleccionado.</p>
          </div>
        </section>

        {/* FORM CARD */}
        <section className="pb-4">
          <div className="container-neo">
            <div className="card-soft">
              {error && <p className="alert-soft py-2 px-3 mb-3 text-danger m-0">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Update
                </button>
                <button
                  type=""
                  className="btn btn-danger"
                  onClick={() => navigate(`/admin-board/`)}
                >
                  <i className="fas fa-times me-2"></i>Cancel
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
};
