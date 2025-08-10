import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyProfileEdit = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(false)
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        setError(false)
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
        let value = e.target.value;

        if (e.target.name === "latitude" || e.target.name === "longitude") {
            if (value === "") {
                value = "";
            } else {
                value = parseFloat(value);
                if (isNaN(value)) value = "";
            }
        }

        setFormData({ ...formData, [e.target.name]: value });
    };



    const handleSave = async () => {
        try {
            const dataToSend = {
                ...formData,
                latitude: formData.latitude === "" ? null : formData.latitude,
                longitude: formData.longitude === "" ? null : formData.longitude,
            };

            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend),
            });
            if (!resp.ok) throw new Error("Error updating user")

            const data = await resp.json()
            navigate("/my-profile")
        } catch (err) {
            console.error(err)
            setError(err.message)
        }
    }
    if (!user) return <p>Cargando...</p>;

    return (
        <div className="container mt-5">
            {error && <div className="alert alert-danger">{error}</div>}

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
            <label>Address</label>
            <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder="Address"
            />
            <label>Latitude</label>
            <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder="Latitude"
            />
            <label>Longitude</label>
            <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="form-control mb-2"
                placeholder="Longitude"
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