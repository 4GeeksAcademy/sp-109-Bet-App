import React, { useState } from "react";
import { useParams } from "react-router-dom";

export const PlaygroundInvite = () => {
  const { id } = useParams(); // id del playground
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: parseInt(userId) })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.msg || "Error al invitar");
      setMessage("Usuario invitado correctamente");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Invitar usuario al playground</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <input
        type="text"
        placeholder="ID del usuario"
        className="form-control mb-2"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleInvite}>
        Invitar
      </button>
    </div>
  );
};
