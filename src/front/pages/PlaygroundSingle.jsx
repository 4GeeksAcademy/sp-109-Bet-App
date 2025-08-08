import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";


export const PlaygroundSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [playground, setPlayground] = useState(null);
    const [bets, setBets] = useState([]);
    const [messages, setMessages] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [search, setSearch] = useState("");
    const [showInvite, setShowInvite] = useState(false);
    const [inviteMsg, setInviteMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    // Cargar datos principales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [pgResp, betsResp, msgResp] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}`),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet`),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/messages`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                if (pgResp.ok) {
                    const pgData = await pgResp.json();
                    setPlayground(pgData.playground);
                }
                if (betsResp.ok) {
                    const betsData = await betsResp.json();
                    setBets(betsData);
                }
                if (msgResp.ok) {
                    const msgData = await msgResp.json();
                    setMessages(msgData);
                }
            } catch (err) {
                setError("Error loading data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Invitar usuario
    const fetchUsers = async () => {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
        const data = await resp.json();
        setUsersList(data);
    };

    const handleInvite = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ user_id: userId })
            });

            if (!resp.ok) throw new Error();
            setInviteMsg("✅ Usuario invitado correctamente");
        } catch {
            setInviteMsg("❌ Error al invitar usuario");
        }
    };

    // Enviar mensaje
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content: newMessage }),
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error();

            setMessages(prev => [...prev, data.message]);
            setNewMessage("");
        } catch {
            setError("Error al enviar el mensaje");
        }
    };

    if (loading) return <p className="text-center mt-5">⏳ Loading...</p>;
    if (error) return <p className="text-center text-danger mt-5">{error}</p>;

    return (
        <div className="container mt-5 bg-light shadow-sm rounded p-3 h-100">

            {/* Cabecera */}
            <div className="text-center mb-4">
                <h1 className="text-primary">{playground?.name}</h1>
                <p className="text-muted">{playground?.description}</p>
            </div>

            <div className="row g-4">
                {/* Mensajes */}
                <div className="col-md-3">
                    <div className="bg-white shadow-sm rounded p-3 h-100">
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
                            {messages.length === 0
                                ? <p className="text-muted">No hay mensajes aún.</p>
                                : messages.map(msg => (
                                    <div key={msg.id}><strong>{msg.username}</strong>: {msg.content}</div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* Apuestas */}
                <div className="col-md-6">
                    <div className="bg-white shadow rounded p-3 h-100">
                        <h4>🎯 Apuestas</h4>
                        {bets.length === 0
                            ? <p className="text-muted">No bets found.</p>
                            : <ul className="list-group">
                                {bets.map(bet => (
                                    <li
                                        key={bet.id}
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(`/playground/${id}/bet/${bet.id}`)}
                                    >

                                        <div className="d-flex flex-column">
                                            <strong>{bet.name}</strong>
                                            <div>
                                                <span className="badge bg-success">
                                                    {bet.status}
                                                </span>
                                            </div>
                                        </div>


                                        <div className="small text-muted d-flex align-items-center gap-1">
                                            <FaRegClock />
                                            {bet.deadline
                                                ? new Date(bet.deadline).toLocaleDateString()
                                                : "Sin fecha"}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        }
                        <button
                            className="btn btn-primary w-100 mt-2"
                            onClick={() => navigate(`/playground/${id}/bet`)}
                        >
                            ➕ Crear nueva apuesta
                        </button>
                    </div>
                </div>

                {/* Invitaciones */}
                <div className="col-md-3">
                    <div className="bg-white shadow-sm rounded p-3 h-100">
                        <h4>👥 Invitar usuario</h4>
                        <button
                            className="btn btn-outline-primary mb-2"
                            onClick={() => {
                                setShowInvite(!showInvite);
                                fetchUsers();
                            }}
                        >
                            {showInvite ? "Cerrar" : "Buscar usuarios"}
                        </button>
                        {showInvite && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Buscar usuario..."
                                    className="form-control mb-2"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="list-group">
                                    {usersList
                                        .filter((u) =>
                                            u.username.toLowerCase().includes(search.toLowerCase()) ||
                                            u.email.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map((u) => (
                                            <button
                                                key={u.id}
                                                className="list-group-item list-group-item-action d-flex justify-content-between"
                                                onClick={() => handleInvite(u.id)}
                                            >
                                                {u.username} ({u.email})
                                                <span className="badge bg-success">Invitar</span>
                                            </button>
                                        ))}
                                </div>
                                {inviteMsg && <p className="mt-2">{inviteMsg}</p>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};