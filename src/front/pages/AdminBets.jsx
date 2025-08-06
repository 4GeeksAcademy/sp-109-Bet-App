import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export const AdminBets = () => {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // Verificar acceso de administrador
  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      setError("Access denied. You must be an Admin.");
      return;
    }

    const verifyAdmin = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/adminuser/private", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setIsAdmin(false);
          setError("Access denied. You must be an Admin.");
          return;
        }

        const data = await res.json();

        if (data.admin?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setError("Access denied. You must be an Admin.");
        }
      } catch (err) {
        console.error(err);
        setIsAdmin(false);
        setError("Error verifying admin access.");
      }
    };

    verifyAdmin();
  }, [token]);

  // Obtener todas las apuestas si es admin
  useEffect(() => {
    if (!isAdmin) return;

    const getBets = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin_bets/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch bets");

        setBets(data.bets);
      } catch (err) {
        console.error(err);
        setError("Error get bets");
      } finally {
        setLoading(false);
      }
    };

    getBets();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bet?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin_bets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete bet");

      setBets((prev) => prev.filter((bet) => bet.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting bet");
    }
  };

  if (isAdmin === undefined) {
    return <div className="container mt-5">Checking admin access...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <p className="text-danger fw-bold">{error}</p>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin/login")}>
          <i className="fas fa-arrow-left me-2"></i>Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">All Bets (Admin View)</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {bets.length === 0 && !loading && !error ? (
        <p>No bets found.</p>
      ) : (
        <ul className="list-group">
          {bets.map((bet) => (
            <li
              key={bet.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{bet.name}</strong> — {bet.status} — {bet.amount} €
              </span>
              <div className="d-flex gap-2">
                <button className="btn btn-warning btn-sm" onClick={() => navigate(`/admin/bets/edit/${bet.id}`)}>
                  <FaEdit />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bet.id)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};