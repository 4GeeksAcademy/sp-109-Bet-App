import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const AdminUserView = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                navigate("admin/login", { state: { fromProtected: true } });
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

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    const data = await res.json();
                    setError(data.msg || "User not found.");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Server error while fetching user.");
            }
        };

        fetchUser();
    }, [id]);

    if (error) {
        return (
            <div className="container mt-5">
                <p style={{ color: "red" }}>{error}</p>
                <Link to="/users" className="btn btn-secondary">Back to Users</Link>
            </div>
        );
    }

    if (!user) return <div className="container mt-5">Loading user data...</div>;

    return (
        <div className="container mt-5">
            <h2>User Details</h2>
            <ul className="list-group mb-4">
                <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
                <li className="list-group-item"><strong>Name:</strong> {user.name}</li>
                <li className="list-group-item"><strong>Last Name:</strong> {user.last_name}</li>
                <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
                <li className="list-group-item"><strong>Money:</strong> {user.money}</li>
            </ul>
            <Link to="/users" className="btn btn-secondary">Back to Users</Link>
        </div>
    );
};