import React, { useEffect, useState } from "react";

export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [hasToken, setHasToken] = useState(true); // por defecto asumimos que sí

    const getUsers = async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            setHasToken(false);
            setError("You must be an admin to access this page.");
            return;
        }

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users", {
                method: 'GET',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await resp.json();
            if (resp.ok) setUsers(data);
            else {
                setError(data.msg || "Failed to load users.");
                console.error("Error en la respuesta:", data.msg || data);
            }
        } catch (err) {
            setError("Error fetching users.");
            console.error("Error fetching users:", err);
        }
    };

    const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        setHasToken(false);
        setError("You must be an admin to access this page.");
        return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;

    const url = import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`;
    console.log("DELETE URL:", url);
    console.log("Token:", token);

    try {
        const resp = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resp.ok) {
            // Intenta leer la respuesta como texto o JSON
            let errorText = "";
            try {
                errorText = await resp.text();
            } catch (e) {
                errorText = "Could not parse error response";
            }

            console.error("Error response from server:", errorText);
            setError("Error deleting user: " + errorText);
            return;
        }

        getUsers(); // reload list
    } catch (err) {
        setError("Error deleting user (network or server).");
        console.error("Network/server error:", err);
    }
};
    useEffect(() => {
        getUsers();
    }, []);

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
            <h2>Users</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Money</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.money}</td>
                            <td>
                                <a href={`/view/${user.id}`} className="btn btn-sm btn-info me-2">View</a>
                                <a href={`/edit/${user.id}`} className="btn btn-sm btn-primary me-2">Edit</a>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={4}>No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <a href="/create" className="btn btn-success">Create New User</a>
        </div>
    );
};