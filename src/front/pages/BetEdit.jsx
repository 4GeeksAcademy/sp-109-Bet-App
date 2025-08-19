import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
/* 👇 Solo visual */
import SoftRibbonNav from "../components/SoftRibbonNav";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const BetEdit = () => {
  const { id, betId } = useParams();
  const { token } = useAuth();

  const navigate = useNavigate();

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

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---- Imagen (preview + subida) ----
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const openPicker = () => fileInputRef.current?.click();

  const getBetImage = (b) =>
    b?.url_image || (b?.id ? localStorage.getItem(`bet-image-${b.id}`) : null);

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

  useEffect(() => {
    const fetchBet = async () => {
      try {
        setError(null);
        setLoading(true);

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
          match: bet.match ?? "",
          options: Array.isArray(bet.options) ? bet.options.map(o => o.label ?? o) : [],
        });

        const img = getBetImage(bet);
        if (img) setExistingImageUrl(img);

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
  }, [id, betId]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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

      if (resp.status === 401) throw new Error("Unauthorized. Please log in again.");
      if (!resp.ok) {
        let d = {};
        try { d = await resp.json(); } catch { }
        throw new Error(d.msg || "Failed to update bet");
      }

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

  /* ====== SOLO VISUAL (color de siempre + “hasta arriba”) ====== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-grad: linear-gradient(310deg, #7928CA, #FF0080);
      }

      /* Anula padding/menú del layout global */
      @supports selector(body:has(.betedit-scope)) {
        body:has(.betedit-scope) .content-wrapper,
        body:has(.betedit-scope) .flex-grow-1.main-content.d-flex.flex-column{
          padding-top:0 !important;
          background:transparent !important;
        }
        body:has(.betedit-scope) .navbar{
          display:none !important;
        }
      }
      /* Fallback si :has() no existe */
      .betedit-scope{ margin-top:-72px; }
      @media (min-width:992px){ .betedit-scope{ margin-top:-84px; } }
      .betedit-scope nav.soft-ribbon{ margin-top:80px; }

      .betedit-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
      }
      .betedit-scope .bg-art{
        position:fixed; inset:0; pointer-events:none;
        background-image:url(${heroArt});
        background-size:cover; background-position:center;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18; z-index:0;
      }
      .betedit-scope .content{ position:relative; z-index:1; }

      .container-neo{ max-width: 1080px; margin: 0 auto; padding: 0 16px; }

      /* Hero */
      .be-hero{ padding:28px 0 14px; }
      .be-title{ color:#20314d; font-weight:900; letter-spacing:.2px; margin:0; }
      .be-sub{ color:var(--su-muted); margin:0; }

      /* Tarjeta suave */
      .card-soft{
        background:#fff; border:1px solid #edf1f6; border-radius:18px;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
        padding:22px;
      }

      /* Controles */
      .betedit-scope .form-control,
      .betedit-scope .form-select{
        border:1px solid #e8eef8; border-radius:12px; height:48px;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
      }
      .betedit-scope textarea.form-control{ min-height:110px; height:auto; padding-top:.75rem; }
      .betedit-scope .form-control:focus,
      .betedit-scope .form-select:focus{
        border-color:#c9dafc;
        box-shadow:0 0 0 .22rem rgba(23,193,232,.20), 0 8px 22px rgba(15,23,42,.12);
      }

      /* Botones: reestilizar sin cambiar clases existentes */
      .betedit-scope .btn-primary{
        background-image:var(--su-grad) !important; border:0 !important; color:#fff !important;
        border-radius:12px; font-weight:800; padding:.8rem 1.1rem;
        box-shadow:0 12px 30px rgba(203,12,159,.35);
        transition: transform .15s ease, filter .15s ease;
      }
      .betedit-scope .btn-primary:hover{ filter:brightness(1.05); transform:translateY(-1px); }

      .betedit-scope .btn-danger{
        background: linear-gradient(180deg, #fff5f5, #ffe9e9) !important;
        color:#b4232a !important; border:1px solid #ffd2d2 !important;
        border-radius:12px; font-weight:800;
        box-shadow:0 8px 22px rgba(244,63,94,.16);
      }
      .betedit-scope .btn-danger:hover{ transform:translateY(-1px); }

      .betedit-scope .btn-outline-secondary{
        border-radius:12px; font-weight:700; border-color:#d7e3ff;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
      }

      /* Vista previa imagen */
      .thumb{
        width: 160px; height: 110px; display:grid; place-items:center; overflow:hidden;
        border-radius:14px; border:1px solid #edf1f6; background:#f8f9fb;
        box-shadow:0 10px 26px rgba(15,23,42,.06);
      }
    `}</style>
  );

  return (
    <div className="betedit-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="be-hero">
          <div className="container-neo">
            <h2 className="be-title">Edit Bet</h2>
            <p className="be-sub">Actualiza datos, opciones y la imagen de la apuesta.</p>
          </div>
        </section>

        {/* FORM */}
        <section className="pb-4">
          <div className="container-neo">
            <div className="card-soft">
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

                {/* Match */}
                {matches.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Match</label>
                    <select
                      className="form-select"
                      value={form.match || ""}
                      onChange={(e) => setForm({ ...form, match: e.target.value })}
                    >
                      <option value="">Select a match</option>
                      {matches.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.homeTeam.name} vs {m.awayTeam.name} ({m.utcDate.slice(0, 10)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Opciones */}
                <div className="mb-3">
                  <label className="form-label">Options</label>
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={opt.label ?? opt}
                        onChange={(e) => {
                          const newOptions = [...form.options];
                          if (typeof newOptions[idx] === "string") {
                            newOptions[idx] = e.target.value;
                          } else {
                            newOptions[idx].label = e.target.value;
                          }
                          setForm({ ...form, options: newOptions });
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          const newOptions = form.options.filter((_, i) => i !== idx);
                          setForm({ ...form, options: newOptions });
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setForm({ ...form, options: [...form.options, ""] })}
                  >
                    Add Option
                  </button>
                </div>

                {/* Imagen */}
                <div className="mb-3">
                  <label className="form-label">Photo (optional)</label>
                  <div className="d-flex align-items-center gap-3">
                    <div className="thumb">
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
          </div>
        </section>
      </div>
    </div>
  );
};
