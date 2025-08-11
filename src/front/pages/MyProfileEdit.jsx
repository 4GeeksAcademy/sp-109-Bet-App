import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Editar Perfil</h2>

      <label>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Name"
      />

      <label>Last Name</label>
      <input
        type="text"
        name="last_name"
        value={formData.last_name || ""}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Last Name"
      />

      <label>Username</label>
      <input
        type="text"
        name="username"
        value={formData.username || ""}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Username"
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email || ""}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Email"
      />

      <label>Address</label>
      <div className="d-flex mb-2">
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          className="form-control me-2"
          placeholder="Address"
        />
        <button type="button" className="btn btn-outline-primary" onClick={handleAddressSearch}>
          Buscar
        </button>
      </div>

      <label>Latitude</label>
      <input
        type="number"
        name="latitude"
        value={formData.latitude || ""}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Latitude"
      />

      <label>Longitude</label>
      <input
        type="number"
        name="longitude"
        value={formData.longitude || ""}
        onChange={handleChange}
        className="form-control mb-2"
        placeholder="Longitude"
      />

      <div className="mb-3" style={{ height: "500px" }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap lat={mapCenter[0]} lon={mapCenter[1]} />
          <DraggableMarker formData={formData} setFormData={setFormData} />
        </MapContainer>
      </div>

      <button onClick={handleSave} className="btn btn-success me-2">
        Save
      </button>
      <button onClick={() => navigate("/my-profile")} className="btn btn-secondary">
        Go Back
      </button>
    </div>
  );
};



