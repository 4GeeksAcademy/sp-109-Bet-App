import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ChatEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({});

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + `/api/chat/${id}`)
            .then(res => res.json())
            .then(data => setForm(data));
    }, [id]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        await fetch(import.meta.env.VITE_BACKEND_URL + `/api/chat/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        navigate("/chats");
    };

    return (
        <div className="container mt-5">
            <h2>Edit Chat</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" name="user_id" value={form.user_id || ""} onChange={handleChange} />
                <input className="form-control mb-2" name="playground_id" value={form.playground_id || ""} onChange={handleChange} />
                <textarea className="form-control mb-2" name="message" value={form.message || ""} onChange={handleChange}></textarea>
                <button className="btn btn-primary">Update</button>
            </form>
        </div>
    );
};
