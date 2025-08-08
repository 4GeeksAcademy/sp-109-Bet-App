import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("adminToken");

  const loginMessage = location.state?.fromProtected ? "⚠️ Please log in first." : null;

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { state: { fromProtected: true } });
    }
  }, [token, navigate]);


  // ✅ Obtener mensajes solo de los playgrounds del usuario
  const getMessages = async () => {
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Failed to load messages");

      const data = await resp.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Error loading messages:");
    }
  };

  // ✅ Enviar mensaje (en playground general si es necesario)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, content }),
      });
      if (!resp.ok) throw new Error("Error sending message");

      setUsername("");
      setContent("");
      getMessages();
    } catch (err) {
      console.error(err);
      setError("Could not send message");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Failed to delete message");
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const handleEdit = async (id) => {
    const newContent = prompt("Enter the new message content:");
    if (!newContent) return;
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newContent }),
      });
      if (!resp.ok) throw new Error("Failed to edit message");
      const data = await resp.json();
      setMessages(messages.map((m) => (m.id === id ? data.message : m)));
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Message Board</h2>

      {loginMessage && <div className="alert alert-warning">{loginMessage}</div>}
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-3">
        <label className="form-label">Your Name:</label>
        <input
          className="form-control mb-2"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="form-label">Your Message:</label>
        <textarea
          className="form-control mb-2"
          placeholder="Write your message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button className="btn btn-primary" type="submit">Send</button>
      </form>

      <ul className="list-group">
        {messages.length === 0 ? (
          <li className="list-group-item text-muted">No messages found for your playgrounds.</li>
        ) : (
          messages.map((msg) => (
            <li key={msg.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{msg.username}</strong>: {msg.content}
              </div>
              <div>
                <button onClick={() => handleEdit(msg.id)} className="btn btn-sm btn-outline-secondary me-2">✏️ Edit</button>
                <button onClick={() => handleDelete(msg.id)} className="btn btn-sm btn-outline-danger">🗑️ Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
