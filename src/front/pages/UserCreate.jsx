import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserCreate = () => {
	const [form, setForm] = useState({
		username: "",
		name: "",
		last_name: "",
		email: "",
		password: "",
		money: 0
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});
			if (res.ok) navigate("/users");
			else console.error("Error creating user");
		} catch (err) {
			console.error("Error:", err);
		}
	};

	return (
		<div className="container mt-5">
			<h2>Create User</h2>
			<form onSubmit={handleSubmit}>
				<input className="form-control mb-2" placeholder="Username" name="username" onChange={handleChange} />
				<input className="form-control mb-2" placeholder="Name" name="name" onChange={handleChange} />
				<input className="form-control mb-2" placeholder="Last Name" name="last_name" onChange={handleChange} />
				<input className="form-control mb-2" placeholder="Email" name="email" onChange={handleChange} />
				<input className="form-control mb-2" placeholder="Password" name="password" onChange={handleChange} />
				<input className="form-control mb-2" type="number" placeholder="Money" name="money" onChange={handleChange} />
				<button className="btn btn-success">Save</button>
			</form>
		</div>
	);
};
