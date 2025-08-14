import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../hooks/AuthContext";

export const AdminBets = () => {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState(null);
  const [loadingBets, setLoadingBets] = useState(true);

  const navigate = useNavigate();
  const { token, role, logout, loading } = useAuth(); // loading = AuthContext loading

  const handleUnauthorized = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    // Esperar a que AuthContext termine de cargar
    if (loading) return;

    // Si no hay token o el rol no es admin, redirigir
    if (!token || role !== "admin") {
      navigate("/admin/login", { state: { fromProtected: true } });
      return;
    }

    // Si es admin, cargar bets
    const getBets = async () => {
      setLoadingBets(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin_bets/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) return handleUnauthorized();
        if (!res.ok) throw new Error("Failed to load bets");
        const data = await res.json();
        setBets(data.bets);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingBets(false);
      }
    };

    getBets();
  }, [token, role, loading, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bet?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin_bets/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error("Failed to delete the bet");

      setBets((prev) => prev.filter((bet) => bet.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">All Bets (Admin View)</h2>

      {loadingBets && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loadingBets && !error && bets.length === 0 && (
        <p>No bets found.</p>
      )}

      {!loadingBets && !error && bets.length > 0 && (
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
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => navigate(`/admin/bets/edit/${bet.id}`)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(bet.id)}
                >
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
