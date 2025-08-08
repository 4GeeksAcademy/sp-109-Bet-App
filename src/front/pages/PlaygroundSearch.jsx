import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PlaygroundSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Comprobar usuario logueado
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  // 🔎 Buscar playgrounds
  useEffect(() => {
    const fetchResults = async () => {
      if (!token) return;
      try {
        const endpoint =
          searchText.length >= 4
            ? `/api/playgrounds/search?q=${searchText}`
            : `/api/playgrounds/search`;

        const res = await fetch(import.meta.env.VITE_BACKEND_URL + endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error buscando playgrounds:", err);
      }
    };

    fetchResults();
  }, [searchText]);

  // ✅ Nuevo: usar endpoint de access-request
  const handleRequestAccess = async (playgroundId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${playgroundId}/access-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();
      alert(data.msg || "Acceso solicitado");
    } catch (err) {
      console.error("Error solicitando acceso:", err);
      alert("Error al solicitar acceso");
    }
  };

  return (
    <div className="container mt-5">
      <h2>🔍 Buscar Playground</h2>

      <input
        type="text"
        className="form-control my-3"
        placeholder="Escribe al menos 4 letras..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <ul className="list-group">
        {results.map((pg) => (
          <li
            key={pg.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {pg.name} <small className="text-muted">({pg.slug})</small>
            </span>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleRequestAccess(pg.id)}
            >
              Solicitar acceso
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
