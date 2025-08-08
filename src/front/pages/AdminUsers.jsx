import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    

    const getUsers = async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("admin/login", { state: { fromProtected: true } });
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
        if (resp.ok){
        setUsers(data);
        } else {
        setError(data.msg || "Failed to load users.");
        console.error("Error in the request:", data);
        }
        } catch (err) {
            setError("Error, it's impossible to obtein users.");
            console.error("Error fetching users:", err);
        }
    };

    const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        navigate("admin/login");
        return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resp.ok) {
            const data = await resp.json();
            setError(data.msg || "Failed to delete user.");
            console.error("Error deleting user:", data);
            return;
        } getUsers()
        ;} 
    catch (err) {
    console.error("Network/server error:", err);
    setError("Error deleting user.");
        }
    };

        
    useEffect(() => {
        getUsers();
    }, []);


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