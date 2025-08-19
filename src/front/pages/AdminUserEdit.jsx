import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validación de acceso
  useEffect(() => {
    if (!token || role !== "admin") {
      logout();
      navigate("/admin/login", { state: { fromProtected: true } });
    }
  }, [token, role, logout, navigate]);

  // Fetch del usuario
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          logout();
          navigate("/admin/login");
          return;
        }

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.msg || "Failed to fetch user data");
        }

        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token, logout, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        logout();
        navigate("/admin/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Failed to update user");
      }

      navigate("/admin/users");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>Edit User</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="form-label">Username</label>
        <input
          className="form-control mb-2"
          value={form.username || ""}
          name="username"
          onChange={handleChange}
        />

        <label className="form-label">First Name</label>
        <input
          className="form-control mb-2"
          value={form.name || ""}
          name="name"
          onChange={handleChange}
        />

        <label className="form-label">Last Name</label>
        <input
          className="form-control mb-2"
          value={form.last_name || ""}
          name="last_name"
          onChange={handleChange}
        />

        <label className="form-label">Email Address</label>
        <input
          className="form-control mb-2"
          type="email"
          value={form.email || ""}
          name="email"
          onChange={handleChange}
        />

        <label className="form-label">Money Amount</label>
        <input
          className="form-control mb-2"
          type="number"
          value={form.money || 0}
          name="money"
          onChange={handleChange}
        />

        <label className="form-label">Latitude</label>
        <input
          className="form-control mb-2"
          type="number"
          value={form.latitude || ""}
          name="latitude"
          onChange={handleChange}
        />

        <label className="form-label">Longitude</label>
        <input
          className="form-control mb-2"
          type="number"
          value={form.longitude || ""}
          name="longitude"
          onChange={handleChange}
        />

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="is_active"
            checked={form.is_active || false}
            onChange={handleChange}
            id="isActiveCheck"
          />
          <label className="form-check-label" htmlFor="isActiveCheck">
            Active
          </label>
        </div>

        <button className="btn btn-primary" disabled={loading}>
          Update
        </button>
      </form>
    </div>
  );
};
