import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const isAdminLoggedIn = !!localStorage.getItem("adminToken");
    const navigate = useNavigate();
    const location = useLocation();

    const { logout } = useAuth()

    // ✅ Cada vez que cambie la ruta, comprobar token (login/logout)
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, [location]);

    // ✅ También escuchar cambios globales (otras pestañas)
    useEffect(() => {
        const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, []);

    const handleLogout = () => {
        if (confirm("¿Seguro que quieres cerrar sesión?")) {
            logout()
            setIsLoggedIn(false);
            navigate("/login");
        }
    };

    return (
        <nav className="navbar navbar-light bg-light px-4">
            <Link to="/" className="navbar-brand fw-bold">
                {/* Logo opcional */}
            </Link>

            <div className="ms-auto">
                <Link to="/" className="btn btn-outline-primary me-2">
                    Home
                </Link>

                <Link to="/users" className="btn btn-outline-secondary">
                    Users
                </Link>

                {/* ✅ Botón siempre visible para crear usuario */}
                <Link to="/create" className="btn btn-outline-success mx-2">
                    Crear Usuario
                </Link>

                <Link to="/playground" className="btn btn-outline-warning mx-2">
                    Playgrounds
                </Link>
                
                <Link to="/adminsite" className="btn btn-outline-secondary">
                    Admins
                </Link>

                <Link to="/adminusers" className="btn btn-outline-secondary">
					AdminUsers
				</Link>

                <Link to="/adminplaygrounds" className="btn btn-outline-secondary mx-2">
                    Admin-Playgrounds
                </Link>
                <Link to="/adminbets" className="btn btn-outline-secondary mx-2">
                    Admin-Bets
                </Link>

                <Link to="/message-board" className="btn btn-outline-success ms-2">
                    Message Board
                </Link>

                 <Link to="/admin-message-board" className="btn btn-outline-secondary mx-2">
                    Admin-Message Board
                </Link>

                <Link to="/betwinners" className="btn btn-outline-secondary mx-2">
                    Bet-Winners
                </Link>

                {!isLoggedIn && (
                    <Link to="/login" className="btn btn-outline-success ms-2">
                        Login
                    </Link>
                )}

                {isLoggedIn && (
                    <Link to="/solicitudes" className="btn btn-outline-primary ms-2">
                        Solicitudes
                    </Link>
                )}

                {isLoggedIn && (
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger ms-2"
                    >
                        Logout
                    </button>
                )}

                <Link to="/userbets" className="btn btn-outline-success mx-2">
                    User Bets
                </Link>

				<Link to="/admin/login" className="btn btn-outline-danger mx-2">
				    Admin Login
				</Link>

				<Link to="/adminsite" className="btn btn-outline-secondary">
					Admins
				</Link>
				
				<Link to="/admin-board" className="btn btn-outline-secondary mx-2">
					Admin Board
				</Link>

				<Link to="/playgrounduser" className="btn btn-outline-success ms-2">
					Playground Users
				</Link>

                <Link to="/my-profile" className="btn btn-outline-success ms-2">
                    Mi Perfil
                </Link>

                <Link to="/playground/search" className="btn btn-outline-info mx-2">
                     Buscar Playground
                </Link>

                <Link to="/preview" className="btn btn-primary mx-2">
                      Vista nueva
                </Link>
                                
			</div>
		</nav>
	);
}