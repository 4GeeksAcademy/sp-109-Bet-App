import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const BetSingle = () => {
  const { id, betId } = useParams();
  const navigate = useNavigate();

  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBet = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );

        if (!response.ok) throw new Error("Error loading bet");

        const betData = await response.json();
        setBet(betData);

        if (betData.user_vote) {
          setSelectedOption(Number(betData.user_vote));
        } else {
          setSelectedOption(null);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBet();
  }, [id, betId, token]);


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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ option_id: selectedOption }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error submitting vote");
      }

      const updatedBet = await response.json();
      setBet(updatedBet);
      setSelectedOption(Number(updatedBet.user_vote));
      alert("Vote submitted successfully!");

      navigate(`/playground/${id}`)
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return <p>Loading bet...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!bet) return <p>Bet not found.</p>;

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

          {bet.options && bet.options.length > 0 && (
  <div className="mt-3">
    <h5>📌 Options</h5>
    <ul className="list-group">
  {bet.options.map((option) => (
    <li
      key={option.id}
      className={`list-group-item ${selectedOption === option.id ? "active" : ""}`}
      style={{ cursor: bet.user_vote ? "default" : "pointer" }}
      onClick={() => {
        if (!bet.user_vote) setSelectedOption(option.id);
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <span>{option.label}</span>
        {selectedOption === option.id && (
          <span className="badge bg-success">Your choice</span>
        )}
      </div>
    </li>
  ))}
</ul>

    
    {bet.user_vote ? (
      <div className="alert alert-success mt-3">
        You've already voted in this bet.
      </div>
    ) : (
      <button
        className="btn btn-success mt-3"
        onClick={handleVote}
        disabled={submitting || bet.user_vote}
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
                disabled={!!bet.user_vote}
              >
                ✏️ Edit
              </button>
            </div>

            <button
              className="btn btn-outline-danger"
              onClick={() => navigate(`/playground/${id}/`)}
            >
              ⬅️ Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};




