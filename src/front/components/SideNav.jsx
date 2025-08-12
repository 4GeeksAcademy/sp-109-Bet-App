import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaComments, FaUserPlus, FaSearch, FaUser,
  FaCoins, FaChevronDown, FaChevronUp, FaPlus, FaSignOutAlt
} from "react-icons/fa";
import { IoFootball } from "react-icons/io5";
import "./SideNav.css";

export const SideNav = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        // Petición para usuario
        const userResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        if (!userResp.ok) throw new Error("Error fetching user");
        const userData = await userResp.json();

        if (userData.id) {
        const localAvatar = localStorage.getItem(`avatar-${userData.id}`);
        if (localAvatar) {
          userData.url_image = localAvatar; // Sobrescribe la foto
        }
      }

        setUser(userData);
      } catch (err) {
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("¿Seguro que quieres cerrar sesión?")) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  if (loading) return <p className="text-center mt-5">⏳ Cargando...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="sidenav-container">
      <div className="sidenav-top">
        <div className="sidenav-user">
          <img
            src={user.url_image|| "https://i.pravatar.cc/150?img=4"}
            className="sidenav-avatar"
            alt="User"
          />
          <h5>{user.username || "Usuario"}</h5>
          <button className="sidenav-money-btn">
            <FaCoins className="text-warning me-1" />
            <span>{user.money || "0"}</span>
          </button>
        </div>

        <div className="sidenav-section">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`
          }
        >
          <FaHome className="me-3" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/playground"
          end
          className={({ isActive }) =>
            `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`
          }
        >
          <IoFootball className="me-3" />
          <span>Playgrounds</span>
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`
          }
        >
          <FaComments className="me-3" />
          <span>Mensajes</span>
        </NavLink>

        <NavLink
          to="/solicitudes"
          className={({ isActive }) =>
            `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`
          }
        >
          <FaUserPlus className="me-3" />
          <span>Solicitudes</span>
        </NavLink>

        <NavLink
          to="/playground/search"
          className={({ isActive }) =>
            `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`
          }
        >
          <FaSearch className="me-3" />
          <span>Buscar</span>
        </NavLink>

        <NavLink
          to="/my-profile"
          className={({ isActive }) =>
            `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`
          }
        >
          <FaUser className="me-3" />
          <span>Perfil</span>
        </NavLink>
        </div>
      </div>

      {/* Navegación */}
      <div className="sidenav-bottom">
        <button className="sidenav-btn sidenav-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="me-3" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

