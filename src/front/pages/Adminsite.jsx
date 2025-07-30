import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Adminsite = () => {

    const [adminuser, setAdminuser] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
        
      useEffect(() => {
        const getAdmins = async () => {
          try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/adminuser");
            if (!resp.ok) throw new Error('Fail to obtein admins')
            const data = await resp.json();
            setAdminuser(data.adminuser || data || []);
          } catch (err) {
            console.error(err)
            setError('Error get admins')
          }

        };
        getAdmins()
         }, [])



    const openEditor = (id) => {
    navigate(`/admin/adminsite/${id}`);
    };

    const handleCreate = () => {
    navigate("/admincreate");
    };

    const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;

    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/adminuser/${id}`, {
        method: "DELETE",
      });

      if (!resp.ok) throw new Error("Failed to delete admin");

      setAdminuser((prev) => prev.filter((admin) => admin.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete admin");
    }
  };

    
    return (
  
       <div className="container mt-5">
      <h1>Admin Users</h1>

      {error && <p className="text-danger">{error}</p>}

      {adminuser.length === 0 ? (
        <p>No admin users found yet.</p>
      ) : (
        <>
          <ul className="list-group">
            {adminuser.map((admin) => (
              <li key={admin.id} className="list-group-item d-flex justify-content-between align-items-center">
              {admin.email}
              <button className="btn btn-primary btn-sm" onClick={() => openEditor(admin.id)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(admin.id)}>
                  Delete
              </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <button className="btn btn-success mt-3" onClick={handleCreate}>Create New Admin</button>
    </div>

    );

};