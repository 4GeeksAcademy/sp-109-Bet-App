import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminUserCreate = () => {
    const [form, setForm] = useState({
        username: "",
        name: "",
        last_name: "",
        email: "",
        password: "",
        money: 0
    });
    const [error, setError] = useState("");
    const [hasToken, setHasToken] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("adminToken");
        if (!token) {
            setHasToken(false);
            setError("You must be an admin to access this page.");
            return;
        }

        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                navigate("/users");
            } else {
                const data = await res.json();
                setError(data.msg || "Error creating user");
                console.error("Error creating user:", data);
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Server error while creating user.");
        }
    };

    if (!hasToken) {
        return (
            <div className="container mt-5">
                <p style={{ color: "red", fontWeight: "bold" }}>
                    You must be an admin to access this page.
                </p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2>Create User</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="username" name="username" value={form.username} onChange={handleChange} placeholder="Username" />
                    <label htmlFor="username">Username</label>
                </div>

                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleChange} placeholder="First Name" />
                    <label htmlFor="name">First Name</label>
                </div>

                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="last_name" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" />
                    <label htmlFor="last_name">Last Name</label>
                </div>

                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                    <label htmlFor="email">Email</label>
                </div>

                <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
                    <label htmlFor="password">Password</label>
                </div>

                <div className="form-floating mb-3">
                    <input type="number" className="form-control" id="money" name="money" value={form.money} onChange={handleChange} placeholder="Money" />
                    <label htmlFor="money">Money</label>
                </div>

                <button className="btn btn-success">Save</button>
            </form>
        </div>
    );
};