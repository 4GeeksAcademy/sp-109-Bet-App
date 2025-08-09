import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyProfileEdit = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resp.ok) throw new Error("Error fetching user");

                const data = await resp.json();
                setUser(data.user);
                setFormData(data.user);
            } catch (err) {
                console.error(err);
            }
        };

        if (token) {
            fetchUser();
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            if (!resp.ok) throw new Error("Error updating user")

            const data = await resp.json()
            navigate("/my-profile")
        } catch (err) {
            console.error(err)
        }
    }
    if (!user) return <p>Cargando...</p>;

    return (
        <div className="container mt-5">
            <h2>Editar Perfil</h2>
            <label>Name</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder="Name"
            />
            <label>Last Name</label>
            <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder="Last Name"
            />
            <label>Username</label>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder="Username"
            />
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder="Email"
            />
            <button onClick={handleSave} className="btn btn-success me-2">
                Save
            </button>
            <button onClick={() => navigate("/my-profile")} className="btn btn-secondary">
                Go Back
            </button>
        </div>
    );
};