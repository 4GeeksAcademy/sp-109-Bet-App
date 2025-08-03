import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PlayGroundUser = () => {
    const { id } = useParams(); // ID del playground
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvitedUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Necesitas estar logueado");
                    setLoading(false);
                    return;
                }

                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/members`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!resp.ok) {
                    throw new Error("Error al obtener los usuarios invitados");
                }

                const data = await resp.json();
                setUsers(data.members || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitedUsers();
    }, [id]);

    if (loading) return <div className="container mt-5">Cargando usuarios...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Usuarios invitados al Playground</h2>
            {users.length === 0 ? (
                <p>No hay usuarios invitados todavía.</p>
            ) : (
                <ul className="list-group mt-3">
                    {users.map(user => (
                        <li key={user.id} className="list-group-item">
                            <strong>{user.username}</strong> ({user.email})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
