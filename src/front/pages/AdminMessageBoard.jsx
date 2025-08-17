import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export const AdminMessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { token, role, logout } = useAuth();

  // Redirect if no admin token
  useEffect(() => {
    if (!token || role !== "admin") {
      logout();
      navigate("/admin/login", { state: { fromProtected: true } });
    }
  }, [navigate, token, role, logout]);

  const handleUnauthorized = () => {
    logout();
    navigate("/admin/login");
  };

  // Fetch all messages (admin only)
  const getMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/messages",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Failed to fetch messages");

      const data = await resp.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, content }),
      });
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Failed to send message");

      setUsername("");
      setContent("");
      getMessages();
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/api/messages/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
      setError("Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    const newContent = prompt("Enter the new message:");
    if (!newContent) return;
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/api/messages/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newContent }),
        }
      );

      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Failed to edit message");

      const data = await resp.json();
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? data.message : m))
      );
    } catch (err) {
      console.error("Error editing message:", err);
      setError("Failed to edit message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  return (
    <div className="container mt-4">
      <h2>Message Board (Admin View)</h2>

      {loading && <p>Loading...</p>}
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

        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </form>

      <ul className="list-group">
        {messages.length === 0 ? (
          <li className="list-group-item text-muted">No messages found.</li>
        ) : (
          messages.map((msg) => (
            <li
              key={msg.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{msg.username}</strong>: {msg.content}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(msg.id)}
                  className="btn btn-sm btn-outline-secondary me-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
