import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AdminCreate = () => {
  const [newadmin, setNewadmin] = useState({
    email: "",
    password:""
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

    useEffect(() => {
    if (!token) {
      navigate("/admin-login", { state: { fromProtected: true } });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setNewadmin(prev => ({...prev,[name]: value}));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/adminuser", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newadmin),
      });

      if (!resp.ok) throw new Error("Failed to create admin");

      navigate("/adminsite");
    } catch (err) {
      setError(err.message || "Error creating admin.");
    }
  };


  return (
    <div className="container mt-5">
      <h2>Create New Admin</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Admin Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={newadmin.email}
            onChange={handleChange}
            
          />
          <label>Admin Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={newadmin.password}
            onChange={handleChange}
            
          />
        </div>
        <button type="submit" className="btn btn-success">
        <i className="fas fa-user-plus me-2"></i>Create
        </button>
        <button type="" className="btn btn-danger"
        onClick={() => navigate(`/adminsite/`)}
        >
        <i className="fas fa-times me-2"></i>Cancel
        </button>
      </form>
    </div>
  );
};