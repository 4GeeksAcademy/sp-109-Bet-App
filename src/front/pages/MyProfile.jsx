import React, { useEffect, useState } from "react";

export const MyProfile = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const token = localStorage.getItem("token");

    const fetchMyUser = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (resp.ok) {
                const data = await resp.json();
                setUser(data.user);
                setFormData(data.user); // inicializa para edición
            } else {
                console.error("No se pudo obtener el usuario");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (resp.ok) {
                setEditMode(false);
                fetchMyUser();
            }
        } catch (err) {
            console.error("Error al actualizar:", err);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar tu cuenta?")) return;
        try {
            await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${user.id}`, {
                method: "DELETE",
            });
            localStorage.removeItem("token");
            window.location.href = "/";
        } catch (err) {
            console.error("Error al eliminar cuenta:", err);
        }
    };

    useEffect(() => {
        if (token) fetchMyUser();
    }, []);

    if (!token) return <p>Debes estar logueado para ver tu perfil.</p>;
    if (!user) return <p>Cargando...</p>;

    return (
        <div className="container mt-5">
            <h2>Mi Perfil</h2>

            {editMode ? (
                <div>
                    <input
                        type="text"
                        className="form-control mb-2"
                        name="username"
                        value={formData.username || ""}
                        onChange={handleChange}
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        className="form-control mb-2"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        name="money"
                        value={formData.money || 0}
                        onChange={handleChange}
                        placeholder="Money"
                    />
                    <button onClick={handleSave} className="btn btn-success me-2">Guardar</button>
                    <button onClick={() => setEditMode(false)} className="btn btn-secondary">Cancelar</button>
                </div>
            ) : (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Dinero:</strong> {user.money}</p>
                    <button onClick={() => setEditMode(true)} className="btn btn-primary me-2">Editar</button>
                    <button onClick={handleDelete} className="btn btn-danger">Eliminar cuenta</button>
                </div>
            )}
        </div>
    );
};