// src/front/pages/BetCreate.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

// 🔽 NUEVO: Nav, Footer y arte de fondo (solo visual)
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const BetCreate = () => {
  const [form, setForm] = useState({
    name: "",
    amount: 0,
    deadline: "",
    type: "sports",
    event_description: "",
    sport: "football",
    league: "",
    match: "",
    options: []
  });
  const [leagues, setLeagues] = useState([]);
  const [matches, setMatches] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [otherBet, setOtherBet] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Imagen opcional ---
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const openPicker = () => fileInputRef.current?.click();

  const { id } = useParams();
  const { token } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (form.sport === "football") fetchFootballLeagues();
  }, [form.sport]);

  useEffect(() => {
    if (form.league) fetchUpcomingMatches();
  }, [form.league]);

  const fetchFootballLeagues = async () => {
    setLoadingLeagues(true);
    setError(null);
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/football/competitions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error("Error fetching leagues");
      const data = await resp.json();
      setLeagues(data.competitions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingLeagues(false);
    }
  };

  const fetchUpcomingMatches = async () => {
    setLoadingMatches(true);
    setError(null);
    try {
      const userToken = localStorage.getItem("token");
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/football/matches?competition=${form.league}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (!resp.ok) throw new Error("Error fetching matches");
      const data = await resp.json();
      setMatches(data.matches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  // --- Subida unsigned a Cloudinary (igual que Perfil/Playground) ---
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formattedOptions = form.options.map(optionText => ({ label: optionText }));

    if (form.type === "sports" && !form.event_description) {
      setLoading(false);
      setError("Please select a match.");
      return;
    }

    if (form.type === "others" && !otherBet.trim()) {
      setLoading(false);
      setError("Please describe your bet");
      return;
    }

    if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      setLoading(false);
      setError("Amount must be a positive number");
      return;
    }

    if (form.options.length < 2) {
      setLoading(false);
      setError("Please add at least two options for the bet.");
      return;
    }

    const finalForm = { ...form, options: formattedOptions };
    if (form.type === "others") {
      finalForm.event_description = otherBet;
    }

    try {
      // 1) Subir imagen si el usuario eligió una
      let imageUrl;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
        finalForm.url_image = imageUrl; // si el backend la guarda, genial; si no, la guardamos local
      }

      // 2) Crear apuesta
      const userToken = localStorage.getItem("token");
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify(finalForm)
      });

      const text = await resp.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }

      if (!resp.ok) {
        throw new Error(data?.msg || "Failed to create bet");
      }

      // 3) Guardar imagen en localStorage si tenemos el id
      try {
        const betId = data?.bet?.id ?? data?.id ?? data?.bet_id ?? null;
        if (betId && imageUrl) {
          localStorage.setItem(`bet-image-${betId}`, imageUrl);
        }
      } catch { /* ignore */ }

      navigate(`/playground/${id}`, { state: { successMessage: "Bet created successfully!" } });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔽 SOLO ESTILO (mismo espíritu que PlaygroundSingle)
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-gradient: linear-gradient(310deg, #7928CA, #FF0080);
      }

      /* ============ Quitar franja superior del layout global ============ */
      @supports selector(body:has(.betcreate-scope)) {
        body:has(.betcreate-scope) .content-wrapper,
        body:has(.betcreate-scope) .flex-grow-1.main-content.d-flex.flex-column{
          padding-top:0 !important;
          background:transparent !important;
        }
        body:has(.betcreate-scope) .navbar{
          display:none !important;
        }
      }
      /* Fallback si :has() no existe */
      .betcreate-scope{ margin-top:-72px; }
      @media (min-width:992px){ .betcreate-scope{ margin-top:-84px; } }
      .betcreate-scope nav.soft-ribbon{ margin-top:80px; }
      /* =================================================================== */

      .betcreate-scope{
        position:relative;
        min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          linear-gradient(#fff,#fff);
      }
      .betcreate-scope .bg-art{
        position:fixed;
        inset:0;
        pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover;
        background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18;
        z-index:0;
      }
      .betcreate-scope .content{
        position:relative;
        z-index:1;
      }

      /* Tarjeta suave */
      .bc-card{
        border-radius:18px;
        border:1px solid #edf1f6;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
        background:#fff;
      }

      /* Encabezado “hero” del formulario */
      .bc-hero{
        text-align:center;
        margin-top:1.25rem;
        margin-bottom:1.25rem;
      }
      .bc-hero h2{
        font-weight:800;
        letter-spacing:.2px;
        background: var(--su-gradient);
        -webkit-background-clip:text;
        background-clip:text;
        color:transparent;
        margin:0;
      }
      .bc-hero .subtle{
        color: var(--su-muted);
        margin-top:.25rem;
      }

      /* Botones Soft-UI */
      .betcreate-scope .btn{
        border-radius:12px !important;
        font-weight:700;
        transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
      }
      .betcreate-scope .btn-primary{
        background-image: var(--su-gradient) !important;
        border:0 !important;
        color:#fff !important;
        box-shadow:0 12px 30px rgba(203,12,159,.35);
        letter-spacing:.2px;
      }
      .betcreate-scope .btn-primary:hover{
        filter:brightness(1.05);
        transform:translateY(-1px);
      }
      .betcreate-scope .btn-outline-secondary{
        background:#fff !important;
        color:#20314d !important;
        border:1px solid #d7e3ff !important;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
      }
      .betcreate-scope .btn-outline-secondary:hover{
        background:#f2f8ff !important;
        border-color:#bcd3ff !important;
        transform:translateY(-1px);
      }
      .betcreate-scope .btn-danger{
        background: linear-gradient(180deg, #fff5f5, #ffe9e9) !important;
        color:#b4232a !important;
        border:1px solid #ffd2d2 !important;
        box-shadow:0 8px 22px rgba(244,63,94,.16);
      }

      /* Inputs */
      .betcreate-scope .form-control, .betcreate-scope .form-select{
        border-radius:12px;
        border:1px solid #e8eef8;
      }
      .betcreate-scope .form-control:focus, .betcreate-scope .form-select:focus{
        box-shadow:0 0 0 .2rem rgba(23,193,232,.25);
        border-color:#bcd3ff;
      }

      /* Vista previa imagen */
      .bc-preview{
        border:2px dashed #e6eaf2;
        border-radius:12px;
        background:#f8f9fa;
      }

      /* Ocultar los “botonacos” superiores del template */
      .navbar .btn,
      .navbar .btn-group,
      nav.navbar + .container .btn,
      nav.navbar + .container .btn-group,
      .template-links {
        display: none !important;
      }
    `}</style>
  );

  return (
    <div className="betcreate-scope">
      <Styles />
      {/* 🔽 Nav incluido (visual) */}
      <SoftRibbonNav />

      {/* 🔽 Fondo chulo en TODA la pantalla */}
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        <div className="container">
          {/* Hero de página */}
          <div className="bc-hero">
            <h2>Create a New Bet</h2>
            <div className="subtle"></div>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bc-card p-4 mb-5">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
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

              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value === "" ? "" : parseFloat(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Deadline</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>

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

              {form.type === "sports" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Sport</label>
                    <select
                      className="form-select"
                      value={form.sport}
                      onChange={(e) =>
                        setForm({ ...form, sport: e.target.value, league: "", event_description: "" })
                      }
                      disabled={loadingLeagues}
                    >
                      <option value="football">Football</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">League</label>
                    <select
                      className="form-select"
                      value={form.league}
                      onChange={(e) =>
                        setForm({ ...form, league: e.target.value, event_description: "" })
                      }
                      disabled={loadingLeagues || leagues.length === 0}
                    >
                      <option value="">Select a league</option>
                      {leagues.map((league) => (
                        <option key={league.id} value={league.code}>
                          {league.name} ({league.area.name})
                        </option>
                      ))}
                    </select>
                    {loadingLeagues && <small className="text-muted">Loading leagues...</small>}
                  </div>

                  {form.league && (
                    <div className="mb-3">
                      <label className="form-label">Upcoming Matches</label>
                      {loadingMatches ? (
                        <div className="text-center py-3">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : matches.length > 0 ? (
                        <select
                          className="form-select"
                          value={form.event_description}
                          onChange={(e) => setForm({ ...form, match: e.target.value, event_description: e.target.value })}
                          required
                        >
                          <option value="">Select a match</option>
                          {matches.map((match) => (
                            <option
                              key={match.id}
                              value={`${match.homeTeam.shortName} vs ${match.awayTeam.shortName} on ${new Date(
                                match.utcDate
                              ).toLocaleDateString()}`}
                            >
                              {new Date(match.utcDate).toLocaleDateString()} - {match.homeTeam.shortName} vs{" "}
                              {match.awayTeam.shortName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="alert alert-info">No upcoming matches found for this league.</div>
                      )}
                    </div>
                  )}
                </>
              )}

              {form.type === "others" && (
                <div className="mb-3">
                  <label className="form-label">What is your bet?</label>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Type your bet"
                    value={otherBet}
                    onChange={(e) => setOtherBet(e.target.value)}
                    required
                  />
                </div>
              )}

              {(form.type === "others" || form.league) && (
                <div className="mb-3">
                  <label className="form-label">Bet Options</label>
                  <div className="d-flex mb-2">
                    <input
                      type="text"
                      className="form-control me-2"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add an option"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const trimmed = newOption.trim();
                        if (trimmed && !form.options.includes(trimmed)) {
                          setForm({ ...form, options: [...form.options, trimmed] });
                          setNewOption("");
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>

                  <ul className="list-group">
                    {form.options.map((opt, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {opt}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            const newOptions = form.options.filter((_, i) => i !== index);
                            setForm({ ...form, options: newOptions });
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Foto opcional */}
              <div className="mb-3">
                <label className="form-label">Photo (optional)</label>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="bc-preview"
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
                {loading ? "Creating..." : "Create bet"}
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
        </div>
      </div>

      {/* 🔽 Footer incluido (visual) */}
      <SiteFooter />
    </div>
  );
};

export default BetCreate;
