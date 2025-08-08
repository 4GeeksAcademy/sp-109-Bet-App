import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export const PlaygroundSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [playground, setPlayground] = useState(null);
  const [bets, setBets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mostrar mensaje de éxito tras volver de otra pantalla
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Limpia el state de la URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Cargar Playground, Bets y Mensajes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [pgResp, betsResp, msgResp] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/messages`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (pgResp.ok) {
          const pgData = await pgResp.json();
          setPlayground(pgData.playground);
        } else {
          setPlayground(null);
        }

        if (betsResp.ok) {
          const betsData = await betsResp.json();
          setBets(betsData);
        } else {
          setBets([]);
        }

        if (msgResp.ok) {
          const msgData = await msgResp.json();
          setMessages(msgData);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Enviar mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.msg || "Error sending message");

      // el backend devuelve { message: {...} }
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error al enviar el mensaje");
    }
  };

  // Eliminar Bet
  const handleDelete = async (betId) => {
    if (!window.confirm("Are you sure you want to delete this bet?")) return;

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}`,
        { method: "DELETE" }
      );
      if (!resp.ok) throw new Error("Failed to delete bet");

      setBets((prev) => prev.filter((b) => b.id !== betId));
    } catch (err) {
      console.error(err);
      setError("Error deleting bet");
    }
  };

  // Eliminar opción de una Bet
  const handleDeleteOption = async (betId, optionId) => {
    if (!window.confirm("Are you sure you want to delete this option?")) return;

    setError(null);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}/options/${optionId}`,
        { method: "DELETE" }
      );
      if (!resp.ok) throw new Error("Failed to delete option");

      setBets((prevBets) =>
        prevBets.map((bet) =>
          bet.id === betId
            ? { ...bet, options: bet.options.filter((opt) => opt.id !== optionId) }
            : bet
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-5">⏳ Loading...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!playground) return <p className="text-center text-muted mt-5">Playground not found</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mb-4">
        <h1 className="text-primary">{playground.name}</h1>
        <p>
          <strong>Slug:</strong> {playground.slug}
        </p>

        {playground.url_image || playground.image ? (
          <img
            src={playground.url_image || playground.image}
            alt="Playground"
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        ) : (
          <div className="text-center text-muted bg-light rounded py-5 mb-3">
            No image available
          </div>
        )}

        <p className="fs-5">{playground.description}</p>

        {successMessage && (
          <div className="alert alert-success w-100 mt-3" role="alert">
            {successMessage}
          </div>
        )}

        {/* Crear Bet */}
        <button className="btn btn-primary my-3" onClick={() => navigate(`/playground/${id}/bet`)}>
          ➕ Create New Bet
        </button>

        {/* Abrir pantalla de invitaciones */}
        <div className="my-3">
          <button
            className="btn btn-outline-info"
            onClick={() => navigate(`/playground/${id}/invite`)}
          >
            👥 Invitar Usuario
          </button>
        </div>

        {/* Mensajes */}
        <div className="mt-4">
          <h3>💬 Mensajes</h3>
          <form onSubmit={handleSendMessage} className="mb-3 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="btn btn-success">Enviar</button>
          </form>

          <ul className="list-group">
            {messages.length === 0 ? (
              <li className="list-group-item text-muted">No hay mensajes aún.</li>
            ) : (
              messages.map((msg) => (
                <li key={msg.id} className="list-group-item">
                  <strong>{msg.username}</strong>: {msg.content}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Bets */}
        <h3 className="mt-4">Bets</h3>
        {bets.length === 0 ? (
          <p className="text-muted">No bets found.</p>
        ) : (
          <ul className="list-group">
            {bets.map((bet) => (
              <li key={bet.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="text-dark">{bet.name}</h5>
                    <p>
                      <strong>Event:</strong> {bet.event_description}
                    </p>
                    <p>
                      <strong>Amount:</strong> {bet.amount}
                    </p>
                    <p>
                      <strong>Status:</strong> {bet.status}
                    </p>
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {bet.deadline ? new Date(bet.deadline).toLocaleString() : "No deadline"}
                    </p>
                    <p>
                      <strong>Created by:</strong> {bet.user || "Unknown"}
                    </p>

                    {bet.options && bet.options.length > 0 && (
                      <>
                        <strong>Options:</strong>
                        <ul className="list-group list-group-flush">
                          {bet.options.map((option) => (
                            <li
                              key={option.id}
                              className="list-group-item d-flex justify-content-between align-items-center px-0"
                            >
                              {option.label}
                              <p
                                className="text-danger m-auto"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDeleteOption(bet.id, option.id)}
                              >
                                ❌
                              </p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="btn-group-vertical gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => navigate(`/playground/${id}/bet/${bet.id}/edit`)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => navigate(`/playground/${id}/bet/${bet.id}/options`)}
                    >
                      ➕ Add Option
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(bet.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button className="btn btn-danger mt-4" onClick={() => navigate(`/playground/`)}>
          ⬅ Go Back
        </button>
      </div>
    </div>
  );
};
