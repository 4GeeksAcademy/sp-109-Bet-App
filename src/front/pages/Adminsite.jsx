import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export const Adminsite = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const navigate = useNavigate();

  const { token, role, logout, loading } = useAuth(); // uso loading del context

  const handleUnauthorized = () => {
    logout();
    navigate("/admin/login", { state: { fromProtected: true } });
  };

  useEffect(() => {
    // Esperar a que AuthContext termine
    if (loading) return;

    // Redirigir si no es admin
    if (!token || role !== "admin") {
      handleUnauthorized();
      return;
    }

    // Fetch de admins
    const getAdmins = async () => {
      setLoadingAdmins(true);
      setError(null);
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/adminuser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (resp.status === 401) return handleUnauthorized();
        if (!resp.ok) throw new Error("Failed to obtain admins");

        const data = await resp.json();
        setAdmins(data.adminuser || data || []);
      } catch (err) {
        console.error(err);
        setError("Error loading admins");
      } finally {
        setLoadingAdmins(false);
      }
    };

    getAdmins();
  }, [token, role, loading, navigate]);

  const openEditor = (id) => {
    navigate(`/admin/adminsite/${id}`);
  };

  const handleCreate = () => {
    navigate("/admincreate");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/adminuser/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Failed to delete admin");

      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete admin");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Admin Users</h1>

      {loadingAdmins && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loadingAdmins && admins.length === 0 && (
        <p>No admin users found yet.</p>
      )}

      {!loadingAdmins && admins.length > 0 && (
        <ul className="list-group">
          {admins.map((admin) => (
            <li
              key={admin.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{admin.email}</span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openEditor(admin.id)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(admin.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className="btn btn-success mt-3" onClick={handleCreate}>
        Create New Admin
      </button>
    </div>
  );
};
