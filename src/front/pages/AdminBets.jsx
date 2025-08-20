// src/front/pages/AdminBets.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams} from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../hooks/AuthContext";
import "../styles/AdminBets.css";

/* 🔽 Solo visual */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const AdminBets = () => {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState(null);
  const [loadingBets, setLoadingBets] = useState(true);

  const navigate = useNavigate();
  const { token, role, logout, loading } = useAuth();

  const handleUnauthorized = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    if (loading) return;
    if (!token || role !== "admin") {
      navigate("/admin/login", { state: { fromProtected: true } });
      return;
    }

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
    <div className="admin-bets-scope">
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="bets-hero">
          <div className="container-neo">
            <h2 className="bets-title">All Bets (Admin View)</h2>
            <p className="bets-sub">Manage and edit bets created by users.</p>
          </div>
        </section>

        {/* CONTENIDO */}
        <section className="pb-4">
          <div className="container-neo">
            {loadingBets && <div className="alert-soft py-2 px-3 mb-3">Loading...</div>}
            {error && <div className="alert-soft py-2 px-3 mb-3 text-danger">{error}</div>}

            {!loadingBets && !error && bets.length === 0 && (
              <div className="alert-soft py-2 px-3">No bets found.</div>
            )}

            {!loadingBets && !error && bets.length > 0 && (
              <ul className="list-group list-soft">
                {bets.map((bet) => (
                  <li key={bet.id} className="list-group-item">
                    <span>
                      <strong>{bet.name}</strong> — 
                      <span className={`bet-status ${bet.status.toLowerCase()}`}>{bet.status}</span> — {bet.amount} €
                    </span>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/playground/${bet.playground_id}/bet/${bet.id}`, { state: { from: "admin" } })}
                        title="Edit bet"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(bet.id)}
                        title="Delete bet"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
};
