import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { Modal, Button } from "react-bootstrap";

export const BetSingle = () => {
  const { id, betId } = useParams();
  const navigate = useNavigate();

  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // --- manejo de resolución ---- //

  const [showResolve, setShowResolve] = useState(false);
  const [winnerOption, setWinnerOption] = useState(null);
  const [resolving, setResolving] = useState(false);

  const isCreator = bet?.user_id === Number(localStorage.getItem("user_id"));

  const handleResolve = async () => {
    if (!winnerOption) {
      alert("Select a winner option");
      return;
    }
    try {
      setResolving(true);
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}/resolve-manual`,
        {
          method: "PUT",
          headers, // usa los memorizados
          body: JSON.stringify({ winner_option_id: Number(winnerOption) }),
        }
      );

      if (resp.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true, state: { msg: "Session expired" } });
        return;
      }

      const text = await resp.text();
      if (!resp.ok) {
        let msg = "";
        try { msg = JSON.parse(text).message; } catch { msg = text; }
        throw new Error(msg || `Resolve failed (HTTP ${resp.status})`);
      }

      
      let updated = null;
      try { updated = JSON.parse(text); } catch {}
      if (updated) setBet(updated); else await fetchBet();

      setWinnerOption(null);
      setShowResolve(false);
      alert("Bet resolved successfully!");
    } catch (err) {
      alert(err.message || "Error resolving bet");
    } finally {
      setResolving(false);
    }
  };

  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  // useEffect(() => {
    const fetchBet = async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}`,
          { headers: { Authorization: token ? `Bearer ${token}`: undefined } }
        );

        if (resp.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", {
            replace: true,
            state: { msg: "Session expired. Please log in again." },
        });
        return;
      }

      const text = await resp.text();
      if (!resp.ok) throw new Error(text || `HTTP ${resp.status}`);

      const betData = JSON.parse(text);
      setBet(betData);

      // if (betData.user_vote) {
      //   setSelectedOption(Number(betData.user_vote));
      // } else {
      //   setSelectedOption(userVoteId ? Number(userVoteId) : null);
      // }
      // } 
      const userVoteId =
        (typeof betData.user_vote === "number" && betData.user_vote) ||
        betData.user_vote?.id ||
        betData.user_vote?.option_id ||
        null;

      setSelectedOption(userVoteId ? Number(userVoteId) : null);
      } catch (e) {
        setError(e.message || "Error loading bet");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchBet();
    }, [id, betId, token]);

   useEffect(() => { 
    if (!bet) return;
    const interval = setInterval(() => {
      const deadlinePassed =
        bet.deadline && new Date(bet.deadline).getTime() <= Date.now();
      const needsPolling =
        bet.status !== "resolved" && (deadlinePassed || bet.status === "locked");
      if (needsPolling) fetchBet();
    }, 15000);
    return () => clearInterval(interval);
    }, [bet]);
  
  // }, [id, betId, token]);

  const votingDisabled =
    !bet ||
    bet.status === "locked" ||
    bet.status === "resolved" ||
    bet.status === "cancelled" ||
    (bet.deadline && new Date(bet.deadline).getTime() <= Date.now());


    // Manejo de votaciones //

  const handleVote = async () => {
    if (!selectedOption) {
      alert("Please select an option before voting.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}/vote`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ option_id: Number(selectedOption) }),
          }
      );

      if (!response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login",{
        replace: true,
        state: { msg: "Session expired. Please log in again." }
        });
        return;
      }
      
      const text = await response.text();
      if (!response.ok) {
        let msg = "";
      try { msg = JSON.parse(text).message;} catch {msg = text;}
      throw new Error(msg || `Vote failed (HTTP ${response.status})`);
      }

      let updated = null;
      try { updated = JSON.parse(text);
      } catch { }
      if (!updated) {
        await fetchBet();
      } else {
        setBet(updated);
        const uv =
          (typeof updated.user_vote === "number" && updated.user_vote) ||
          updated.user_vote?.id ||
          updated.user_vote?.option_id ||
          null;
        setSelectedOption(uv ? Number(uv) : null);
      }

      alert("Vote submitted successfully!");
      navigate(`/playground/${id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return <p>Loading bet...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!bet) return <p>Bet not found.</p>;

  const winnerLabel =
    bet.winner_option_id &&
    bet.options?.find((o) => o.id === bet.winner_option_id)?.label;

  const deadlinePassed =
  bet.deadline && new Date(bet.deadline).getTime() <= Date.now();
  

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
            <h3 className="card-title mb-3">🎯 {bet.name}</h3>

            <div className="mb-2"><strong>ID:</strong> {bet.id}</div>
            <div className="mb-2"><strong>Event:</strong> {bet.event_description || "No description"}</div>
            <div className="mb-2"><strong>Amount:</strong> {bet.amount} €</div>
            <div className="mb-2"><strong>Type:</strong> {bet.type}</div>
            <div className="mb-2"><strong>Status:</strong> {bet.status}</div>
            <div className="mb-2"><strong>Created by:</strong>  {bet.user || "Unknown"}</div>
            <div className="mb-2"><strong>Playground:</strong> {bet.playground || "N/A"}</div>
            <div className="mb-2">
              <strong>Created at:</strong>{" "}
              {bet.created_at ? new Date(bet.created_at).toLocaleString() : "N/A"}
            </div>
            <div className="mb-2">
              <strong>Deadline:</strong>{" "}
              {bet.deadline ? new Date(bet.deadline).toLocaleString() : "No deadline"}
            </div>
            <div className="mb-2">
              <strong>Resolved at:</strong>{" "}
              {bet.resolved_at ? new Date(bet.resolved_at).toLocaleString() : "Not resolved"}
            </div>
            
            {bet.status === "resolved" && (
              <div className="alert alert-info">
                🏆 Winner: <strong>{winnerLabel || `#${bet.winner_option_id}`}</strong>
              </div>
            )}
          
            {deadlinePassed && bet.status !== "resolved" && (
              <div className="alert alert-warning">
                Deadline passed. Waiting for result…
              </div>
            )}

            {bet.options && bet.options.length > 0 && (
              <div className="mt-3">
                <h5>📌 Options</h5>
                <ul className="list-group">
                {bet.options.map((option) => {
                  const isSelected = Number(selectedOption) === Number(option.id);
                  const canSelect = !bet.user_vote && !votingDisabled;
                  return (
                    <li
                      key={option.id}
                      className={`list-group-item ${isSelected ? "active" : ""}`}
                      style={{ 
                        cursor: canSelect ? "pointer" : "not-allowed",
                        opacity: canSelect ? 1 : 0.8,
                      }}
                        onClick={() => {
                        if (canSelect) setSelectedOption(Number(option.id));
                      }}
                    >
                    <div className="d-flex justify-content-between align-items-center">
                        <span>{option.label}</span>
                        {isSelected &&(
                          <span className="badge bg-success">Your choice</span>
                        )}
                    </div>
                  </li>
                  );
                })}
            </ul>

                
            {bet.user_vote ? (
              <div className="alert alert-success mt-3">
                  You've already voted in this bet.
                </div>  
              ) : votingDisabled ? (
                  <div className="alert alert-warning mt-3">
                    Voting is closed for this bet.
                  </div>
              ) : (

                  <button
                    className="btn btn-success mt-3"
                    onClick={handleVote}
                    disabled={submitting || !selectedOption}
                  >
                    {submitting ? "Submitting..." : "✅ Submit Vote"}
                  </button>
                )}
              </div>
            )}


          <div className="mt-4 d-flex justify-content-between align-items-center">
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => navigate(`/playground/${id}/bet/${betId}/edit`)}
                disabled={!!bet.user_vote || 
                  bet.status === "resolved" ||
                  bet.status === "locked"
                }
              >
                  ✏️ Edit
              </button>

              {isCreator && bet.status !== "resolved" && (
                <button
                  className="btn btn-outline-warning"
                  onClick={() => setShowResolve(true)}
                >
                  🛠 Finalizar apuesta
                </button>
              )}

            {bet.status === "resolved" && (
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate(`/playground/${id}/bet/${betId}/winners`)}
              >
                🏆 See winners
              </button>
            )}
            </div>

            <button
              className="btn btn-outline-danger"
              onClick={() => navigate(`/playground/${id}/`)}
            >
              ⬅️ Go Back
            </button>
            
          </div>
        </div>
        
{/* solución manual de apuestas que no son de la api  */}
        {showResolve && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Finalize bet</h5>
                    <button className="btn-close" onClick={() => { setShowResolve(false); setWinnerOption(null); }} />
                  </div>
                  <div className="modal-body">
                    <label className="form-label">Select winning option:</label>
                    <select
                      className="form-select"
                      value={winnerOption ?? ""}
                      onChange={(e) => setWinnerOption(Number(e.target.value) || null)}
                    >
                      <option value="">— Select winner —</option>
                      {bet?.options?.map(o => (
                        <option key={o.id} value={o.id}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => { setShowResolve(false); setWinnerOption(null); }}>
                      Cancel
                    </button>
                    <button className="btn btn-success" onClick={handleResolve} disabled={resolving || !winnerOption}>
                      {resolving ? "Resolving…" : "✅ Confirm winner"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      
      </div>
    </div>
  );
};




