import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Miniatura con fallback SVG embebido (sin red) y sin parpadeo
function PgThumb({ src, name, alt }) {
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => {
    if (!name) return "PG";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second || first || "PG").toUpperCase();
  }, [name]);

  // Color de fondo suave y texto oscuro
  const placeholder = useMemo(() => {
    const bg = "#dee2e6"; // gris claro
    const fg = "#495057"; // gris oscuro
    const text = initials;
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'>
        <rect width='100%' height='100%' rx='8' ry='8' fill='${bg}'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
              font-family='Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif'
              font-size='18' font-weight='600' fill='${fg}'>${text}</text>
      </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [initials]);

  const finalSrc = imgError || !src || src.trim() === "" ? placeholder : src;

  return (
    <img
      src={finalSrc}
      alt={alt || "Playground"}
      width={56}
      height={56}
      style={{
        width: 56,
        height: 56,
        objectFit: "cover",
        borderRadius: 8,
        marginRight: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        background: "#f8f9fa"
      }}
      onError={() => setImgError(true)}
    />
  );
}

export const Playgrounds = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [user, setUser] = useState(undefined);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Comprobar usuario logueado
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
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Mensaje de éxito tras crear/editar
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Cargar playgrounds
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
      } catch {
        setError("Error fetching playgrounds");
      }
    };

    if (user) getPlaygrounds();
  }, [user]);

  if (user === undefined) {
    return (
      <div className="container mt-5">
        <p>Cargando...</p>
      </div>
    );
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

      setPlaygrounds((prev) => prev.filter((pg) => pg.id !== id));
    } catch {
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
          {playgrounds.map((pg) => (
            <li
              key={pg.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {/* Izquierda: miniatura + info */}
              <div className="d-flex align-items-center">
                <PgThumb src={pg.url_image} name={pg.name} alt={pg.name} />
                <div>
                  <strong>{pg.name}</strong>{" "}
                  <small className="text-muted">
                    ({pg.slug}) - Creador: {pg.creator_name || "Desconocido"}
                  </small>
                  {pg.is_invited && (
                    <span className="badge bg-info text-dark ms-2">Invitado</span>
                  )}
                </div>
              </div>

              {/* Derecha: acciones */}
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
