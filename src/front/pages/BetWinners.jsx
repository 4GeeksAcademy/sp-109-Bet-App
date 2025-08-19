// src/front/pages/BetWinners.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Solo visual extra (nav soft y arte) */
import SoftRibbonNav from "../components/SoftRibbonNav";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export default function BetWinners() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [bets, setBets] = useState([]);

  const adminToken = localStorage.getItem("adminToken");
  const userToken  = localStorage.getItem("token");

  const isUnderAdminRoute =
    typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
   
  const isAdmin = !!adminToken;
  const headers = useMemo(() => {
    const activeToken = isAdmin ? adminToken : userToken;
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {};
  }, [adminToken, userToken, isAdmin]);

  /* ====== Helpers UI ====== */
  const avatarFor = (nameOrId) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      String(nameOrId || "user")
    )}&radius=50&fontWeight=700`;

  /* ====== Data ====== */
  useEffect(() => {
    if (!adminToken && !userToken) {
      navigate(isUnderAdminRoute ? "/admin/login" : "/login", {
        replace: true,
        state: { msg: "Please log in" }
      });
      return;
    }
    let aborted = false;
    
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bets/winners`,
          { headers }
        );

        if (resp.status === 401) {
          if (isAdmin) {
            localStorage.removeItem("adminToken");
            navigate("/admin/login", { replace: true, state: { msg: "Session expired" } });
          } else {
            localStorage.removeItem("token");
            navigate("/login", { replace: true, state: { msg: "Session expired" } });
          }
          return;
        }

        const text = await resp.text();
        if (!resp.ok) {
          let msg;
          try { msg = JSON.parse(text).message; } catch { msg = text || `HTTP ${resp.status}`; }
          throw new Error(msg || "Failed to load winners");
        }

        const data = JSON.parse(text);
        if (!aborted) setBets(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!aborted) setError(e.message || "Error loading winners");
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    load();
    return () => { aborted = true; };
  }, [adminToken, userToken, headers, isAdmin, isUnderAdminRoute, navigate]);

  /* ====== Estilos (Soft-UI) ====== */
  const Styles = () => (
    <style>{`
      :root{
        --su-primary:#cb0c9f;
        --su-info:#17c1e8;
        --su-dark:#0f1b33;
        --su-muted:#6b7c90;
        --su-grad: linear-gradient(310deg, #7928CA, #FF0080);
      }

      /* ================== ARREGLA LA FRANJA BLANCA (como en otras vistas) ================== */
      @supports selector(body:has(.winners-scope)) {
        body:has(.winners-scope) .content-wrapper,
        body:has(.winners-scope) .flex-grow-1.main-content.d-flex.flex-column{
          padding-top:0 !important;
          background:transparent !important;
        }
        body:has(.winners-scope) .navbar{
          display:none !important;
        }
      }
      .winners-scope{ margin-top:-72px; }
      @media (min-width:992px){ .winners-scope{ margin-top:-84px; } }
      .winners-scope nav.soft-ribbon{ margin-top:85px; }
      /* ===================================================================================== */

      .winners-scope{
        position:relative; min-height:100dvh;
        background:
          radial-gradient(1400px 600px at 6% -12%, #eef0ff 0%, transparent 60%),
          radial-gradient(1100px 520px at 96% -10%, #e6f9ff 0%, transparent 55%),
          #fff;
      }
      .winners-scope .bg-art{
        position:fixed; inset:0; pointer-events:none; z-index:0;
        background:url(${heroArt}) center/cover no-repeat;
        filter: blur(18px) saturate(1.05) contrast(1.04);
        opacity:.18;
      }
      .winners-scope .content{ position:relative; z-index:1; }
      .container-neo{ max-width:1180px; margin:0 auto; padding:0 16px; }

      /* Hero */
      .hero{ padding:28px 0 12px; }
      .title{
        margin:0 0 .25rem; font-weight:900; letter-spacing:.2px;
        background: var(--su-grad);
        -webkit-background-clip:text; background-clip:text; color:transparent;
      }
      .lead{ color:var(--su-muted); margin:0; }

      /* Tarjeta de apuesta resuelta */
      .w-card{
        border-radius:20px; background:#fff;
        border:1px solid #edf1f6;
        box-shadow:0 18px 55px rgba(15,23,42,.12);
        padding:14px 16px;
      }
      .w-head{
        display:flex; gap:10px; align-items:flex-start; justify-content:space-between;
      }
      .w-title{ margin:0; color:#20314d; font-weight:800; }
      .w-date{ color:#6b7c90; font-size:.85rem; white-space:nowrap; }

      .pill{
        display:inline-block; font-weight:800; font-size:.8rem;
        padding:.25rem .6rem; border-radius:999px;
        background:#f1ecff; color:#6c4bd5; border:1px solid #e6e0ff;
      }
      .meta-row{ display:flex; gap:.5rem .6rem; flex-wrap:wrap; margin:.35rem 0 .6rem; }
      .meta-row .pill--pg{
        background:#e8f6ff; color:#0ea5c6; border:1px solid #d6efff;
      }

      .winners-list{
        display:flex; flex-wrap:wrap; gap:10px; margin:8px 0 2px;
      }
      .winner-chip{
        display:flex; align-items:center; gap:.5rem;
        padding:.4rem .6rem; border-radius:12px;
        background:#f7fbff; border:1px solid #e7effb;
        box-shadow:0 8px 20px rgba(15,23,42,.06);
        font-weight:700; color:#20314d;
      }
      .winner-chip img{
        width:24px; height:24px; border-radius:999px; object-fit:cover;
        border:1px solid #e9edf4;
      }

      /* Botones */
      .btn{ border-radius:12px; font-weight:800; }
      .btn-ghost{
        border:1px solid #d7e3ff; background:#fff; color:#20314d;
        box-shadow:0 8px 22px rgba(15,23,42,.06);
        padding:.55rem .9rem;
        transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
      }
      .btn-ghost:hover{ transform:translateY(-1px); background:#f2f8ff; }

      .empty{
        border:2px dashed #e9edf4; border-radius:18px; padding:20px; text-align:center;
        color:#6b7c90; background:#fff; box-shadow:0 10px 26px rgba(15,23,42,.05);
      }
      .alert-soft{
        border-radius:12px; border:1px solid #ffd2d2; background:#fff5f5; color:#b4232a;
      }
    `}</style>
  );

  /* ====== UI ====== */
  const Loading = () => (
    <div className="container-neo py-4">
      <div className="empty">⏳ Loading winners…</div>
    </div>
  );

  const ErrorBox = () => (
    <div className="container-neo py-4">
      <div className="alert-soft p-3 mb-3">Error: {error}</div>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}>⬅ Back</button>
    </div>
  );

  return (
    <div className="winners-scope">
      <Styles />
      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="hero">
          <div className="container-neo">
            <h1 className="title">🏆 Bet Winners</h1>
            <p className="lead">Resumen de apuestas resueltas y ganadores.</p>
          </div>
        </section>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox />
        ) : (
          <section className="pb-4">
            <div className="container-neo">
              {bets.length === 0 ? (
                <div className="empty">No resolved bets yet.</div>
              ) : (
                <div className="d-grid" style={{ gap: 14 }}>
                  {bets.map((bet) => (
                    <div key={bet.bet_id} className="w-card">
                      <div className="w-head">
                        <h5 className="w-title">{bet.bet_name || `Bet #${bet.bet_id}`}</h5>
                        {bet.resolved_at && (
                          <small className="w-date">
                            {new Date(bet.resolved_at).toLocaleString()}
                          </small>
                        )}
                      </div>

                      <div className="meta-row">
                        <span className="pill pill--pg">PG: {bet.playground_id}</span>
                        <span className="pill">
                          Winner: {bet.winner_option_label || `#${bet.winner_option_id}`}
                        </span>
                      </div>

                      <div>
                        <strong className="d-block mb-1" style={{ color:"#20314d" }}>Winners</strong>
                        {bet.winners?.length ? (
                          <div className="winners-list">
                            {bet.winners.map((w) => (
                              <div key={w.id} className="winner-chip">
                                <img src={avatarFor(w.username || w.id)} alt={w.username} />
                                <span>{w.username}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty" style={{ padding: 12, boxShadow:"none" }}>
                            No winners recorded.
                          </div>
                        )}
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="btn btn-ghost"
                          onClick={() => navigate(`/playground/${bet.playground_id}/bet/${bet.bet_id}`)}
                          title="View bet"
                        >
                          View bet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
