import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
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
				<Link to="/playground" className="btn btn-outline-warning mx-2">
					Playgrounds
				</Link>

				<Link to="/adminsite" className="btn btn-outline-secondary">
					Admins
				</Link>

				<Link to="/message-board" className="btn btn-outline-success ms-2">
					Message Board
				</Link>

				<Link to="/login" className="btn btn-outline-success ms-2">
					Login
				</Link>

				<Link to="/userbets" className="btn btn-outline-success mx-2">
					User Bets
				</Link>

				<Link to="/admin/login" className="btn btn-outline-danger mx-2">
				    Admin Login
				</Link>

				<Link to="/admin-board" className="btn btn-outline-secondary mx-2">
   					 Admin Board
				</Link>

				<Link to="/admin/logout" className="btn btn-danger mx-2">
  					 Logout
				</Link>

			</div>
		</nav>
	);
};
