import React, { useState } from "react";

export const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const res = await fetch(`${backendUrl}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Usuario registrado correctamente ✅");
            } else {
                setMessage(data.message || "Error al registrar");
            }

        } catch (error) {
            setMessage("Error al conectar con el servidor");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" type="text" name="username" placeholder="Username" onChange={handleChange} />
                <input className="form-control mb-2" type="text" name="name" placeholder="Name" onChange={handleChange} />
                <input className="form-control mb-2" type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
                <input className="form-control mb-2" type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input className="form-control mb-3" type="text" name="password" placeholder="Password" onChange={handleChange} />
                <button className="btn btn-success" type="submit">Registrarse</button>
            </form>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};
