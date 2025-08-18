// src/front/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";

/* 🔽 Solo visual */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { token, role, logout } = useAuth();

  useEffect(() => {
    if (!token || role !== "admin") {
      logout();
      navigate("/admin/login", { state: { fromProtected: true } });
    }
  }, [navigate, token, role]);

  const handleUnauthorized = () => {
    logout();
    navigate("/admin/login");
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Error fetching users");
      const data = await resp.json();
      setUsers(data);
    } catch (err) {
      setError("Error, it's impossible to obtein users.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Error fetching users");
      await resp.json();
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Network/server error:", err);
      setError("Error deleting user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
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

      .admin-users-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
      }
      .admin-users-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .admin-users-scope .content{ position:relative; z-index:1; }

      /* Oculta solo los botones del template demo (no nuestro ribbon) */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      .container-neo{ max-width: 1100px; margin: 0 auto; padding: 0 16px; }

      /* HERO */
      .users-hero{ padding:28px 0 16px; }
      .users-title{ font-weight:900; color:#20314d; margin:0; }
      .users-sub{ color:var(--su-muted); margin:0; }

      /* Alert suave */
      .alert-soft{
        border-radius:14px; border:1px solid #e9edf4;
        background:#f7fbff; color:#0f5676; font-weight:600;
        box-shadow:0 10px 26px rgba(15,23,42,.05);
      }

      /* Card contenedor del listado */
      .card-soft{
        background:#fff; border:1px solid #edf1f6; border-radius:18px;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
        padding:16px;
      }
      .table-wrap{ overflow:auto; }

      /* Tabla más suave sin tocar tus clases */
      .admin-users-scope .table{
        margin-bottom:0;
      }
      .admin-users-scope .table thead th{
        background:#f7f9fd; color:#20314d; border-color:#eef2f7;
        font-weight:800;
      }
      .admin-users-scope .table tbody td{
        vertical-align: middle; border-color:#eef2f7;
      }
      .admin-users-scope .table tr:hover{
        background:#fcfdff;
      }

      /* Botones: solo visual, override por scope */
      .admin-users-scope .btn-info{
        background: linear-gradient(180deg, #eef7ff, #dff0ff) !important;
        color:#0b5ea8 !important; border:1px solid #cce6ff !important;
        border-radius:10px; font-weight:800;
        box-shadow:0 8px 22px rgba(14,165,233,.16);
      }
      .admin-users-scope .btn-primary{
        background-image:var(--su-grad) !important; color:#fff !important; border:0 !important;
        border-radius:10px; font-weight:800;
        box-shadow:0 10px 26px rgba(203,12,159,.30);
      }
      .admin-users-scope .btn-danger{
        background: linear-gradient(180deg, #fff5f5, #ffe9e9) !important;
        color:#b4232a !important; border:1px solid #ffd2d2 !important;
        border-radius:10px; font-weight:800;
        box-shadow:0 8px 22px rgba(244,63,94,.16);
      }
      .admin-users-scope .btn-success{
        background-image:var(--su-grad) !important; color:#fff !important; border:0 !important;
        border-radius:12px; font-weight:800; padding:.8rem 1.1rem;
        box-shadow:0 12px 30px rgba(203,12,159,.35);
      }

      /* Espaciado final */
      .footer-gap{ height: 8px; }
    `}</style>
  );

  return (
    <div className="admin-users-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="users-hero">
          <div className="container-neo">
            <h2 className="users-title">Users</h2>
            <p className="users-sub">Admin view to manage all registered users.</p>
          </div>
        </section>

        <section className="pb-4">
          <div className="container-neo">
            {error && <div className="alert-soft py-2 px-3 mb-3">{error}</div>}

            {loading ? (
              <div className="card-soft mb-3">Loading users...</div>
            ) : (
              <div className="card-soft mb-3">
                <div className="table-wrap">
                  {/* ⬇️ Tu tabla intacta (solo envuelta para scroll responsivo) */}
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Money</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.money}</td>
                            <td>
                              <button
                                onClick={() => navigate(`/view/${user.id}`)}
                                className="btn btn-sm btn-info me-2"
                                title="View"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => navigate(`/edit/${user.id}`)}
                                className="btn btn-sm btn-primary me-2"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="btn btn-sm btn-danger"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end">
              <button onClick={() => navigate("/create")} className="btn btn-success">
                Create New User
              </button>
            </div>
          </div>
        </section>

        <div className="footer-gap" />
      </div>

      <SiteFooter />
    </div>
  );
};
