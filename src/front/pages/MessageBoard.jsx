import React, { useEffect, useState } from "react";

export const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  // ✅ Obtener mensajes solo de los playgrounds del usuario
  const getMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debes iniciar sesión para ver los mensajes.");
        return;
      }

      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/messages/my-playgrounds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Failed to fetch messages");

      const data = await resp.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Error cargando mensajes");
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
      if (!resp.ok) throw new Error("Error enviando mensaje");

      setUsername("");
      setContent("");
      getMessages();
    } catch (err) {
      console.error(err);
      setError("No se pudo enviar el mensaje");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este mensaje?")) return;
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
