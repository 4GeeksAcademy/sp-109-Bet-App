import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaComments, FaUserPlus, FaSearch, FaUser,
  FaCoins, FaSignOutAlt, FaTicketAlt, FaTrophy 
} from "react-icons/fa";
import { IoFootball } from "react-icons/io5";
import { useAuth } from "../hooks/AuthContext";
import "./SideNav.css";

export const SideNav = () => {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();

  const handleLogout = () => {
    if (window.confirm("¿Seguro que quieres cerrar sesión?")) {
      logout();
      navigate(role === "admin" ? "/admin/login" : "/login");
    }
  };

  if (!user) return null;

  return (
    <div className="sidenav-container">
      <div className="sidenav-top">
        <h4>Bet APP</h4>
      </div>
      <div className="sidenav-mid">
        <div className="sidenav-user">
          <img
            src={user.url_image || "https://i.pravatar.cc/150?img=4"}
            className="sidenav-avatar"
            alt="User"
          />
          <h5>{user.username || "Usuario"}</h5>
          {role === "user" && (
            <button className="sidenav-money-btn">
              <FaCoins className="text-warning me-1" />
              <span>{user.money || "0"}</span>
            </button>
          )}
        </div>

        <div className="sidenav-section">
          {role === "user" ? (
            <>

             <NavLink to="/dashboard" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaHome className="me-3" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaHome className="me-3" />
                <span>Home</span>
              </NavLink>

              <NavLink to="/playground" end className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <IoFootball className="me-3" />
                <span>Playgrounds</span>
              </NavLink>

              {/* <NavLink to="/messages" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaComments className="me-3" />
                <span>Messages</span>
              </NavLink> */}

              <NavLink to="/solicitudes" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaUserPlus className="me-3" />
                <span>Requests</span>
              </NavLink>

              <NavLink to="/playground/search" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaSearch className="me-3" />
                <span>Search Playground</span>
              </NavLink>

              <NavLink to="/betwinners" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaTrophy  className="me-3" />
                <span>Bet Winners</span>
              </NavLink>

              <NavLink to="/my-profile" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaUser className="me-3" />
                <span>My Profile</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/admin-board" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaHome className="me-3" />
                <span>Admin Dashboard</span>
              </NavLink>

              <NavLink to="/adminplaygrounds" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <IoFootball className="me-3" />
                <span>Manage Playgrouds</span>
              </NavLink>

              <NavLink to="/adminbets" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaTicketAlt className="me-3" />
                <span>Manage Bets</span>
              </NavLink>

              <NavLink to="/betwinners" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaTrophy  className="me-3" />
                <span>All Bet Winners</span>
              </NavLink>

              <NavLink to="/adminusers" className={({ isActive }) =>
                `sidenav-btn ${isActive ? "sidenav-btn-active" : ""}`}>
                <FaUser className="me-3" />
                <span>Manage Users</span>
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div className="sidenav-bottom">
        <button className="sidenav-btn sidenav-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="me-3" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};



