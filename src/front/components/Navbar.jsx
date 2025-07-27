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
			</div>
		</nav>
	);
};
