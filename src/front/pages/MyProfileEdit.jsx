// src/front/pages/MyProfileEdit.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔽 Solo visual
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Componente para centrar el mapa cuando cambia lat/lon
function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], map.getZoom(), { animate: true });
    }
  }, [lat, lon, map]);
  return null;
}

// Marcador arrastrable que actualiza la ubicación y dirección
function DraggableMarker({ formData, setFormData }) {
  const [position, setPosition] = useState(
    formData.latitude && formData.longitude
      ? [formData.latitude, formData.longitude]
      : null
  );
  const markerRef = useRef(null);

  // Actualizar posición cuando cambia formData (ej: desde input)
  useEffect(() => {
    if (
      formData.latitude &&
      formData.longitude &&
      (position === null ||
        position[0] !== formData.latitude ||
        position[1] !== formData.longitude)
    ) {
      setPosition([formData.latitude, formData.longitude]);
    }
  }, [formData.latitude, formData.longitude, position]);

  const eventHandlers = {
    dragend: async () => {
      const marker = markerRef.current;
      if (marker != null) {
        const latLng = marker.getLatLng();
        setPosition([latLng.lat, latLng.lng]);

        setFormData((prev) => ({
          ...prev,
          latitude: latLng.lat,
          longitude: latLng.lng,
        }));

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.lat}&lon=${latLng.lng}`
          );
          const data = await resp.json();
          if (data && data.display_name) {
            setFormData((prev) => ({
              ...prev,
              address: data.display_name,
            }));
          }
        } catch (err) {
          console.error("Error en reverse geocoding:", err);
        }
      }
    },
  };

  return position ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={markerIcon}
    />
  ) : null;
}

export const MyProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [mapCenter, setMapCenter] = useState([40.4168, -3.7038]); // Madrid por defecto
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setError(false);
    const fetchUser = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error("Error fetching user");

        const data = await resp.json();
        setUser(data.user);
        setFormData(data.user);
        if (data.user.latitude && data.user.longitude) {
          setMapCenter([data.user.latitude, data.user.longitude]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (token) {
      fetchUser();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "latitude" || e.target.name === "longitude") {
      if (value === "") {
        value = "";
      } else {
        value = parseFloat(value);
        if (isNaN(value)) value = "";
      }
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAddressSearch = async () => {
    if (!formData.address) return;
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.address
        )}`
      );
      const data = await resp.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        setFormData({
          ...formData,
          latitude: latNum,
          longitude: lonNum,
        });
        setMapCenter([latNum, lonNum]);
      } else {
        alert("No se encontró la dirección.");
      }
    } catch (err) {
      console.error("Error buscando dirección:", err);
    }
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        latitude: formData.latitude === "" ? null : formData.latitude,
        longitude: formData.longitude === "" ? null : formData.longitude,
      };

      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      if (!resp.ok) throw new Error("Error updating user");

      await resp.json();
      navigate("/my-profile");
    } catch (err) {
      console.error(err);
      setError(err.message);
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

      .profileedit-scope{
        position:relative;
        min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          linear-gradient(#fff,#fff);
      }
      .profileedit-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .profileedit-scope .content{ position:relative; z-index:1; }
      .profileedit-scope .container{ max-width:1000px; }

      /* Ocultar botones del template */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links { display: none !important; }

      /* Tarjeta */
      .pe-card{
        border-radius:22px; border:1px solid #edf1f6; background:#fff;
        box-shadow:0 18px 50px rgba(15,23,42,.10); overflow:hidden;
      }

      /* Hero */
      .pe-hero{ text-align:center; padding:18px 12px 6px; background:linear-gradient(120deg, rgba(23,193,232,.10), rgba(203,12,159,.08)); }
      .pe-hero h2{
        margin:0; font-weight:800; letter-spacing:.2px;
        background: var(--su-gradient); -webkit-background-clip:text; background-clip:text; color:transparent;
      }

      /* Inputs */
      .profileedit-scope .form-label{ font-weight:700; color:#20314d; }
      .profileedit-scope .form-control, .profileedit-scope .form-select{
        height:48px; border-radius:12px; border:1px solid #e8eef8; box-shadow:0 6px 16px rgba(15,23,42,.06);
        transition:border-color .15s ease, box-shadow .15s ease, transform .05s ease;
      }
      .profileedit-scope .form-control:focus, .profileedit-scope .form-select:focus{
        box-shadow:0 0 0 .22rem rgba(23,193,232,.20), 0 6px 16px rgba(15,23,42,.10);
        border-color:#bcd3ff; outline:none; transform:translateY(-1px);
      }

      /* Botones */
      .profileedit-scope .btn{ border-radius:12px !important; font-weight:700; }
      .profileedit-scope .btn-success{
        background-image: linear-gradient(310deg, #16a34a, #4ade80) !important; border:0 !important; color:#fff !important;
        box-shadow:0 12px 30px rgba(34,197,94,.35);
      }
      .profileedit-scope .btn-secondary{
        background:#fff !important; color:#20314d !important; border:1px solid #d7e3ff !important;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
      }
      .profileedit-scope .btn-secondary:hover{ background:#f2f8ff !important; transform:translateY(-1px); }

      /* Mapa */
      .pe-map{ border-radius:18px; overflow:hidden; border:1px solid #ecf2fa; box-shadow:0 12px 30px rgba(15,23,42,.08); }

      /* Distribución */
      .pe-grid .row{ align-items:flex-end; }
      @media (min-width:768px){
        .pe-grid .name-last > div{ flex:0 0 50%; max-width:50%; }
        .pe-grid .user-email > div{ flex:0 0 50%; max-width:50%; }
        .pe-grid .lat-lon > div{ flex:0 0 50%; max-width:50%; }
        .pe-grid .address-row .addr-col{ flex:0 0 75%; max-width:75%; }
        .pe-grid .address-row .btn-col{ flex:0 0 25%; max-width:25%; }
      }
    `}</style>
  );

  if (!user)
    return (
      <div className="profileedit-scope">
        <Styles />
        <SoftRibbonNav />
        <div className="bg-art" aria-hidden="true"></div>
        <div className="content container py-5 text-center">Cargando...</div>
        <SiteFooter />
      </div>
    );

  return (
    <div className="profileedit-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        <div className="container py-4">
          <div className="pe-card">
            <div className="pe-hero">
              <h2>Editar Perfil</h2>
            </div>

            <div className="p-4 p-md-5 pe-grid">
              {error && <div className="alert alert-danger mb-4">{error}</div>}

              {/* Fila 1: Name / Last Name */}
              <div className="row g-3 name-last">
                <div className="col-12 col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Name"
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Fila 2: Username / Email */}
              <div className="row g-3 mt-1 user-email">
                <div className="col-12 col-md-6">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Username"
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Fila 3: Address + Buscar */}
              <div className="row g-3 mt-1 align-items-end address-row">
                <div className="col-12">
                  <label className="form-label">Address</label>
                </div>
                <div className="col-12 col-md-9 addr-col">
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Address"
                  />
                </div>
                <div className="col-12 col-md-3 btn-col">
                  <button type="button" className="btn btn-secondary w-100" onClick={handleAddressSearch}>
                    Buscar
                  </button>
                </div>
              </div>

              {/* Fila 4: Lat / Lon */}
              <div className="row g-3 mt-1 lat-lon">
                <div className="col-12 col-md-6">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude || ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Latitude"
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude || ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Longitude"
                  />
                </div>
              </div>

              {/* Mapa */}
              <div className="mt-4 pe-map" style={{ height: "460px" }}>
                <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <RecenterMap lat={mapCenter[0]} lon={mapCenter[1]} />
                  <DraggableMarker formData={formData} setFormData={setFormData} />
                </MapContainer>
              </div>

              {/* Acciones */}
              <div className="mt-4 d-flex gap-2">
                <button onClick={handleSave} className="btn btn-success">
                  Save
                </button>
                <button onClick={() => navigate("/my-profile")} className="btn btn-secondary">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};
