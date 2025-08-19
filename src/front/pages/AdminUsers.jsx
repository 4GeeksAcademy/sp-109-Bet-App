// src/front/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import "../styles/AdminUsers.css";


/* 🔽 Solo visual */
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { token, role, logout } = useAuth();

  useEffect(() => {
    if (!token || role !== "admin") {
      logout();
      navigate("/admin/login", { state: { fromProtected: true } });
    }
  }, [navigate, token, role]);

  const handleUnauthorized = () => {
    logout();
    navigate("/admin/login");
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.status === 401) return handleUnauthorized();
      if (!resp.ok) throw new Error("Error fetching users");
      const data = await resp.json();
      setUsers(data);
    } catch (err) {
      setError("Error, it's impossible to obtein users.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  setLoading(true);
  try {
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status === 401) return handleUnauthorized();
    if (resp.status === 403) throw new Error("No tienes permiso para eliminar este usuario");
    if (!resp.ok) throw new Error("Error deleting user");

    await resp.json();
    setUsers((prev) => prev.filter((user) => user.id !== id));
    alert("User deleted successfully.");
  } catch (err) {
    console.error("Delete error:", err);
    alert(err.message || "Error deleting user.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getUsers();
  }, []);

  

  return (
    <div className="admin-users-scope">
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="users-hero">
          <div className="container-neo">
            <h2 className="users-title">Users</h2>
            <p className="users-sub">Admin view to manage all registered users.</p>
          </div>
        </section>

        <section className="pb-4">
          <div className="container-neo">
            {error && <div className="alert-soft py-2 px-3 mb-3">{error}</div>}

            {loading ? (
              <div className="card-soft mb-3">Loading users...</div>
            ) : (
              <div className="card-soft mb-3">
                <div className="table-wrap">
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
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end">
              <button onClick={() => navigate("/create")} className="btn btn-success">
                Create New User
              </button>
            </div>
          </div>
        </section>

        <div className="footer-gap" />
      </div>

      <SiteFooter />
    </div>
  );
};
