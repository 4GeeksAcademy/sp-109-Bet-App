import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Playgrounds = () => {

    const [playgrounds, setPlaygrounds] = useState([])
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const getPlaygrounds = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground");
                if (!resp.ok) throw new Error("Failed to fetch playgrounds");
                const data = await resp.json();
                setPlaygrounds(data.playgrounds);
            } catch (err) {
                console.error(err)
                setError("Error fetching playgrounds")
            }
        }

        getPlaygrounds()

    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro que quieres eliminar este playground?")) return;

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`, {
                method: 'DELETE'
            });
            if (!resp.ok) throw new Error("Failed to delete playground")

            setPlaygrounds(playgrounds.filter(pg => pg.id !== id))
        } catch (err) {
            console.error(err);
            setError("Error deleting playground")
        }
    }


    return (
           <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Playgrounds</h2>
        <button className="btn btn-primary" onClick={() => navigate("/playground/create")}>
          New Playground
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {playgrounds.length === 0 ? (
        <p>No hay playgrounds todavía.</p>
      ) : (
        <ul className="list-group">
          {playgrounds.map((pg) => (
            <li
              key={pg.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div 
              onClick={() => navigate(`/playground/${pg.id}`)}
              style={{ cursor: "pointer" }}
            >
                <strong>{pg.name}</strong> <small className="text-muted">({pg.slug})</small>
              </div>
              <div>
                <button
                  onClick={() => navigate(`/playground/edit/${pg.id}`)}
                  className="btn btn-sm btn-outline-secondary me-2"
                  aria-label={`Editar ${pg.name}`}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(pg.id)}
                  className="btn btn-sm btn-outline-danger"
                  aria-label={`Eliminar ${pg.name}`}
                  title="Eliminar"
                >
                  🗑️
                </button>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => navigate(`/playground/${pg.id}/chat`)}
                >
                  💬 Chat
                </button>
                
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    )
}