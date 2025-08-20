// src/front/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import { FaFutbol, FaSearch, FaUser, FaBolt } from "react-icons/fa";
import "../styles/Home.css";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const Home = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // Datos del antiguo Dashboard
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return; // Home también puede verse sin sesión
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) {
          logout();
          navigate("/login", { replace: true, state: { msg: "Session expired" } });
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  const displayName = user?.username || user?.name || user?.first_name || "amigo";
  const avatar = user?.url_image || "https://i.pravatar.cc/240?img=4";

  const LoggedHeroActions = () => (
    <div className="cta-row">
      <Link className="btn-brand" to="/playground">
        <FaFutbol className="me-2" /> Ir a Playgrounds
      </Link>
      <Link className="btn-ghost" to="/solicitudes">
        Ver Solicitudes
      </Link>
      <Link className="btn-ghost" to="/my-profile">
        <FaUser className="me-2" /> Mi Perfil
      </Link>
    </div>
  );

  const LoggedBalances = () => (
    <div className="userbar">
      <img className="avatar" src={avatar} alt="avatar" />
      <div>
        <div>💰 Saldo: {data?.user?.money ?? 0} €</div>
      </div>
    </div>
  );

  return (
    <div className="home-neo-scope">
      {/* === FIX de la franja superior (igual que en otras vistas) === */}
      <style>{`
        /* Variables y fondos (opcional) */
        :root{
          --su-primary:#cb0c9f;
          --su-info:#17c1e8;
          --su-dark:#0f1b33;
          --su-muted:#6b7c90;
          --su-grad: linear-gradient(310deg,#7928CA,#FF0080);
        }

        /* Quitar padding superior/lineas del Layout y ocultar navbar global SOLO en Home */
        @supports selector(body:has(.home-neo-scope)) {
          body:has(.home-neo-scope) .content-wrapper,
          body:has(.home-neo-scope) .flex-grow-1.main-content.d-flex.flex-column{
            padding-top:0 !important;
            background:transparent !important;
          }
          body:has(.home-neo-scope) .navbar{
            display:none !important;
          }
        }

        /* Fallback si :has() no existe */
        .home-neo-scope{ margin-top:-72px; }
        @media (min-width:992px){ .home-neo-scope{ margin-top:-84px; } }

        /* Un poco de aire para la ribbon propia */
        .home-neo-scope nav.soft-ribbon{ margin-top:65px; }

        /* Lienzo + arte (coherente con el resto) */
        .home-neo-scope{
          position:relative; min-height:100dvh;
          background:
            radial-gradient(1600px 700px at 6% -20%, #eef0ff 0%, transparent 60%),
            radial-gradient(1100px 520px at 96% 0%, #e6f9ff 0%, transparent 55%),
            #fff;
        }
        .home-neo-scope .bg-art{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:url(${heroArt}) center/cover no-repeat;
          filter:blur(20px) saturate(1.05) contrast(1.04); opacity:.16;
        }
        .home-neo-scope .content{ position:relative; z-index:1; }
      `}</style>

      <SoftRibbonNav />
      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        {/* HERO */}
        <section className="hero">
          <div className="container-neo hero-wrap d-flex flex-column justify-content-center text-center mt-4 mb-4">
            <div className="d-flex flex-column align-items-center justify-content-center text-center">
              <h1 className="title">
                ¡Hola, <span className="name">{displayName}</span>!
              </h1>

              {token ? (
                <>
                  <LoggedBalances />
                  <LoggedHeroActions />
                </>
              ) : (
                <>
                  <div className="userbar d-flex flex-column align-items-center text-center gap-5">
                    <img className="avatar" src={avatar} alt="avatar" />
                    <p className="lead-muted m-0">
                      Bienvenido de nuevo. Crea un playground con tus amigos, únete a retos o explora apuestas divertidas.
                    </p>
                  </div>
                  <div className="cta-row d-flex gap-2 justify-content-center flex-wrap mt-3">
                    <Link className="btn-brand" to="/playground">
                      <FaFutbol className="me-2" /> Crear Playground
                    </Link>
                    <Link className="btn-ghost" to="/playground/search">
                      <FaSearch className="me-2" /> Buscar Playground
                    </Link>
                    <Link className="btn-ghost" to="/my-profile">
                      <FaUser className="me-2" /> Mi Perfil
                    </Link>
                  </div>
                </>
              )}
            </div>


            {/* Tarjeta decorativa derecha */}
            {/* <div className="hero-card">
              <img
                src="https://cdn.pixabay.com/photo/2022/07/10/16/57/boston-terrier-7313320_640.jpg"
                alt="Perrete sentado"
              />
              <div className="hero-caption">
                <FaBolt className="ico" />
                ¿Cuánto tiempo aguanta sentado? ¡Crea un reto con tus amigos!
              </div>
            </div> */}
          </div>
        </section>

        {/* SECCIÓN 1: Retos entre amigos → MIS APUESTAS */}
        <section className="section">
          <div className="container-neo">
            <div className="section-title">
              <h3>Mis apuestas</h3>
              <span className="muted">Tus apuestas</span>
            </div>

            {token ? (
              loading ? (
                <div className="py-3">Cargando tus apuestas…</div>
              ) : (
                <div className="grid-3">
                  {/* Activas */}
                  <div className="promo">
                    <img
                      className="thumb"
                      src="https://cdn.pixabay.com/photo/2021/08/04/08/21/casino-6521294_1280.jpg"
                      alt="Apuestas activas"
                    />
                    <div>
                      <span className="tag-ads">Activas</span>
                      <h5>Apuestas activas</h5>
                      {data?.activeBets?.length ? (
                        <ul>
                          {data.activeBets.map((bet) => (
                            <li key={bet.id}>
                              <strong>{bet.name}</strong> - {bet.amount}€
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted">No tienes apuestas activas.</p>
                      )}
                    </div>
                  </div>

                  {/* Disponibles */}
                  <div className="promo">
                    <img
                      className="thumb"
                      src="https://cdn.pixabay.com/photo/2021/07/20/08/53/casino-6480115_1280.jpg"
                      alt="Apuestas disponibles"
                    />
                    <div>
                      <span className="tag-ads">Disponibles</span>
                      <h5>Apuestas abiertas</h5>
                      {data?.availableBets?.length ? (
                        <ul>
                          {data.availableBets.map((bet) => (
                            <li key={bet.id}>
                              <strong>{bet.name}</strong> - {bet.amount}€
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted">No hay apuestas abiertas.</p>
                      )}
                    </div>
                  </div>

                  {/* Historial */}
                  <div className="promo">
                    <img
                      className="thumb"
                      src="https://cdn.pixabay.com/photo/2020/06/09/19/09/shares-5279686_1280.jpg"
                      alt="Historial"
                    />
                    <div>
                      <span className="tag-ads">Historial</span>
                      <h5>Últimas apuestas</h5>
                      {data?.history?.length ? (
                        <ul>
                          {data.history.map((bet) => (
                            <li key={bet.id}>
                              <strong>{bet.name}</strong> - {bet.amount}€
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted">No hay historial todavía.</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            ) : (
              // Fallback público
              <div className="grid-3">
                <div className="promo">
                  <img
                    className="thumb"
                    src="https://cdn.pixabay.com/photo/2024/05/06/17/06/french-fries-8743802_640.jpg"
                    alt="Reto de comida"
                  />
                  <div>
                    <span className="tag-ads">Reto</span>
                    <h5>40 hamburguesas en 10 minutos</h5>
                    <p>Crea un desafío y apuesta con tus amigos quién puede lograrlo.</p>
                  </div>
                </div>

                <div className="promo">
                  <img
                    className="thumb"
                    src="https://cdn.pixabay.com/photo/2020/04/19/18/46/company-5064997_1280.jpg"
                    alt="Oficina"
                  />
                  <div>
                    <span className="tag-ads">Puntualidad</span>
                    <h5>¿Quién llega primero?</h5>
                    <p>Organiza un playground y apuesta con tus amigos quién llega puntual a la oficina.</p>
                  </div>
                </div>

                <div className="promo">
                  <img
                    className="thumb"
                    src="https://cdn.pixabay.com/photo/2015/10/03/21/58/sport-970443_640.jpg"
                    alt="Carrera popular"
                  />
                  <div>
                    <span className="tag-ads">10 K</span>
                    <h5>¿Quién corre mejor?</h5>
                    <p>Haz un reto entre amigos para ver quién marca el mejor tiempo en la carrera.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECCIÓN 2: Apuestas deportivas amistosas → MIS PLAYGROUNDS */}
        <section className="section">
          <div className="container-neo">
            <div className="section-title">
              <h3>Mis Playgrounds </h3>
              <Link className="link" to="/playground">Ver más</Link>
            </div>

            {token ? (
              loading ? (
                <div className="py-3">Cargando tus playgrounds…</div>
              ) : (
                <div className="grid-2">
                  {/* Participa */}
                  <div className="hero-card">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/05/10/21/16/board-761586_1280.jpg"
                      alt="Playgrounds unidos"
                    />
                    <div className="hero-caption">Playgrounds en los que participo</div>
                    <ul className="pad">
                      {data?.playgroundsJoined?.length ? (
                        data.playgroundsJoined.map((pg) => (
                          <li key={pg.id}>{pg.playground}</li>
                        ))
                      ) : (
                        <li>No estás en ningún playground.</li>
                      )}
                    </ul>
                  </div>

                  {/* Creados */}
                  <div className="hero-card">
                    <img
                      src="https://cdn.pixabay.com/photo/2019/10/01/13/03/sport-4518188_1280.jpg"
                      alt="Playgrounds creados"
                    />
                    <div className="hero-caption">Playgrounds creados por mí</div>
                    <ul className="pad">
                      {data?.playgroundsCreated?.length ? (
                        data.playgroundsCreated.map((pg) => (
                          <li key={pg.id}>{pg.name}</li>
                        ))
                      ) : (
                        <li>No has creado ningún playground.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )
            ) : (
              // Fallback público
              <div className="grid-2">
                <div className="trend">
                  <img
                    className="cover"
                    src="https://cdn.pixabay.com/photo/2016/11/29/02/05/audience-1866738_640.jpg"
                    alt="Partido de fútbol"
                  />
                  <div className="body">
                    <h5>Madrid vs Barça – Partido amistoso</h5>
                    <div className="meta">Organiza tu playground y apuesta con tus amigos</div>
                  </div>
                </div>

                <div className="trend">
                  <img
                    className="cover"
                    src="https://cdn.pixabay.com/photo/2014/03/14/08/38/anna-lena-groenefeld-287035_1280.jpg"
                    alt="Partido de tenis"
                  />
                  <div className="body">
                    <h5>Enfrenta a tus amigos y apueta por ellos</h5>
                    <div className="meta">Crea un reto con tus amigos y que gane el mejor</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Artículos/guías (igual) */}
        <section className="section" style={{ paddingBottom: 24 }}>
          <div className="container-neo">
            <div className="section-title">
              <h3>Artículos y guías</h3>
              <Link className="link" to="/guides">Ver todas</Link>
            </div>

            <div className="grid-3">
              <article className="article">
                <img
                  src="https://cdn.pixabay.com/photo/2018/05/30/08/45/smilie-3441012_640.jpg"
                  alt="Felicidad"
                />
                <div className="pad">
                  <span className="pill">Consejos</span>
                  <h5>Cómo crear retos divertidos con amigos</h5>
                  <p>Ideas y estrategias para organizar tus playgrounds de manera entretenida.</p>
                  <Link to="/guides" className="link">Leer más</Link>
                </div>
              </article>

              <article className="article">
                <img
                  src="https://cdn.pixabay.com/photo/2017/06/28/18/45/fireworks-2451749_640.jpg"
                  alt="Fiestas populares"
                />
                <div className="pad">
                  <span className="pill">Eventos</span>
                  <h5>Retos y competiciones en fiestas</h5>
                  <p>Crea playgrounds para retos durante celebraciones o reuniones con amigos.</p>
                  <Link to="/guides" className="link">Leer más</Link>
                </div>
              </article>

              <article className="article">
                <img
                  src="https://cdn.pixabay.com/photo/2022/07/09/22/31/kobe-7311832_1280.png"
                  alt="NBA guía"
                />
                <div className="pad">
                  <span className="pill">Guía</span>
                  <h5>Cómo organizar apuestas amistosas deportivas</h5>
                  <p>Tips sobre cómo crear playgrounds seguros y divertidos para tus amigos.</p>
                  <Link to="/guides" className="link">Leer más</Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
};

export default Home;
