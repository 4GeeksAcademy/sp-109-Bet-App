import React, { useEffect, useState } from "react";

export const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");

  const getMessages = async () => {
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/messages");
      if (!resp.ok) throw new Error("Failed to fetch messages");
      const data = await resp.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, content }),
    });
    setUsername("");
    setContent("");
    getMessages();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/messages/${id}`, {
        method: "DELETE",
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
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
        {messages.map((msg) => (
          <li key={msg.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{msg.username}</strong>: {msg.content}
            </div>
            <div>
              <button onClick={() => handleEdit(msg.id)} className="btn btn-sm btn-outline-secondary me-2">✏️ Edit</button>
              <button onClick={() => handleDelete(msg.id)} className="btn btn-sm btn-outline-danger">🗑️ Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
