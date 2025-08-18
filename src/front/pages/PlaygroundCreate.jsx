import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PlaygroundCreate = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  
  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generatedSlug);
  }, [name]);

  
  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUD || !PRESET) {
      setError(
        "Faltan variables de entorno de Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
      );
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Error subiendo la imagen");
      setImage(data.secure_url); 
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para crear un playground");
      return;
    }

    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, url_image: image, description }),
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.msg || "Failed to create playground");
      }

      navigate("/playground", {
        state: { successMessage: "Playground created successfully!" },
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-grad: linear-gradient(310deg,#7928CA,#FF0080);
      }
      .pgc-scope{
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
        min-height:100dvh;
      }
      .container-neo{ max-width: 1080px; margin: 0 auto; padding: 0 16px; }

      .pgc-hero{ padding: 36px 0 10px; }
      .title{ color:#20314d; font-weight:900; letter-spacing:.2px; }
      .muted{ color: var(--su-muted); }

      .card-soft{
        background:#fff; border-radius:22px;
        border:1px solid #edf1f6;
        box-shadow:0 28px 80px rgba(15,23,42,.12);
        padding:22px;
      }
      label{ font-weight:700; color:#20314d; }
      .hint{ color:#8aa0b6; font-size:.9rem; }

      .pgc-scope .form-control, .pgc-scope .form-select{
        border:1px solid #e8eef8; border-radius:12px; height:48px;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
      }
      .pgc-scope textarea.form-control{ min-height:110px; height:auto; padding-top:.75rem; }
      .pgc-scope .form-control:focus, .pgc-scope .form-select:focus{
        border-color:#c9dafc;
        box-shadow:0 0 0 .22rem rgba(23,193,232,.20), 0 8px 22px rgba(15,23,42,.12);
      }

      .slug-chip{
        display:inline-flex; align-items:center; gap:.4rem;
        border:1px solid #ecf2fa; border-radius:999px; padding:.35rem .6rem;
        font-weight:700; color:#20314d; background:#fff;
        box-shadow:0 8px 20px rgba(15,23,42,.06);
      }

      .preview{
        border-radius:18px; overflow:hidden;
        border:1px solid #edf1f6;
        box-shadow:0 18px 50px rgba(15,23,42,.10);
        background:#fff;
      }
      .preview img{ width:100%; height:240px; object-fit:cover; display:block; }
      .preview .cap{
        padding:.7rem .95rem; border-top:1px solid #edf1f6; background:#fff;
        font-weight:800; color:#20314d;
        display:flex; align-items:center; gap:.5rem;
      }

      .btn-brand{
        background-image:var(--su-grad); color:#fff; border:0;
        border-radius:12px; font-weight:800;
        padding:.9rem 1.2rem; box-shadow:0 14px 34px rgba(203,12,159,.35);
      }
      .btn-brand:hover{ filter:brightness(1.05); transform:translateY(-1px); }
      .btn-ghost{
        border:1px solid #e7ecf3; color:#20314d; background:#fff;
        border-radius:12px; font-weight:700; padding:.9rem 1.1rem;
        box-shadow:0 10px 26px rgba(15,23,42,.06);
      }
      .btn-lite{
        border:1px dashed #cfe0ff; border-radius:12px; padding:.7rem .9rem;
        background:#f8fbff; color:#2b62b4; font-weight:700;
      }
    `}</style>
  );

  
  const previewFallback = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
      <rect width='100%' height='100%' rx='18' ry='18' fill='#eef2f7'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif'
        font-size='64' font-weight='800' fill='#445066'>
        ${(name || "PG").trim().split(/\\s+/).map(p=>p[0]).slice(0,2).join("").toUpperCase()}
      </text>
    </svg>` )}`;

  return (
    <div className="pgc-scope">
      <Styles />

      
      <section className="pgc-hero">
        <div className="container-neo">
          <h2 className="title mb-1">Crear nuevo playground</h2>
          <p className="muted m-0">
            Ponle un nombre, imagen (opcional) y una breve descripción.
          </p>
        </div>
      </section>

      
      <section className="pb-4">
        <div className="container-neo">
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card-soft">
                {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <label htmlFor="playgroundName" className="form-label">Nombre</label>
                  <input
                    id="playgroundName"
                    type="text"
                    className="form-control mb-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="slug-chip">slug:</span>
                    <code className="text-muted">{slug || "—"}</code>
                  </div>

                  <label htmlFor="image" className="form-label">URL de imagen (opcional)</label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      id="image"
                      type="url"
                      className="form-control"
                      placeholder="https://…"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <button type="button" className="btn-lite" onClick={handlePickFile}>
                      {isUploading ? "Subiendo..." : "Subir"}
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                  <div className="hint mb-3">
                    Puedes pegar una URL o subir un archivo (Cloudinary).
                  </div>

                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button type="submit" className="btn-brand">Create Playground</button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => navigate(`/playground/`)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            
            <div className="col-lg-5">
              <div className="preview">
                <img src={image || previewFallback} alt="Vista previa" />
                <div className="cap">{name || "Nuevo playground"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaygroundCreate;
