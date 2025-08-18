// src/front/pages/MyProfile.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔽 Solo visual
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";
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

  // ====== SOLO VISUAL ======
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
      }

      .profile-scope{
        position:relative;
        min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          linear-gradient(#fff,#fff);
      }
      .profile-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .profile-scope .content{ position:relative; z-index:1; }
      .profile-scope .container{ max-width: 1000px; }

      /* Ocultar botones/links del template del header */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      /* Tarjeta suave */
      .profile-card{
        border-radius:22px;
        border:1px solid #edf1f6;
        background:#fff;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
        overflow:hidden;
      }

      /* Hero del perfil */
      .profile-hero{
        text-align:center;
        padding:18px 12px 6px 12px;
        background:linear-gradient(120deg, rgba(23,193,232,.10), rgba(203,12,159,.08));
      }
      .profile-hero h2{
        margin:0;
        font-weight:800;
        letter-spacing:.2px;
        background: var(--su-gradient);
        -webkit-background-clip:text; background-clip:text;
        color:transparent;
      }

      /* Avatar con anillo suave */
      .avatar-ring{
        width: 140px; height: 140px; border-radius:50%;
        padding:3px; background: linear-gradient(145deg,#fff,rgba(203,12,159,.18));
        box-shadow:0 10px 26px rgba(15,23,42,.12);
      }
      .avatar-ring .inner{
        width:100%; height:100%;
        border-radius:50%; overflow:hidden; background:#f6f7fb; display:grid; place-items:center;
        border:1px solid #eef2f8;
      }

      /* Labels/valores */
      .profile-scope .text-muted{ color: var(--su-muted) !important; }
      .profile-scope .fw-semibold{ color:#20314d; }

      /* Botones Soft-UI */
      .profile-scope .btn{
        border-radius:12px !important;
        font-weight:700;
        transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
      }
      .profile-scope .btn-primary{
        background-image: var(--su-gradient) !important;
        border:0 !important; color:#fff !important;
        box-shadow:0 12px 30px rgba(203,12,159,.35);
      }
      .profile-scope .btn-primary:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      .profile-scope .btn-outline-secondary{
        background:#fff !important; color:#20314d !important;
        border:1px solid #d7e3ff !important; box-shadow:0 8px 22px rgba(15,23,42,.06);
      }
      .profile-scope .btn-outline-secondary:hover{ background:#f2f8ff !important; transform:translateY(-1px); }
      .profile-scope .btn-danger{
        background: linear-gradient(180deg, #fff5f5, #ffe9e9) !important;
        color:#b4232a !important; border:1px solid #ffd2d2 !important;
        box-shadow:0 8px 22px rgba(244,63,94,.16);
      }

      /* Alertas y mapa */
      .profile-scope .alert{ border-radius:12px; }
      .profile-map{
        border-radius:18px; overflow:hidden;
        border:1px solid #ecf2fa; box-shadow:0 12px 30px rgba(15,23,42,.08);
      }
    `}</style>
  );

  if (!user)
    return (
      <div className="profile-scope">
        <Styles />
        <SoftRibbonNav />
        <div className="bg-art" aria-hidden="true"></div>
        <div className="content container py-5 text-center">Cargando…</div>
        <SiteFooter />
      </div>
    );

  const avatarUrl = getAvatar(user);

  return (
  <main className="myprofile-page">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="mp-hero" />
        <div className="container mp-overlap d-flex justify-content-center">  
         <div className="card pe-card shadow-lg" style={{ maxWidth: 1000, width: "100%" }}> 
          <div className="card-body p-4 p-md-5">
               {/* Avatar + acciones */}
              <div className="text-center mb-4">
                <h2 className="mb-2 text-gradient-lilac">Mi Perfil</h2>
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
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger-soft btn-sm px-4"
                disabled={uploading}
              >
                <i className="fa-solid fa-trash-can me-2" aria-hidden="true"/>
                Delete Acount
              </button>
            </div>
        </div>
      <div/>
     </div>
    </div>
    <SiteFooter />
  </main>  
  );
};
