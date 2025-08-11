// src/front/pages/MyProfile.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [okMsg, setOkMsg] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const openPicker = () => fileInputRef.current?.click();

  // Helper: avatar a mostrar (prefiere lo que venga del user; si no, fallback de iniciales)
  const getAvatar = (u) => {
    const url = u?.url_image || u?.image || u?.avatar || u?.avatar_url;
    if (url) return url;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      u?.username || u?.email || "user"
    )}&radius=50`;
  };

  // Subida a Cloudinary (unsigned)
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

  // Cambio de foto (solo front): sube y guarda en localStorage
  const handleChangePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    setError(null);
    setOkMsg(null);

    try {
      const url = await uploadToCloudinary(file);

      // Persistimos SOLO en front
      localStorage.setItem(`avatar-${user.id}`, url);

      // Refrescamos el estado local (preferimos ponerla en url_image)
      setUser((prev) => (prev ? { ...prev, url_image: url, image: url } : prev));

      setOkMsg("✅ Foto actualizada (guardada en este dispositivo).");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error subiendo imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Cargar usuario y reinyectar avatar desde localStorage si el backend no lo trae
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

        // Si no trae url, intenta recuperar la guardada en front
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
      if (user?.id) localStorage.removeItem(`avatar-${user.id}`); // limpiamos el avatar local
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
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm" style={{ maxWidth: 720, width: "100%" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="mb-3">Mi Perfil</h2>

            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle overflow-hidden border"
                style={{
                  width: 140,
                  height: 140,
                  background: "#f6f7fb",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={openPicker}
                  disabled={uploading}
                >
                  {uploading ? "Subiendo…" : "Cambiar foto"}
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

          <div className="row g-3">
            <div className="col-sm-6">
              <small className="text-muted d-block">Username</small>
              <div className="fw-semibold">{user.username}</div>
            </div>
            <div className="col-sm-6">
              <small className="text-muted d-block">Email</small>
              <div className="fw-semibold">{user.email}</div>
            </div>

            <div className="col-sm-6">
              <small className="text-muted d-block">Nombre</small>
              <div className="fw-semibold">{user.name || "-"}</div>
            </div>
            <div className="col-sm-6">
              <small className="text-muted d-block">Apellidos</small>
              <div className="fw-semibold">{user.last_name || "-"}</div>
            </div>

            <div className="col-sm-6">
              <small className="text-muted d-block">Dinero</small>
              <div className="fw-semibold">{user.money ?? "-"}</div>
            </div>
            <div className="col-sm-6">
              <small className="text-muted d-block">Dirección</small>
              <div className="fw-semibold">{user.address || "-"}</div>
            </div>

            <div className="col-sm-6">
              <small className="text-muted d-block">Latitud</small>
              <div className="fw-semibold">{user.latitude ?? "-"}</div>
            </div>
            <div className="col-sm-6">
              <small className="text-muted d-block">Longitud</small>
              <div className="fw-semibold">{user.longitude ?? "-"}</div>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button onClick={() => navigate("/profile/edit")} className="btn btn-primary" disabled={uploading}>
              Editar
            </button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={uploading}>
              Eliminar cuenta
            </button>
          </div>

          <div className="mt-3">
            <small className="text-muted">
              * La foto se guarda solo en este dispositivo (localStorage). Si inicias sesión en otro
              navegador, podrás subirla de nuevo.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};
