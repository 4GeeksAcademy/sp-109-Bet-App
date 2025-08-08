import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PlaygroundInvite = () => {
  const { id } = useParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let abort = false;
    const fetchUsers = async () => {
      if (query.trim().length < 2) { setResults([]); return; }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/find?q=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!abort) setResults(data);
      } catch {}
    };
    fetchUsers();
    return () => { abort = true; };
  }, [query]);

  const invite = async (userId) => {
    setMessage("");
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.msg || "Error al invitar");
      setMessage(data.msg || "Invitación enviada");
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 700 }}>
      <h3>Invitar usuario al playground</h3>
      {message && <div className="alert alert-info my-3">{message}</div>}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por usuario o email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="list-group">
        {results.map((u) => (
          <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div><strong>{u.username}</strong> <small className="text-muted">({u.email})</small></div>
            <button className="btn btn-primary btn-sm" onClick={() => invite(u.id)}>Invitar</button>
          </li>
        ))}
        {query && results.length === 0 && (
          <li className="list-group-item text-muted">Sin coincidencias…</li>
        )}
      </ul>
    </div>
  );
};

export default PlaygroundInvite;
