import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyProfile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) throw new Error("Error al cargar usuario");

        const data = await resp.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar tu cuenta?")) return;
    try {
      await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
    }
  };


  if (!user) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      <h2>Mi Perfil</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Last Name:</strong> {user.last_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Dinero:</strong> {user.money}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Latitude:</strong> {user.latitude}</p>
      <p><strong>Longitude:</strong> {user.longitude}</p>

      <button onClick={() => navigate("/profile/edit")} className="btn btn-primary me-2">
        Editar
      </button>
      <button onClick={handleDelete} className="btn btn-danger">
        Eliminar cuenta
      </button>
    </div>
  );
};
