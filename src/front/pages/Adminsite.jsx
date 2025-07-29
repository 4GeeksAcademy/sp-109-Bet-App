import React, { useState, useEffect } from "react";

export const Adminsite = () => {

    const [adminuser, setAdminuser] = useState([]);
    const [error, setError] = useState(null);



        
      useEffect(() => {
        const getAdmins = async () => {
          try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/adminuser");
            if (!resp.ok) throw new Error('Fail to fetch admins')
            const data = await resp.json();
            setAdminuser(data.adminuser || [])
          } catch (err) {
            console.error(err)
            setError('Error fetching admins')
          }

        };
        getAdmins()
         }, [])
    
    return (
  
       <div className="container mt-5">
      <h1>Usuarios Administradores</h1>

      {error && <p className="text-danger">{error}</p>}

      {adminuser.length === 0 ? (
        <p>No hay administradores aún.</p>
      ) : (
        <>
          <ul className="list-group">
            {adminuser.map((admin) => (
              <li key={admin.id} className="list-group-item">
                {admin.email}
              </li>
            ))}
          </ul>
        </>
      )}

      <button className="btn btn-success mt-3">Crear nuevo administrador</button>
    </div>

    );

};