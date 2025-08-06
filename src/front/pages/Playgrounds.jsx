import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Playgrounds = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [user, setUser] = useState(undefined);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Comprobar usuario logueado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          setUser(null);
          return;
        }
        const data = await resp.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const getPlaygrounds = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error("Failed to fetch playgrounds");
        const data = await resp.json();
        setPlaygrounds(data.playgrounds);
      } catch (err) {
        console.error(err);
        setError("Error fetching playgrounds");
      }
    };

    if (user) {
      getPlaygrounds();
    }
  }, [user]);

  
  if (user === undefined) {
    return <div className="container mt-5"><p>Cargando...</p></div>;
  }

  
  const token = localStorage.getItem("token");
  if (!token || user === null) {
    return (
      <div className="container mt-5">
        <p>Por favor, inicie sesión para ver los playgrounds.</p>
      </div>
    );
  }

  
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este playground?")) return;

    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Error al eliminar playground");

      setPlaygrounds(prev => prev.filter(pg => pg.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error al eliminar playground");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Playgrounds</h2>
        {user && (
          <button className="btn btn-primary" onClick={() => navigate("/playground/create")}>
            New Playground
          </button>
        )}
      </div>

      {successMessage && (
        <div className="alert alert-success w-100" role="alert">
          {successMessage}
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}

      {playgrounds.length === 0 ? (
        <p>No hay playgrounds todavía.</p>
      ) : (
        <ul className="list-group">
          {playgrounds.map(pg => (
            <li
              key={pg.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{pg.name}</strong> 
                <small className="text-muted">
                  ({pg.slug}) - Creador: {pg.creator_name || "Desconocido"}
                </small>
                {pg.is_invited && (
                  <span className="badge bg-info text-dark ms-2">Invitado</span>
                )}
              </div>
              <div>
                
                {(user?.username === pg.creator_name || pg.is_invited) && (
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => navigate(`/playground/${pg.id}`)}
                  >
                    Entrar
                  </button>
                )}

                
                {user?.username === pg.creator_name && (
                  <>
                    <button
                      onClick={() => navigate(`/playground/edit/${pg.id}`)}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(pg.id)}
                      className="btn btn-sm btn-outline-danger me-2"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
