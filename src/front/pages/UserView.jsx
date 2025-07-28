import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const UserView = () => {
	const { id } = useParams();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`);
				if (res.ok) {
					const data = await res.json();
					setUser(data);
				} else {
					console.error("User not found");
				}
			} catch (err) {
				console.error("Error fetching user:", err);
			}
		};
		fetchUser();
	}, [id]);

	if (!user) return <div className="container mt-5">Loading user data...</div>;

	return (
		<div className="container mt-5">
			<h2>User Details</h2>
			<ul className="list-group mb-4">
				<li className="list-group-item"><strong>Username:</strong> {user.username}</li>
				<li className="list-group-item"><strong>Name:</strong> {user.name}</li>
				<li className="list-group-item"><strong>Last Name:</strong> {user.last_name}</li>
				<li className="list-group-item"><strong>Email:</strong> {user.email}</li>
				<li className="list-group-item"><strong>Money:</strong> {user.money}</li>
			</ul>
			<Link to="/users" className="btn btn-secondary">Back to Users</Link>
		</div>
	);
};
