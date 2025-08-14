import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";


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
          "Authorization": `Bearer ${token}`
        }
      });
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Error fetching admins");
      const data = await resp.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Error al cargar administradores");
    } finally {
      setLoading(false)
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null)
    try {
      if (editingAdmin) {
        await fetch(import.meta.env.VITE_BACKEND_URL + `/api/admin_users/${editingAdmin.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ email, password }),
        });
        setEditingAdmin(null);

      } else {

        await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin_users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
    setError(null)
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/admin_users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
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
    logout()
    navigate("/admin/login");
  };

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>👋 Bienvenido, {user?.email || "Admin"}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control mb-2"
          type="email"
          placeholder="admin@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="form-label">Contraseña</label>
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!editingAdmin}
        />

        <button className="btn btn-primary" type="submit">
          {editingAdmin ? "Actualizar Admin" : "Guardar Admin"}
        </button>
      </form>

      <h4 className="mt-4">Lista de Administradores</h4>

      {loading ? (
        <div className="text-center my-3">Cargando administradores...</div>
      ) : (
        <ul className="list-group">
          {admins.length === 0 ? (
            <li className="list-group-item">No hay administradores registrados.</li>
          ) : (
            admins.map((admin) => (
              <li key={admin.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>ID:</strong> {admin.id} | <strong>Email:</strong> {admin.email}
                </span>
                <span>
                  <FaEdit
                    className="text-warning me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(admin)}
                  />
                  <FaTrash
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(admin.id)}
                  />
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
