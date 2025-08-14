import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";

export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { token, role, logout } = useAuth()

    useEffect(() => {
        if (!token || role !== "admin") {
            navigate("/admin/login", { state: { fromProtected: true } });
        }
    }, [navigate, token, role]);

    const handleUnauthorized = () => {
        logout();
        navigate("/admin/login");
    };

    const getUsers = async () => {
        setLoading(true)
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users", {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (resp.status === 401) return handleUnauthorized()
            if (!resp.ok) throw new Error("Error fetching users");
            const data = await resp.json();
            setUsers(data);
        } catch (err) {
            setError("Error, it's impossible to obtein users.");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false)
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (resp.status === 401) return handleUnauthorized()
            if (!resp.ok) throw new Error("Error fetching users");
            const data = await resp.json();

            setUsers(prev => prev.filter(user => user.id !== id))   
        }
        catch (err) {
            console.error("Network/server error:", err);
            setError("Error deleting user.");
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        getUsers();
    }, []);


    return (
    <div className="container mt-5">
      <h2>Users</h2>
      {error && <p className="text-danger">{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
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
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.money}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/view/${user.id}`)}
                      className="btn btn-sm btn-info me-2"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => navigate(`/edit/${user.id}`)}
                      className="btn btn-sm btn-primary me-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-sm btn-danger"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <button
        onClick={() => navigate("/create")}
        className="btn btn-success"
      >
        Create New User
      </button>
    </div>
  );
};