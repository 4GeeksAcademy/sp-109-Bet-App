import React, { useEffect, useState } from "react";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    const getUsers = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users");
            const data = await resp.json();
            if (resp.ok) setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`, {
                method: "DELETE",
            });
            getUsers(); // reload list
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        // Revisa el token por si cambia mientras navegas
        const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, []);

    return (
        <div className="container mt-5">
            <h2>Users</h2>
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
                                <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">
                                    Delete
                                </button>
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

            {/* ✅ Solo mostrar botón si hay login */}
            {isLoggedIn && (
                <a href="/create" className="btn btn-success">Create New User</a>
            )}
        </div>
    );
};
