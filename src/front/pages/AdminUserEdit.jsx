import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const AdminUserEdit = () => {
    const { id } = useParams();
    const [form, setForm] = useState({});
    const [error, setError] = useState("");
    const [hasToken, setHasToken] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setHasToken(false);
                setError("You must be an admin to access this page.");
                return;
            }

            try {
                const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.msg || "Failed to fetch user data");
                }

                const data = await res.json();
                setForm(data);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err.message);
            }
        };

        fetchUser();
    }, [id]);

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
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.msg || "Failed to update user");
            }

            navigate("/users");
        } catch (err) {
            console.error("Error updating user", err);
            setError(err.message);
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
            <h2>Edit User</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="form-label">Username</label>
                <input
                    className="form-control mb-2"
                    value={form.username || ""}
                    name="username"
                    onChange={handleChange}
                />

                <label className="form-label">First Name</label>
                <input
                    className="form-control mb-2"
                    value={form.name || ""}
                    name="name"
                    onChange={handleChange}
                />

                <label className="form-label">Last Name</label>
                <input
                    className="form-control mb-2"
                    value={form.last_name || ""}
                    name="last_name"
                    onChange={handleChange}
                />

                <label className="form-label">Email Address</label>
                <input
                    className="form-control mb-2"
                    type="email"
                    value={form.email || ""}
                    name="email"
                    onChange={handleChange}
                />

                <label className="form-label">Money Amount</label>
                <input
                    className="form-control mb-3"
                    type="number"
                    value={form.money || 0}
                    name="money"
                    onChange={handleChange}
                />

                <button className="btn btn-primary">Update</button>
            </form>
        </div>
    );
};