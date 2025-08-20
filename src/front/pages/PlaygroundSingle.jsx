// src/front/pages/PlaygroundSingle.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { useAuth } from "../hooks/AuthContext";
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import "../styles/PlaygroundSingle.css";

export const PlaygroundSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Estados principales
  const [playground, setPlayground] = useState(null);
  const [bets, setBets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Invitaciones
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");

  // Subida de imagen
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const openFilePicker = () => fileInputRef.current?.click();

  // Helpers
  const uploadToCloudinary = async (file) => {
    const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) throw new Error("Cloudinary no configurado");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", preset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) throw new Error("Error al subir a Cloudinary");
    const data = await res.json();
    return data.secure_url;
  };

  const patchPlaygroundImage = async (pgId, imageUrl) => {
    const payload = {
      name: playground?.name ?? "",
      description: playground?.description ?? "",
      url_image: imageUrl,
    };

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${pgId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al actualizar imagen");
    return res.json();
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      await patchPlaygroundImage(id, url);
      setPlayground((prev) => (prev ? { ...prev, url_image: url } : prev));
    } catch (err) {
      alert(err?.message || "No se pudo actualizar la imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Fetch datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = token ? { Authorization: `Bearer ${token}` } : {};
        const [pgResp, betsResp, msgResp] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}`, { headers: auth }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet`, { headers: auth }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/messages`, { headers: auth }),
        ]);

        if (pgResp.ok) setPlayground((await pgResp.json()).playground);
        if (betsResp.ok) setBets(await betsResp.json());
        if (msgResp.ok) setMessages(await msgResp.json());
      } catch (e) {
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  // Buscar usuarios
  useEffect(() => {
    let aborted = false;
    const run = async () => {
      if (!showInvite || search.trim().length < 2) return setUsersList([]);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/find?q=${encodeURIComponent(search)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!aborted) setUsersList(data || []);
      } catch {}
    };
    const t = setTimeout(run, 250);
    return () => {
      aborted = true;
      clearTimeout(t);
    };
  }, [showInvite, search, token]);

  const handleInvite = async (userId) => {
    setInviteMsg("");
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.msg || "Error al invitar");
      setInviteMsg(data.msg || "✅ Usuario invitado correctamente");
    } catch (e) {
      setInviteMsg(e.message || "❌ Error al invitar usuario");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: newMessage }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error();
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch {
      setError("Error al enviar el mensaje");
    }
  };

  const getAvatar = (u) =>
    u?.url_image ||
    u?.image ||
    u?.avatar ||
    u?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u?.username || u?.email || "user")}&radius=50`;

  const getBetImage = (bet) =>
    bet?.url_image || (bet?.id ? localStorage.getItem(`bet-image-${bet.id}`) : null);

  return (
    <div className="room-scope">
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      {loading ? (
        <div className="content container py-5 text-center">⏳ Cargando...</div>
      ) : error ? (
        <div className="content container py-5 text-center text-danger">{error}</div>
      ) : (
        <div className="content">
          <div className="container mt-4">
            {/* Cabecera */}
            <div className="text-center mb-4">
              <h1 className="text-primary fw-bold">{playground?.name}</h1>
              {(playground?.url_image || playground?.image) && (
                <div className="d-flex flex-column align-items-center my-3">
                  <img
                    src={playground.url_image || playground.image}
                    alt={playground?.name || "Playground"}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: 260, objectFit: "cover" }}
                  />
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={openFilePicker}
                      disabled={uploading}
                    >
                      {uploading ? "Subiendo..." : "Cambiar foto"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleChangePhoto}
                    />
                  </div>
                </div>
              )}
              <p className="text-muted">{playground?.description}</p>
            </div>

            <div className="row g-4">
              {/* Mensajes */}
              <div className="col-md-3">
                <div className="room-card p-3 h-100">
                  <h4>💬 Mensajes</h4>
                  <form onSubmit={handleSendMessage} className="d-flex gap-2 mb-2">
                    <input
                      className="form-control"
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="btn btn-outline-primary">Enviar</button>
                  </form>
                  <div className="border rounded p-2" style={{ maxHeight: 300, overflowY: "auto" }}>
                    {messages.length === 0 ? (
                      <p className="text-muted">No hay mensajes aún.</p>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id}>
                          <strong>{msg.username}</strong>: {msg.content}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Apuestas */}
              <div className="col-md-6">
                <div className="room-card p-3 h-100">
                  <h4>🎯 Apuestas</h4>
                  {bets.length === 0 ? (
                    <p className="text-muted">No bets found.</p>
                  ) : (
                    <ul className="list-group">
                      {bets.map((bet) => (
                        <li
                          key={bet.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/playground/${id}/bet/${bet.id}`)}
                        >
                          <div className="d-flex align-items-center gap-3">
                            {getBetImage(bet) && (
                              <img
                                src={getBetImage(bet)}
                                alt={bet.name}
                                width={64}
                                height={64}
                                style={{
                                  width: 64,
                                  height: 64,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                  flexShrink: 0,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(getBetImage(bet), "_blank");
                                }}
                              />
                            )}
                            <div className="d-flex flex-column">
                              <strong>{bet.name}</strong>
                              <div>
                                <span className="badge bg-success">{bet.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <FaRegClock />
                            {bet.deadline ? new Date(bet.deadline).toLocaleDateString() : "Sin fecha"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => navigate(`/playground/${id}/bet`)}
                  >
                    ➕ Crear nueva apuesta
                  </button>
                </div>
              </div>

              {/* Invitaciones */}
              <div className="col-md-3">
                <div className="room-card p-3 h-100">
                  <h4>👥 Invitar usuario</h4>
                  <button
                    className="btn btn-outline-primary mb-2 w-100"
                    onClick={() => setShowInvite((v) => !v)}
                  >
                    {showInvite ? "Cerrar" : "Buscar usuarios"}
                  </button>
                  {showInvite && (
                    <>
                      <input
                        type="text"
                        placeholder="Buscar por usuario o email…"
                        className="form-control mb-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <div className="list-group">
                        {usersList.length === 0 ? (
                          <div className="list-group-item text-muted">
                            {search.trim().length < 2
                              ? "Escribe al menos 2 letras…"
                              : "Sin resultados"}
                          </div>
                        ) : (
                          usersList.map((u) => (
                            <button
                              key={u.id}
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                              onClick={() => handleInvite(u.id)}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={getAvatar(u)}
                                  alt={u.username}
                                  width={32}
                                  height={32}
                                  style={{ borderRadius: "50%", objectFit: "cover" }}
                                />
                                <span>
                                  <strong>{u.username}</strong>{" "}
                                  <small className="text-muted">({u.email})</small>
                                </span>
                              </div>
                              <span className="badge bg-success">Invitar</span>
                            </button>
                          ))
                        )}
                      </div>
                      {inviteMsg && <p className="mt-2">{inviteMsg}</p>}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Salir */}
            <div className="mt-4">
              <button className="btn btn-danger" onClick={() => navigate("/playground")}>
                ⬅ Salir
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default PlaygroundSingle;

