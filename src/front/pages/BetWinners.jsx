import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BetWinners() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [bets, setBets] = useState([]);

  const adminToken = localStorage.getItem("adminToken");
  const userToken  = localStorage.getItem("token");

  const isUnderAdminRoute =
    typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
   
  const isAdmin = !!adminToken;
  const headers = useMemo(() => {
    const activeToken = isAdmin ? adminToken : userToken;
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {};
  }, [adminToken, userToken, isAdmin]);

  

  useEffect(() => {
    if (!adminToken && !userToken) {
      navigate(isUnderAdminRoute ? "/admin/login" : "/login", {
        replace: true,
        state: { msg: "Please log in" }
      });
      return;
    }
    let aborted = false;
    
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bets/winners`,
          { headers }
        );

        if (resp.status === 401) {
          if (isAdmin) {
            localStorage.removeItem("adminToken");
            navigate("/admin/login", { replace: true, state: { msg: "Session expired" } });
        } else {
          localStorage.removeItem("token");
          navigate("/login", { replace: true, state: { msg: "Session expired" } });
        }
        return;
      }

        const text = await resp.text();
        if (!resp.ok) {
          let msg;
          try { msg = JSON.parse(text).message; } catch { msg = text || `HTTP ${resp.status}`; }
          throw new Error(msg || "Failed to load winners");
        }

        const data = JSON.parse(text);
        if (!aborted) setBets(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!aborted) setError(e.message || "Error loading winners");
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    load();
    return () => { aborted = true; };
  }, [adminToken, userToken,headers, isAdmin, isUnderAdminRoute, navigate]);

  if (loading) return <div className="container mt-4">⏳ Loading winners…</div>;
  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger">Error: {error}</div>
      <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2>🏆 Bet Winners</h2>

      {bets.length === 0 ? (
        <div className="alert alert-secondary mt-3">No resolved bets yet.</div>
      ) : (
        bets.map((bet) => (
          <div key={bet.bet_id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="card-title mb-1">{bet.bet_name || `Bet #${bet.bet_id}`}</h5>
                {bet.resolved_at && (
                  <small className="text-muted">
                    {new Date(bet.resolved_at).toLocaleString()}
                  </small>
                )}
              </div>

              <p className="mb-1">
                <strong>Playground:</strong> {bet.playground_id}
              </p>
              <p className="mb-2">
                <strong>Winning Option:</strong> {bet.winner_option_label || `#${bet.winner_option_id}`}
              </p>

              <h6>Winners</h6>
              {bet.winners?.length ? (
                <ul className="list-group mb-3">
                  {bet.winners.map((w) => (
                    <li key={w.id} className="list-group-item d-flex justify-content-between">
                      <span>👤 {w.username}</span>
                      <span className="text-muted">id: {w.id}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-light">No winners recorded.</div>
              )}

              <div className="d-flex gap-2">
                {/* Si quieres navegar al detalle de la bet, ajusta la ruta si la tienes */}
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate(`/playground/${bet.playground_id}/bet/${bet.bet_id}`)}
                >
                  View bet
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


