import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";


export const BetSingle = () => {
  const { id, betId } = useParams();
  const navigate = useNavigate();
  const { token, role, logout, user, login } = useAuth()

  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // --- resolución manual bet ---- //

  const [showResolve, setShowResolve] = useState(false);
  const [winnerOption, setWinnerOption] = useState(null);
  const [resolving, setResolving] = useState(false);

  // --- Winners modal state ---
  const [showWinners, setShowWinners] = useState(false);
  const [winners, setWinners] = useState([]);
  const [loadingWinners, setLoadingWinners] = useState(false);
  const [winnersError, setWinnersError] = useState(null);

  // --- Helpers roles ---

  const isAdmin = role === "admin";
  const isUser = role === "user";
  const notEnoughMoney = user?.money < bet?.amount;
  const isCreator = bet?.user_id === user?.id;

  //---Helper deadline + estados---

  const apiLinked   = !!bet?.external_match_id;                // deportiva con API
  const deadlineMs  = bet?.deadline ? Date.parse(bet.deadline) : null;
  const nowMs       = Date.now();

  const deadlinePassed = !!deadlineMs && deadlineMs <= nowMs;
  const isLocked   = bet?.status === "locked";
  const isResolved = bet?.status === "resolved";


  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }),
    [token]
  );
  
  // --- img helper ---    
  const getBetImage = (b) =>
    b?.url_image || (b?.id ? localStorage.getItem(`bet-image-${b.id}`) : null);

  // --- cargar apuesta ---
  const fetchBet = async () => {
    try {
      setLoading(true);
      setError(null);

      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}`,
        { headers }
      );

      if (resp.status === 401) {
        logout()
        if (isAdmin) {          
          navigate("/admin/login", { replace: true, state: { msg: "Session expired" } });
        } else {
        navigate("/login", { replace: true, state: { msg: "Session expired" } });
        }
        return;
      }

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      const raw = await resp.json();
      const b = raw?.bet ?? raw;
      setBet(b);

      const userVoteId =
        (typeof b.user_vote === "number" && b.user_vote) ||
        b.user_vote?.id ||
        b.user_vote?.option_id ||
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

  
  // Polling/Votaciones - Si la apuesta no está resuelta 
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


  // Modal de ganadores de la apuesta en la que estamos
  const openWinnersModal = async () => {
    setShowWinners(true);
    setLoadingWinners(true);
    setWinnersError(null);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}/winners`,
        { headers }
      );
      if (resp.status === 401) {
        if (isAdmin) {
          logout()
          navigate("/admin/login", { replace: true, state: { msg: "Session expired" } });
        } else {
          logout()
          navigate("/login", { replace: true, state: { msg: "Session expired" } });
        }
        return;
      }

      const text = await resp.text();
      if (!resp.ok) {
        let msg = "";
        try { msg = JSON.parse(text).message; } catch { msg = text; }
        throw new Error(msg || `Failed to load winners (HTTP ${resp.status})`);
      }

      const data = JSON.parse(text);
      setWinners(Array.isArray(data.winners) ? data.winners : []);
    } catch (e) {
      setWinnersError(e.message || "Error loading winners");
    } finally {
      setLoadingWinners(false);
    }
  };

  const closeWinnersModal = () => {
    setShowWinners(false);
    setWinners([]);
    setWinnersError(null);
  };

  // --- Votar ---
  const votingDisabled =
      !bet ||
      isLocked ||
      isResolved ||
      bet?.status === "cancelled" ||
      deadlinePassed;


  //--- Manejo de votaciones --- //

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

    // Manejo de sesión expirada
    if (response.status === 401) {
      logout();
      navigate(isAdmin ? "/admin/login" : "/login", {
        replace: true,
        state: { msg: "Session expired" },
      });
      return;
    }

    const text = await response.text();

    if (!response.ok) {
      let msg = "";
      try {
        msg = JSON.parse(text).message;
      } catch {
        msg = text;
      }
      throw new Error(msg || `Vote failed (HTTP ${response.status})`);
    }

    let updatedBet = null;
    try {
      updatedBet = JSON.parse(text);
    } catch {}

    if (updatedBet) {
      setBet(updatedBet);

      const uv =
        (typeof updatedBet.user_vote === "number" && updatedBet.user_vote) ||
        updatedBet.user_vote?.id ||
        updatedBet.user_vote?.option_id ||
        null;
      setSelectedOption(uv ? Number(uv) : null);

      // 🔹 Actualizar el saldo del usuario
      if (user && updatedBet.amount) {
        login(token, { ...user, money: user.money - updatedBet.amount }, role);
      }
    } else {
      await fetchBet();
    }

    alert("Vote submitted successfully!");
    navigate(`/playground/${id}`);
  } catch (err) {
    alert(err.message);
  } finally {
    setSubmitting(false);
  }
};


  // --- Resolver manual ---

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
          headers,
          body: JSON.stringify({ winner_option_id: Number(winnerOption) }),
        }
      );

      if (resp.status === 401) {
        logout()
        if (isAdmin) {
        navigate("/admin/login", { replace: true, state: { msg: "Session expired" } });
        } else {
          logout()
          navigate("/login", { replace: true, state: { msg: "Session expired" } });
        }
        return;
      }

      if (resp.status === 403) {
        const t = await resp.text();
        let msg;
        try { msg = JSON.parse(t).message; } catch { msg = t; }
        throw new Error(msg || "Forbidden: you are not allowed to resolve this bet");
      }

      const text = await resp.text();
      if (!resp.ok) {
        let msg = "";
        try {
          msg = JSON.parse(text).message;
        } catch { msg = text; }
        throw new Error(msg || `Resolve failed (HTTP ${resp.status})`);
      }

      let updated = null;
      try { updated = JSON.parse(text); } catch { }
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

  // --- Render ---

  if (loading) return <p>Loading bet...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!bet) return <p>Bet not found.</p>;

  const winnerLabel =
    bet.winner_option_id &&
    bet.options?.find((o) => o.id === bet.winner_option_id)?.label;


  // --- Botón se muestra siempre al admin si no está resuelta/cancelada la apuesta y al creador sí ya pasó el deadline para resolverla  ---
  
  const canManualResolveUI = isAdmin
    ? !isResolved
    : (isCreator || isAdmin) && !isResolved && (isLocked || deadlinePassed);


  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">🎯 {bet.name}</h3>

          {/* Imagen si existe (del backend o guardada en localStorage) */}
          {getBetImage(bet) && (
            <div className="mb-3 text-center">
              <img
                src={getBetImage(bet)}
                alt={bet.name}
                className="img-fluid rounded"
                style={{ maxHeight: 260, objectFit: "cover" }}
              />
            </div>
          )}

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
            <strong>{apiLinked ? "Kickoff" : "Deadline"}:</strong>{" "}
            {deadlineMs
              ? new Date(bet.deadline).toLocaleString()
              : apiLinked
                ? "Not available yet"
                : "No deadline"}

            {apiLinked && deadlineMs && (
              <span className="ms-2 badge bg-info">from API</span>
            )}
          </div>
          <div className="mb-2">
            <strong>Resolved at:</strong>{" "}
            {bet.resolved_at ? new Date(bet.resolved_at).toLocaleString() : "Not resolved"}
          </div>

          {bet.status === "resolved" && (
            <div className="alert alert-info">
              🏆 Winner Option: <strong>{winnerLabel || `#${bet.winner_option_id}`}</strong>
            </div>
          )}

          {deadlinePassed && !isResolved && (
            <div className="alert alert-warning">
              {apiLinked ? "Kickoff passed." : "Deadline passed."} Waiting for result…
            </div>
          )}

          {Array.isArray(bet.options) && bet.options.length > 0 && (
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
                        {isSelected && <span className="badge bg-success">Your choice</span>}
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
              ) : notEnoughMoney ? (
                <div className="alert alert-danger mt-3">
                  ❌ You don’t have enough balance to participate. (Need {bet.amount} €)
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

              {canManualResolveUI && (
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
                  onClick={openWinnersModal}
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

        {/* Winners modal muestra lista de ganadores de la apuesta en la que está*/}
        {showWinners && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">🏆 Winners</h5>
                  <button className="btn-close" onClick={closeWinnersModal} />
                </div>

                <div className="modal-body">
                  {loadingWinners && <div>Loading winners…</div>}
                  {!loadingWinners && winnersError && (
                    <div className="alert alert-warning mb-0">
                      {winnersError}
                    </div>
                  )}

                  {!loadingWinners && !winnersError && (
                    <>
                      {bet.winner_option_id && (
                        <p className="text-muted mb-2">
                          Winner option: <strong>
                            {bet.options?.find(o => o.id === bet.winner_option_id)?.label
                              || `#${bet.winner_option_id}`}
                          </strong>
                        </p>
                      )}

                      {winners.length === 0 ? (
                        <div className="alert alert-secondary mb-0">
                          No winners recorded.
                        </div>
                      ) : (
                        <ul className="list-group">
                          {winners.map(w => (
                            <li key={w.id} className="list-group-item d-flex justify-content-between">
                              <span>👤 {w.username}</span>
                              <span className="text-muted">id: {w.id}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeWinnersModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}