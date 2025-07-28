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
				<div className="form-floating mb-3">
					<input type="text" className="form-control" id="username" name="username" value={form.username} onChange={handleChange} placeholder="Username" />
					<label htmlFor="username">Username</label>
				</div>

				<div className="form-floating mb-3">
					<input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleChange} placeholder="First Name" />
					<label htmlFor="name">First Name</label>
				</div>

				<div className="form-floating mb-3">
					<input type="text" className="form-control" id="last_name" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" />
					<label htmlFor="last_name">Last Name</label>
				</div>

				<div className="form-floating mb-3">
					<input type="email" className="form-control" id="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
					<label htmlFor="email">Email</label>
				</div>

				<div className="form-floating mb-3">
					<input type="password" className="form-control" id="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
					<label htmlFor="password">Password</label>
				</div>

				<div className="form-floating mb-3">
					<input type="number" className="form-control" id="money" name="money" value={form.money} onChange={handleChange} placeholder="Money" />
					<label htmlFor="money">Money</label>
				</div>

				<button className="btn btn-success">Save</button>
			</form>
		</div>
	);
};
