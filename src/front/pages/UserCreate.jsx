// src/front/pages/UserCreate.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Usercreate.css";
import SoftRibbonNav from "../components/SoftRibbonNav";

export const UserCreate = () => {
  const [form, setForm] = useState({
    username: "",
    name: "",
    last_name: "",
    email: "",
    password: "",
    money: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) navigate("/users");
      else console.error("Error creating user");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <main className="usercreate-page">
      {/* SOLO VISUAL: ocultar navbar global del layout y quitar su padding superior.
          Además, bajar un pelín la SoftRibbon sin crear “franja” arriba */}
      <style>{`
        /* Quitar padding/nav del layout solo aquí */
        @supports selector(body:has(.usercreate-page)) {
          body:has(.usercreate-page) .content-wrapper,
          body:has(.usercreate-page) .flex-grow-1.main-content.d-flex.flex-column{
            padding-top:0 !important;
            background:transparent !important;
          }
          body:has(.usercreate-page) .navbar{ display:none !important; }
        }

        /* Fallback si :has() no existe */
        .usercreate-page{ margin-top:-72px; }
        @media (min-width:992px){ .usercreate-page{ margin-top:-84px; } }

        /* Bajar “un poco” la SoftRibbon sin crear hueco real */
        .usercreate-page .soft-ribbon-wrapper{
          top:0 !important;
          transform: translateY(10px);
          z-index:1040;
        }
        .usercreate-page nav.soft-ribbon{ margin-top:0 !important; }

        @supports (padding: max(0px)) {
          .usercreate-page .soft-ribbon-wrapper{
            transform: translateY(max(10px, env(safe-area-inset-top)));
          }
        }
      `}</style>

      {/* SoftRibbon “de siempre” */}
      <SoftRibbonNav />

      {/* Cabecera con imagen de fondo */}
      <div
        className="uc-hero"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/30111476/pexels-photo-30111476.jpeg')",
        }}
      />

      <div className="container uc-overlap pb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-7 col-xl-6">
            <div className="card uc-card shadow-lg">
              <div className="card-body p-4 p-md-5">
                <h2 className="h2 mb-4 text-gradient-lilac">Join us today</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                    <label htmlFor="username">Username</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                    <label htmlFor="name">First Name</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                    <label htmlFor="last_name">Last Name</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    <label htmlFor="email">Email</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                    <label htmlFor="password">Password</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="money"
                      name="money"
                      value={form.money}
                      onChange={handleChange}
                      placeholder="Money"
                    />
                    <label htmlFor="money">Money</label>
                  </div>

                  <div className="d-grid d-md-block text-center">
                    <button className="btn btn-gradient-lilac btn-sm w-100 w-md-auto">
                      SIGN UP
                    </button>
                  </div>
                </form>

                <p className="login-bottom mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="login-link gradient">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
