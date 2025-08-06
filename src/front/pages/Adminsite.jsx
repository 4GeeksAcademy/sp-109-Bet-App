import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Adminsite = () => {

    const [adminuser, setAdminuser] = useState([]);
    const [error, setError] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const navigate = useNavigate();
    
    const token = localStorage.getItem("adminToken");
        
  useEffect(() => {
    if (!token) {
    setIsAuthorized(false);
    setError("You must be an admin to access this page.");
      return;
    }

    const getAdmins = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/adminuser",{
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (resp.status === 401 || resp.status === 403) {
          setIsAuthorized(false);
          setError("Access denied. Admin token is invalid or expired.");
          return;
        }
        
        if (!resp.ok) throw new Error('Fail to obtein admins')
        const data = await resp.json();
        setAdminuser(data.adminuser || data || []);
        }catch (err) {
        console.error(err)
        setError('Error get admins')
      }

    };
    getAdmins()
      }, [token])



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
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!resp.ok) throw new Error("Failed to delete admin");

      setAdminuser((prev) => prev.filter((admin) => admin.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete admin");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="container mt-5">
        <p className="text-danger fw-bold">{error || "Unauthorized access"}</p>
         <button className="btn btn-warning mt-3" onClick={() => navigate("/admin/login")}>
          <i className="fas fa-sign-in-alt me-2"></i>Go back to login
        </button>
      </div>
    );
  }

  
    
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
              <span> {admin.email}</span>
              <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => openEditor(admin.id)}>
                 <i className="fas fa-edit"></i>
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(admin.id)}>
                <i className="fas fa-trash-alt"></i>
              </button>
              </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <button className="btn btn-success mt-3" onClick={handleCreate}>Create New Admin</button>
    </div>

    );

};