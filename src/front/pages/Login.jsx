import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { Link } from "react-router-dom";
import "../styles/login.css";


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuth();
    


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



            login(data.token, data.user, data.role)
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (

    <main className="login-page">
        <div className="container-fluid">
            <div className="row min-vh-100">
                {/* Columna izquierda: formulario */}
                    <div className="col-12 col-lg-6 d-flex align-items-center order-2 order-lg-1">
                        <div className="login-left container w-100">
                            <div className="login-box mx-auto">
                            <div className="col-12 col-md-10 col-lg-9 col-xl-8">
                                <h1 className="login-title mb-2">Welcome back</h1>
                                <p className="login-subtitle mb-4">
                                    Enter your email and password to log in
                                </p>
                                {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
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
                                            className="form-control form-control-lg"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Recuerdame checkbox */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                        <input
                                        id="remember"
                                        type="checkbox"
                                        className="form-check-input"
                                        />
                                        <label htmlFor="remember" className="form-check-label">
                                        Remember me
                                        </label>  
                                        </div>
                                    </div>
                                    
                                    <button type="submit" className="btn btn-gradient px-5 d-block mx-auto">LOG IN</button>
                                </form>

                                <p className="login-bottom mt-4">
                                Don’t have an account?
                                <Link to="/create" className="login-link gradient">Sign up</Link>
                                </p>
                                
                            </div>
                            </div>
                        </div>
                    </div>
                {/* Columna derecha: imagen */}
                <div className="col-12 col-lg-6 p-0 order-1 order-lg-2 d-none d-lg-block">
                    <div
                    className="login-art"
                    style={{
                        backgroundImage:
                        "url('https://images.pexels.com/photos/29506612/pexels-photo-29506612.jpeg')" 
                    }}
                    />
                </div>
            
            </div>  
        </div>
    </main>
    );
};
