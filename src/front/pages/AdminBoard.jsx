// src/front/pages/AdminBoard.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

/* 🔽 Solo visual */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const AdminBoard = () => {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user, token, role, logout } = useAuth();

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/admin/login", { state: { fromProtected: true } });
    }
  }, [navigate, token, role]);

  const handleUnauthorized = () => {
    logout();
    navigate("/admin/login");
  };

  const getAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin_users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Error fetching admins");
      const data = await resp.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Error al cargar administradores");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingAdmin) {
        await fetch(import.meta.env.VITE_BACKEND_URL + `/api/admin_users/${editingAdmin.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, password }),
        });
        setEditingAdmin(null);
      } else {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin_users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, password }),
        });
      }

      setEmail("");
      setPassword("");
      getAdmins();
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setEmail(admin.email);
    setPassword("");
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este administrador?")) return;
    setError(null);
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/admin_users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Error eliminando admin");
      getAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Error al eliminar administrador");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    getAdmins();
  }, []);

  /* ====== ESTILOS SOLO VISUAL ====== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-grad: linear-gradient(310deg, #7928CA, #FF0080);
      }

      .admin-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
      }
      .admin-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .admin-scope .content{ position:relative; z-index:1; }

      /* Oculta solo los botones del template, no nuestro ribbon */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      .container-neo{ max-width: 1100px; margin: 0 auto; padding: 0 16px; }

      /* Hero */
      .admin-hero{ padding:28px 0 16px; }
      .admin-title{ font-weight:900; color:#20314d; margin:0; }
      .admin-sub{ color:var(--su-muted); margin:0; }

      .btn-danger-soft{
        background: linear-gradient(180deg, #fff5f5, #ffe9e9);
        color:#b4232a; border:1px solid #ffd2d2;
        border-radius:12px; font-weight:800; padding:.7rem 1rem;
        box-shadow:0 8px 22px rgba(244,63,94,.16);
      }
      .btn-danger-soft:hover{ transform:translateY(-1px); }

      .card-soft{
        background:#fff; border:1px solid #edf1f6; border-radius:18px;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
      }

      /* Form */
      .form-soft .form-label{ font-weight:700; color:#20314d; }
      .form-soft .form-control{
        height:48px; border-radius:12px; border:1px solid #e8eef8;
        box-shadow:0 6px 16px rgba(15,23,42,.06);
      }
      .form-soft .form-control:focus{
        box-shadow:0 0 0 .22rem rgba(23,193,232,.20), 0 6px 16px rgba(15,23,42,.10);
        border-color:#bcd3ff; outline:none; transform:translateY(-1px);
      }
      .btn-brand{
        background-image:var(--su-grad); color:#fff; border:0;
        border-radius:12px; font-weight:800; padding:.85rem 1.2rem;
        box-shadow:0 12px 30px rgba(203,12,159,.35);
      }
      .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }

      /* Listado */
      .admin-list .list-group-item{
        border:1px solid #eef2f7 !important; margin-bottom:10px;
        border-radius:14px; box-shadow:0 10px 26px rgba(15,23,42,.06);
      }

      /* Alert */
      .alert-soft{
        border-radius:14px; border:1px solid #e9edf4;
        background:#f7fbff; color:#0f5676; font-weight:600;
        box-shadow:0 10px 26px rgba(15,23,42,.05);
      }
    `}</style>
  );

  return (
    <div className="admin-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="admin-hero">
          <div className="container-neo d-flex justify-content-between align-items-center">
            <div>
              <h2 className="admin-title">Panel de Administración</h2>
              <p className="admin-sub">👋 Bienvenido, {user?.email || "Admin"}</p>
            </div>
            <button className="btn-danger-soft" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </section>

        <div className="container-neo">
          {error && <div className="alert alert-soft py-2 px-3 mb-3">{error}</div>}

          {/* FORM CARD */}
          <div className="card-soft p-3 p-md-4 mb-3">
            <form onSubmit={handleSubmit} className="form-soft">
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="admin@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-5">
                  <label className="form-label">Contraseña</label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!editingAdmin}
                  />
                </div>

                <div className="col-md-2">
                  <button className="btn-brand w-100" type="submit">
                    {editingAdmin ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* LISTA */}
          <h4 className="mb-2" style={{ color: "#20314d", fontWeight: 900 }}>
            Lista de Administradores
          </h4>

          {loading ? (
            <div className="text-center my-3">Cargando administradores...</div>
          ) : (
            <ul className="list-group admin-list mb-4">
              {admins.length === 0 ? (
                <li className="list-group-item">No hay administradores registrados.</li>
              ) : (
                admins.map((admin) => (
                  <li
                    key={admin.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <strong>ID:</strong> {admin.id} &nbsp; | &nbsp;
                      <strong>Email:</strong> {admin.email}
                    </span>
                    <span>
                      <FaEdit
                        className="text-warning me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(admin)}
                        title="Editar"
                      />
                      <FaTrash
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(admin.id)}
                        title="Eliminar"
                      />
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};
