import React, { useEffect, useState } from "react";

export const Requests = () => {
  const [user, setUser] = useState(undefined);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          setUser(null);
          return;
        }
        const data = await resp.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error al obtener usuario", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReceived(data.received || []);
        setSent(data.sent || []);
      } catch (err) {
        console.error("Error fetching requests", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRequests();
  }, [user]);

  const handleAction = async (reqId, action) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/requests/${reqId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setReceived((prev) => prev.filter((r) => r.id !== reqId)); // ✅ quitar de la lista
      }
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  if (user === undefined || loading) return <div className="container mt-5">Cargando...</div>;
  if (user === null) return <div className="container mt-5">Inicia sesión para ver tus solicitudes.</div>;

  return (
    <div className="container mt-5">
      <h2>📥 Solicitudes Recibidas</h2>
      {received.length === 0 ? (
        <p>No tenés solicitudes pendientes.</p>
      ) : (
        <ul className="list-group mb-4">
          {received.map((req) => (
            <li key={req.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                {/* ✅ Diferencia entre invitación y solicitud */}
                {req.status === "invited" ? (
                  <>Te invitaron a <strong>{req.playground_name}</strong></>
                ) : (
                  <>
                    <strong>{req.user_name}</strong> quiere unirse a{" "}
                    <strong>{req.playground_name}</strong>
                  </>
                )}
              </span>
              <div>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(req.id, "accept")}>
                  Aceptar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleAction(req.id, "reject")}>
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2>📤 Solicitudes Enviadas</h2>
      {sent.length === 0 ? (
        <p>No has enviado ninguna solicitud.</p>
      ) : (
        <ul className="list-group">
          {sent.map((req) => (
            <li key={req.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                Solicitaste acceso a <strong>{req.playground_name}</strong> – <em>{req.status}</em>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
