import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import "../styles/Adminlogin.css";


export const AdminLogin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const loginMessage = location.state?.fromProtected ? "⚠️ Please log in first." : null;

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await resp.json();
            if (!resp.ok) {
                throw new Error(data.msg || "Invalid credentials");
            }

            login(data.token, data.admin, data.role)
            navigate('/admin-board');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (

      <main className="adminlogin-page">
        <div className="container-fluid">
          <div className="row admin-row align-items-center">
            {/* Izquierda: textos + formulario */}
            <div className="col-12 col-lg-6 d-flex align-items-center order-2 order-lg-1">
              <div className="admin-left px-4 px-lg-5 mx-auto">
                <h1 className="admin-title mb-2 text-gradient-lilac">Admin Space</h1>
                <p className="admin-subtitle mb-4">Log in to manage users, bets and settings.</p>

                {loginMessage && <div className="alert alert-warning mb-3"> {loginMessage} </div>}
                
                {/* <div className="alert alert-info">
                    <strong>ℹ️ Credenciales de prueba:</strong><br />
                    Email: <code>contrasena@gmail.com</code><br />
                    Password: <code>contrasena</code>
                </div> */}

                {error && <div className="alert alert-danger mb-3">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control mb-2"
                        value={form.email}
                        id="email"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                  </div>  
                  
                  <div className="mb-3">
                    <label htmlFor="pass" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control mb-2"
                        value={form.password}
                        id="pass"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                  </div>  

                    <button type="submit" className="btn btn-gradient-lilac btn-md px-5 d-block mx-auto">LOG IN</button>
                
                </form>
              
              </div>
            </div>    
            
            {/* Derecha: imagen con corte diagonal */}
            <div className="col-12 col-lg-6 p-0 order-1 order-lg-2 d-none d-lg-block">
              <div
                className="admin-art"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/29067690/pexels-photo-29067690.jpeg')",
                }}
              />
            </div>

          </div>           
       </div> 
      </main>
    );
};
