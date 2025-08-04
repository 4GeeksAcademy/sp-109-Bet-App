import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();
    const location = useLocation();

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
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            navigate("/login");
            window.location.reload(); // limpieza total
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

                <Link to="/message-board" className="btn btn-outline-success ms-2">
                    Message Board
                </Link>

                {!isLoggedIn && (
                    <Link to="/login" className="btn btn-outline-success ms-2">
                        Login
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

				<Link to="/admin-board" className="btn btn-outline-secondary mx-2">
   					 Admin Board
				</Link>

				<Link to="/playgrounduser" className="btn btn-outline-success ms-2">
					Playground Users
				</Link>
			</div>
		</nav>
	);
};
