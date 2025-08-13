import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const BetEdit = () => {
  const { id, betId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    amount: 0,
    deadline: "",
    type: "sports",
    event_description: "",
    sport: "football",
    league: "",
    options: []
  });

  const [leagues, setLeagues] = useState([]);
  const [matches, setMatches] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---- Imagen (preview + subida) ----
  const [existingImageUrl, setExistingImageUrl] = useState(""); // la que viene del backend o localStorage
  const [imageFile, setImageFile] = useState(null);             // archivo nuevo (si el usuario lo cambia)
  const [imagePreview, setImagePreview] = useState("");         // preview del archivo nuevo
  const fileInputRef = useRef(null);
  const openPicker = () => fileInputRef.current?.click();

  // helper: imagen de apuesta (backend o localStorage)
  const getBetImage = (b) =>
    b?.url_image || (b?.id ? localStorage.getItem(`bet-image-${b.id}`) : null);

  // --- Subida unsigned a Cloudinary (igual que en Create/Perfil/Playground) ---
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
      body: fd
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Cloudinary ${res.status}: ${text}`);
    const data = JSON.parse(text);
    return data.secure_url;
  };

  // ---- Cargar datos de la apuesta ----
  useEffect(() => {
    const fetchBet = async () => {
      try {
        setError(null);
        setLoading(true);

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}`,
          { headers }
        );

        if (resp.status === 401) throw new Error("No autorizado. Vuelve a iniciar sesión.");
        if (!resp.ok) throw new Error("Failed to fetch bet");

        const raw = await resp.json();
        const bet = raw?.bet ?? raw;

        setForm({
          name: bet.name ?? "",
          amount: bet.amount ?? 0,
          deadline: bet.deadline ? bet.deadline.slice(0, 16) : "",
          type: bet.type ?? "sports",
          event_description: bet.event_description ?? "",
          sport: bet.sport ?? "football",
          league: bet.league ?? "",
          options: Array.isArray(bet.options) ? bet.options.map(o => o.label ?? o) : [],
        });

        const img = getBetImage(bet);
        if (img) setExistingImageUrl(img);

        // si queréis precargar ligas/partidos como en create:
        if ((bet.sport ?? "football") === "football") {
          await fetchFootballLeagues();
          if (bet.league) await fetchUpcomingMatches(bet.league);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, betId]);

  // ---- Aux: fetch ligas/partidos (mismo patrón que en create) ----
  const fetchFootballLeagues = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/football/competitions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!resp.ok) throw new Error("Error fetching leagues");
      const data = await resp.json();
      setLeagues(data.competitions || []);
    } catch (e) {
      // no rompemos el edit por esto
      console.warn(e);
    }
  };

  const fetchUpcomingMatches = async (leagueCode) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/football/matches?competition=${leagueCode}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!resp.ok) throw new Error("Error fetching matches");
      const data = await resp.json();
      setMatches(data.matches || []);
    } catch (e) {
      console.warn(e);
    }
  };

  // ---- Guardar cambios ----
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Si el usuario eligió nueva imagen, primero súbela
      let imageUrl = existingImageUrl;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        ...form,
        options: form.options.map(o => (typeof o === "string" ? { label: o } : o)),
        url_image: imageUrl || undefined,
      };

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}`,
        { method: "PUT", headers, body: JSON.stringify(payload) }
      );

      if (resp.status === 401) throw new Error("No autorizado. Vuelve a iniciar sesión.");
      if (!resp.ok) {
        let d = {};
        try { d = await resp.json(); } catch {}
        throw new Error(d.msg || "Failed to update bet");
      }

      // si hay imagen nueva, persistimos también en localStorage como en create
      if (imageFile && imageUrl) {
        localStorage.setItem(`bet-image-${betId}`, imageUrl);
      }

      navigate(`/playground/${id}`, { state: { successMessage: "Bet updated!" } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Bet</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSave}>
        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Importe */}
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value === "" ? "" : parseFloat(e.target.value),
              })
            }
            required
          />
        </div>

        {/* Deadline */}
        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input
            type="datetime-local"
            className="form-control"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        {/* Tipo */}
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="sports">Sports</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Sport */}
        <div className="mb-3">
          <label className="form-label">Sport</label>
          <select
            className="form-select"
            value={form.sport}
            onChange={async (e) => {
              const sport = e.target.value;
              setForm({ ...form, sport, league: "", event_description: "" });
              if (sport === "football") {
                await fetchFootballLeagues();
              } else {
                setLeagues([]);
                setMatches([]);
              }
            }}
          >
            <option value="football">Football</option>
          </select>
        </div>

        {/* League */}
        <div className="mb-3">
          <label className="form-label">League</label>
          <select
            className="form-select"
            value={form.league}
            onChange={async (e) => {
              const league = e.target.value;
              setForm({ ...form, league, event_description: "" });
              if (league) await fetchUpcomingMatches(league);
              else setMatches([]);
            }}
          >
            <option value="">Select a league</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.code}>
                {league.name} ({league.area.name})
              </option>
            ))}
          </select>
        </div>

        {/* Imagen */}
        <div className="mb-3">
          <label className="form-label">Photo (optional)</label>
          <div className="d-flex align-items-center gap-3">
            <div
              className="border rounded"
              style={{
                width: 120,
                height: 80,
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
                background: "#f8f9fa",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : existingImageUrl ? (
                <img
                  src={existingImageUrl}
                  alt="Current"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span className="text-muted small">No image</span>
              )}
            </div>

            <div>
              <button type="button" className="btn btn-outline-secondary" onClick={openPicker}>
                Choose file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setImageFile(f);
                  setImagePreview(URL.createObjectURL(f));
                }}
              />
              <div className="form-text"></div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          className="btn btn-danger mx-2"
          onClick={() => navigate(`/playground/${id}`)}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
