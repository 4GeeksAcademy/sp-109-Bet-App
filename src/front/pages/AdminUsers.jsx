// src/front/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import "../styles/AdminUsers.css";

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
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401) return handleUnauthorized();
      if (resp.status === 403) throw new Error("No tienes permiso para eliminar este usuario");
      if (!resp.ok) throw new Error("Error deleting user");

      await resp.json();
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Error deleting user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  /* ====== Estilos Soft-UI locales ====== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
      }

      /* ============ ARREGLA FRANJA SUPERIOR (como en Playgrounds) ============ */
      @supports selector(body:has(.admin-users-scope)) {
        body:has(.admin-users-scope) .content-wrapper,
        body:has(.admin-users-scope) .flex-grow-1.main-content.d-flex.flex-column{
          padding-top:0 !important;
          background:transparent !important;
        }
        body:has(.admin-users-scope) .navbar{
          display:none !important;
        }
      }
      /* Fallback si :has() no existe */
      .admin-users-scope{ margin-top:-72px; }
      @media (min-width:992px){ .admin-users-scope{ margin-top:-84px; } }
      /* respiración para nuestra ribbon */
      .admin-users-scope nav.soft-ribbon{ margin-top:80px; }
      /* ====================================================================== */

      .admin-users-scope{
        position:relative;
        min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 5% -10%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 95% -10%, #e6f9ff 0%, transparent 55%),
          linear-gradient(#fff,#fff);
      }
      /* Arte difuminado de fondo (mismo arte usado en otras vistas) */
      .admin-users-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .admin-users-scope .content{ position:relative; z-index:1; }

      .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

      /* Oculta botones del template superior ajeno */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      /* HERO */
      .users-hero{ padding:28px 0 18px; }
      .users-title{ color:#20314d; font-weight:900; letter-spacing:.2px; margin:0 0 4px; }
      .users-sub{ color:var(--su-muted); margin:0; }

      /* Tarjetas / tabla */
      .card-soft{
        background:#fff; border:1px solid #edf1f6; border-radius:18px;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
      }
      .alert-soft{
        border-radius:14px; border:1px solid #e9edf4;
        background:#f7fbff; color:#0f5676; font-weight:600;
        box-shadow:0 10px 26px rgba(15,23,42,.05);
      }
      .table-wrap{ overflow:auto; border-radius:12px; }
      .table thead th{
        background:#f7f9fe; color:#20314d; font-weight:800; border-bottom:1px solid #eaf0fb;
      }
      .table tbody td{ color:#3a4b66; vertical-align:middle; }

      /* Botones */
      .btn{ border-radius:12px; font-weight:700; }
      .btn-success{ background-image: var(--su-gradient); border:0; color:#fff; }
      .btn-success:hover{ filter:brightness(1.05); transform:translateY(-1px); }
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
            <p></p>
            <h2 className="users-title">Users</h2>
            <p className="users-sub">Admin view to manage all registered users.</p>
          </div>
        </section>

        <section className="pb-4">
          <div className="container-neo">
            {error && <div className="alert-soft py-2 px-3 mb-3">{error}</div>}

            {loading ? (
              <div className="card-soft mb-3 p-3">Loading users...</div>
            ) : (
              <div className="card-soft mb-3">
                <div className="table-wrap">
                  <table className="table table-bordered m-0">
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
                                onClick={() => navigate(`/adminusers/view/${user.id}`)}
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

export default AdminUsers;
