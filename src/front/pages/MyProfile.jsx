// src/front/pages/MyProfile.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/myprofile.css";

// Fix iconos Leaflet (necesario en Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [okMsg, setOkMsg] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Input oculto para subir imagen
  const fileInputRef = useRef(null);
  const openPicker = () => fileInputRef.current?.click();

  // Avatar helper
  const getAvatar = (u) => {
    const url = u?.url_image || u?.image || u?.avatar || u?.avatar_url;
    if (url) return url;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      u?.username || u?.email || "user"
    )}&radius=50`;
  };

  // Subida unsigned a Cloudinary (solo front)
  const uploadToCloudinary = async (file) => {
    const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloud || !preset) {
      throw new Error(
        `Cloudinary no configurado: cloud=${cloud || "undefined"}, preset=${preset || "undefined"}`
      );
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", preset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body: fd,
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Cloudinary ${res.status}: ${text}`);
    const data = JSON.parse(text);
    return data.secure_url;
  };

  // Cambiar foto (persistencia solo en este navegador)
  const handleChangePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    setError(null);
    setOkMsg(null);

    try {
      const url = await uploadToCloudinary(file);
      localStorage.setItem(`avatar-${user.id}`, url);
      setUser((prev) => (prev ? { ...prev, url_image: url, image: url } : prev));
      setOkMsg("✅ Foto actualizada.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error subiendo imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Cargar usuario + reinyectar avatar local si el backend no manda url
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
        const u = data.user || null;

        if (u?.id) {
          const localAvatar = localStorage.getItem(`avatar-${u.id}`);
          if (localAvatar && !u.url_image && !u.image && !u.avatar && !u.avatar_url) {
            u.url_image = localAvatar;
          }
        }

        setUser(u);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar tu cuenta?")) return;
    try {
      await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (user?.id) localStorage.removeItem(`avatar-${user.id}`);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      setError("Error al eliminar la cuenta");
    }
  };

  if (!user) return <p className="text-center mt-5">Cargando…</p>;

  const avatarUrl = getAvatar(user);

  return (
   <main className="myprofile-page">
      
      <div className="mp-hero" />

    <div className="container mp-overlap d-flex justify-content-center">
      <div className="card mp-card shadow-lg" style={{ maxWidth: 1000, width: "100%" }}>
        <div className="card-body p-4 p-md-5">
          {/* Cabecera + avatar */}
          <div className="text-center mb-4">
            <h2 className="mb-2 text-gradient-lilac">My Profile</h2>
            <p className="text-muted mb-3">Gestiona tu información y foto de perfil</p>

            <div className="d-flex flex-column align-items-center">
              <div className="avatar-ring">
                <div className="avatar-inner">
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>  

              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-outline-lilac btn-sm"
                  onClick={openPicker}
                  disabled={uploading}
                >
                  <i className="fa-solid fa-camera me-2" aria-hidden="true"></i>
                  {uploading ? "Uploading…" : "Change photo"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleChangePhoto}
                />
              </div>

              {okMsg && <div className="alert alert-success py-2 px-3 mt-3 mb-0">{okMsg}</div>}
              {error && <div className="alert alert-danger py-2 px-3 mt-3 mb-0">{error}</div>}
            </div>
          </div>

          <hr />

          {/* Datos */}
          <div className="row g-4">
            <div className="col-sm-6">
              <small className="text-muted d-block">Username</small>
              <div className="fw-semibold">{user.username}</div>
            </div>
            <div className="col-sm-6">
              <small className="text-muted d-block">Email</small>
              <div className="fw-semibold">{user.email}</div>
            </div>

            <div className="col-sm-6">
              <small className="text-muted d-block">Name</small>
              <div className="fw-semibold">{user.name || "-"}</div>
            </div>
            <div className="col-sm-6">
              <small className="text-muted d-block">Last Name</small>
              <div className="fw-semibold">{user.last_name || "-"}</div>
            </div>

            <div className="col-sm-6">
              <small className="text-muted d-block">Money</small>
              <div className="fw-semibold">{user.money ?? "-"}</div>
            </div>
            <div className="col-sm-6">
              <small className="text-muted d-block">Adress</small>
              <div className="fw-semibold">{user.address || "-"}</div>
            </div>

            <div className="col-sm-6">
              <small className="text-muted d-block">Latitude</small>
              <div className="fw-semibold">{user.latitude ?? "-"}</div>
            </div>
            <div className="col-sm-6">
              <small className="text-muted d-block">Longitude</small>
              <div className="fw-semibold">{user.longitude ?? "-"}</div>
            </div>
          </div>

          {/* Mapa */}
          {user.latitude && user.longitude && (
            <div className="mt-4 mp-map" style={{ height: 420, width: "100%" }}>
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

          {/* Acciones */}
          <div className="mt-4 d-flex flex-wrap gap-2 justify-content-center">
            <button
              onClick={() => navigate("/profile/edit")}
              className="btn btn-gradient-lilac btn-sm px-4"
              disabled={uploading}
            >
              <i className="fa-regular fa-pen-to-square me-2" aria-hidden="true"></i>
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger-soft btn-sm px-4"
              disabled={uploading}
            >
              <i className="fa-solid fa-trash-can me-2" aria-hidden="true"/>
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
   </main>  
  );
};
