import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UserEdit = () => {
	const { id } = useParams();
	const [form, setForm] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`)
			.then((res) => res.json())
			.then((data) => setForm(data));
	}, [id]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});
			navigate("/users");
		} catch (err) {
			console.error("Error updating user", err);
		}
	};

	return (
		<div className="container mt-5">
			<h2>Edit User</h2>
			<form onSubmit={handleSubmit}>
				<input className="form-control mb-2" value={form.username || ""} name="username" onChange={handleChange} />
				<input className="form-control mb-2" value={form.name || ""} name="name" onChange={handleChange} />
				<input className="form-control mb-2" value={form.last_name || ""} name="last_name" onChange={handleChange} />
				<input className="form-control mb-2" value={form.email || ""} name="email" onChange={handleChange} />
				<input className="form-control mb-2" type="number" value={form.money || 0} name="money" onChange={handleChange} />
				<button className="btn btn-primary">Update</button>
			</form>
		</div>
	);
};
