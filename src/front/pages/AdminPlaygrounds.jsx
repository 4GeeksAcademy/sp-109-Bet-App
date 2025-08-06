import React, { useEffect, useState } from "react";

export const AdminPlaygrounds = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(undefined);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      setError("You must be an admin to access this page.");
      return;
    }

    const verifyAdmin = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/adminuser/private", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data.admin?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setError("Access denied. Not an admin.");
        }
      } catch (err) {
        console.error("Error verifying admin access:", err);
        setIsAdmin(false);
        setError("Error verifying admin access.");
      }
    };

    verifyAdmin();
  }, [token]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchPlaygrounds = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setPlaygrounds(data.playgrounds);
        } else {
          setError(data.msg || "Error fetching playgrounds.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error fetching playgrounds.");
      }
    };

    fetchPlaygrounds();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this playground?")) return;

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Delete failed:", errorText);
        setError("Failed to delete playground.");
        return;
      }

      setPlaygrounds(prev => prev.filter(pg => pg.id !== id));
    } catch (err) {
      console.error("Network error during delete:", err);
      setError("Error deleting playground.");
    }
  };

  if (isAdmin === undefined) {
    return <div className="container mt-5">Checking admin access...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <p className="text-danger fw-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>All Playgrounds (Admin)</h2>
      {error && <p className="text-danger">{error}</p>}
      {playgrounds.length === 0 ? (
        <p>No playgrounds found.</p>
      ) : (
        <ul className="list-group">
          {playgrounds.map(pg => (
            <li key={pg.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{pg.name}</strong> — {pg.slug} — Creator: {pg.created_by || "Unknown"}
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(pg.id)}
                title="Delete Playground"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
