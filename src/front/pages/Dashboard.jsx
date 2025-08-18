import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import SoftRibbonNav from "../components/SoftRibbonNav";

const Dashboard = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard`, { headers });
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
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!data) return <div className="text-center mt-5">No data available</div>;

  return (
    <div className="home-neo-scope">
        <SoftRibbonNav />
      <div className="bg-art" style={{ backgroundImage: "url('/images/bg-dashboard.jpg')" }}></div>
      <div className="container-neo content">
        {/* Hero */}
        <section className="hero">
          <div className="hero-wrap">
            <div>
              <h1 className="title">
                Bienvenido, <span className="name">{user?.username || "Usuario"}</span>
              </h1>
              <div className="userbar">
                <img className="avatar" src={user?.avatar || "https://i.pravatar.cc/240?img=4"} alt="avatar" />
                <div>
                  <div>💰 Saldo: {data.user.money} €</div>
                </div>
              </div>
            </div>
            <div>
              <a className="btn-brand mx-2" href="/playground">Ir a Playgrounds</a>
              <a className="btn-ghost" href="/solicitudes">Ver Solicitudes</a>
            </div>
          </div>
        </section>

        {/* Playgrounds */}
        <section className="section">
          <div className="section-title">
            <h3>Mis Playgrounds</h3>
          </div>
          <div className="grid-2">
            <div className="hero-card">
              <img src="https://cdn.pixabay.com/photo/2015/05/10/21/16/board-761586_1280.jpg" alt="Playgrounds unidos" />
              <div className="hero-caption">Playgrounds en los que participo</div>
              <ul className="pad">
                {data.playgroundsJoined.length > 0 ? (
                  data.playgroundsJoined.map(pg => <li key={pg.id}>{pg.playground}</li>)
                ) : (
                  <li>No estás en ningún playground.</li>
                )}
              </ul>
            </div>
            <div className="hero-card">
              <img src="https://cdn.pixabay.com/photo/2019/10/01/13/03/sport-4518188_1280.jpg" alt="Playgrounds creados" />
              <div className="hero-caption">Playgrounds creados por mí</div>
              <ul className="pad">
                {data.playgroundsCreated.length > 0 ? (
                  data.playgroundsCreated.map(pg => <li key={pg.id}>{pg.name}</li>)
                ) : (
                  <li>No has creado ningún playground.</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Apuestas */}
        <section className="section">
          <div className="section-title">
            <h3>Mis Apuestas</h3>
          </div>
          <div className="grid-3">
            <div className="promo">
              <img className="thumb" src="https://cdn.pixabay.com/photo/2021/08/04/08/21/casino-6521294_1280.jpg" alt="Apuestas activas" />
              <div>
                <span className="tag-ads">Activas</span>
                <h5>Apuestas activas</h5>
                {data.activeBets.length > 0 ? (
                  <ul>{data.activeBets.map(bet => <li key={bet.id}>{bet.title} - {bet.amount}€</li>)}</ul>
                ) : (
                  <p className="muted">No tienes apuestas activas.</p>
                )}
              </div>
            </div>

            <div className="promo">
              <img className="thumb" src="https://cdn.pixabay.com/photo/2021/07/20/08/53/casino-6480115_1280.jpg" alt="Apuestas disponibles" />
              <div>
                <span className="tag-ads">Disponibles</span>
                <h5>Apuestas abiertas</h5>
                {data.availableBets.length > 0 ? (
                  <ul>{data.availableBets.map(bet => <li key={bet.id}>{bet.title} - {bet.amount}€</li>)}</ul>
                ) : (
                  <p className="muted">No hay apuestas abiertas.</p>
                )}
              </div>
            </div>

            <div className="promo">
              <img className="thumb" src="https://cdn.pixabay.com/photo/2020/06/09/19/09/shares-5279686_1280.jpg" alt="Historial" />
              <div>
                <span className="tag-ads">Historial</span>
                <h5>Últimas apuestas</h5>
                {data.history.length > 0 ? (
                  <ul>{data.history.map(bet => <li key={bet.id}>{bet.title} - {bet.amount}€ [{bet.status}]</li>)}</ul>
                ) : (
                  <p className="muted">No hay historial todavía.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
