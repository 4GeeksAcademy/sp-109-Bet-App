import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import SoftRibbonNav from "../components/SoftRibbonNav";
import SiteFooter from "../components/SiteFooter";
import { FaFutbol, FaSearch, FaUser, FaBolt } from "react-icons/fa";
import "../styles/Home.css";
import heroArt from "../../../docs/assets/img/curved11.jpg";

export const Home = () => {
  const { user } = useAuth();

  const displayName = user?.username || user?.name || user?.first_name || "amigo";
  const avatar = user?.url_image || "https://i.pravatar.cc/240?img=4";

  return (
    <div className="home-neo-scope">
      
      <SoftRibbonNav />

      <div className="bg-art" aria-hidden="true"></div>

      <div className="content">
        
        <section className="hero">
          <div className="container-neo hero-wrap">
            
            <div>
              <h1 className="title">
                ¡Hola, <span className="name">{displayName}</span>!
              </h1>

              <div className="userbar">
                <img className="avatar" src={avatar} alt="avatar" />
                <p className="lead-muted m-0">
                  Bienvenido de nuevo. Crea un playground con tus amigos, únete a retos o explora apuestas divertidas.
                </p>
              </div>

              <div className="cta-row">
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
            </div>

            
            <div className="hero-card">
              <img
                src="https://cdn.pixabay.com/photo/2022/07/10/16/57/boston-terrier-7313320_640.jpg"
                alt="Perrete sentado"
              />
              <div className="hero-caption">
                <FaBolt className="ico" />
                ¿Cuánto tiempo aguanta sentado? ¡Crea un reto con tus amigos!
              </div>
            </div>
          </div>
        </section>

        
        <section className="section">
          <div className="container-neo">
            <div className="section-title">
              <h3>Retos entre amigos</h3>
              <span className="muted">Diviértete</span>
            </div>

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
          </div>
        </section>

        
        <section className="section">
          <div className="container-neo">
            <div className="section-title">
              <h3>Apuestas deportivas amistosas</h3>
              <Link className="link" to="/playground/search">Ver más</Link>
            </div>

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
          </div>
        </section>

        
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

