import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminCreate = () => {
  const [newadmin, setNewadmin] = useState({
    email: "",
    password:""
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
  const { name, value } = e.target;
  setNewadmin(prev => ({...prev,[name]: value}));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/adminuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newadmin),
      });

      if (!resp.ok) throw new Error("Failed to create admin");

      navigate("/adminsite");
    } catch (err) {
      setError(err.message);
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
          Create
        </button>
        <button type="" className="btn btn-danger"
        onClick={() => navigate(`/adminsite/`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};