import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [usersList, setUsersList] = useState([]);

    const navigate = useNavigate();

    // ✅ Cargar lista de usuarios para mostrar en pantalla
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users");
                if (!resp.ok) throw new Error("Error al obtener usuarios");
                const data = await resp.json();
                setUsersList(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    // ✅ Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.msg || "Login failed");

            // ✅ Guardamos token y username para usar después en mensajes
            localStorage.setItem("token", data.token);
            if (data.username) {
                localStorage.setItem("username", data.username);
            }

            navigate("/playground");
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Login</button>
            </form>

            {/* ✅ Panel con usuarios disponibles para pruebas */}
            {usersList.length > 0 && (
                <div className="mt-4 p-3 bg-light border rounded" style={{ maxWidth: "400px" }}>
                    <h6 className="text-muted">
                        🔹 Usuarios de prueba (password: <b>prueba</b>)
                    </h6>
                    <ul className="list-group small">
                        {usersList.map((user) => (
                            <li key={user.id} className="list-group-item py-1">
                                <strong>{user.username}</strong> – {user.email}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
