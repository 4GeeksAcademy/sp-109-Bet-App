import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../hooks/AuthContext";

export const AdminPlaygrounds = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null)
  const navigate = useNavigate();
  
  const { token, role, logout } = useAuth()

  useEffect(() => {
    if (!token || role !== "admin") {
      logout();
      navigate("/admin/login");
    }
  }, [token, role, navigate, logout]);

  useEffect(() => {

    const getAllplaygrounds = async () => {
      setLoading(true)
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.status === 401){
          logout();
          navigate("/admin/login");
          return;
        }

        if (res.ok) {
          setPlaygrounds(data.playgrounds);
        } else {
          setError(data.msg || "Error fetching playgrounds.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error fetching playgrounds.");
      } finally {
        setLoading(false)
      }
    };

    getAllplaygrounds();
  }, [token, role, navigate, logout]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this playground?")) return;

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 401) {
        logout();
        navigate("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to delete playground");

      setPlaygrounds(prev => prev.filter(pg => pg.id !== id));
    } catch (err) {
      console.error("Network error during delete:", err);
      setError("Error deleting playground.");
    }
  };


  return (
  <div className="container mt-5">
    <h2>All Playgrounds (Admin)</h2>

    {error && <p className="text-danger">{error}</p>}

    {loading ? (
      <p>Loading playgrounds...</p>
    ) : playgrounds.length === 0 ? (
      <p>No playgrounds found.</p>
    ) : (
      <ul className="list-group">
        {playgrounds.map(pg => (
          <li
            key={pg.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{pg.name}</strong> — {pg.slug} — Creator: {pg.created_by || "Unknown"}
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(pg.id)}
              title="Delete Playground"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);
};
