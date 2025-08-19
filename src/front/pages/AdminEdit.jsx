import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

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


  return (
    <div className="container mt-5">
      <h2>Edit Admin</h2>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
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
        <button type="" className="btn btn-danger"
          onClick={() => navigate(`/admin-board/`)}
        >
          <i className="fas fa-times me-2"></i>Cancel
        </button>
      </form>
    </div>
  );
};