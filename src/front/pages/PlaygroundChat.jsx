import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";

const PlaygroundChat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    reloadMessages();
  }, [id]);

  const reloadMessages = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/chats`)
      .then((res) => res.json())
      .then((data) => setMessages(data.chats));
  };

  const sendMessage = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 4,
        playground_id: parseInt(id),
        message: input,
      }),
    }).then(() => {
      setInput("");
      reloadMessages();
    });
  };

  const deleteMessage = (messageId) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${messageId}`, {
      method: "DELETE",
    }).then(() => reloadMessages());
  };

  const startEdit = (chat) => {
    setEditingId(chat.id);
    setEditInput(chat.message);
  };

  const saveEdit = (chat) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${chat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: chat.user_id,
        playground_id: chat.playground_id,
        message: editInput,
      }),
    }).then(() => {
      setEditingId(null);
      reloadMessages();
    });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Playground Chat (ID: {id})</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              sendMessage();
            }
          }}
        />
        <button
          className={`btn btn-${input.trim() ? "primary" : "secondary"}`}
          disabled={!input.trim()}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      {messages.map((chat) => (
        <div key={chat.id} className="card mb-3">
          <div className="card-body d-flex justify-content-between">
            <div className="flex-grow-1 pe-3">
              <h6 className="card-subtitle mb-2 text-muted">
                User #{chat.user_id}
              </h6>

              {editingId === chat.id ? (
                <>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editInput.trim()) {
                        saveEdit(chat);
                      }
                    }}
                  />
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => saveEdit(chat)}
                    disabled={!editInput.trim()}
                  >
                    <FaSave className="me-1" />
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="card-text">{chat.message}</p>
                </>
              )}

              <small className="text-muted">
                {new Date(chat.created_at).toLocaleString()}
              </small>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => startEdit(chat)}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this message?")
                  ) {
                    deleteMessage(chat.id);
                  }
                }}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaygroundChat;
