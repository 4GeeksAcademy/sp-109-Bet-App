import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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


      {user.latitude && user.longitude && (
        <div style={{ height: "500px", width: "100%", marginBottom: "20px" }}>
          <MapContainer
            center={[user.latitude, user.longitude]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[user.latitude, user.longitude]}>
              <Popup>
                {user.name || user.username} <br /> {user.address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <button onClick={() => navigate("/profile/edit")} className="btn btn-primary me-2">
        Editar
      </button>
      <button onClick={handleDelete} className="btn btn-danger">
        Eliminar cuenta
      </button>
    </div>
  );
};
