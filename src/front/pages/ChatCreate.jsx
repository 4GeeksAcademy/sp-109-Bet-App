import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChatCreate = () => {
    const [form, setForm] = useState({ user_id: "", playground_id: "", message: "" });
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        await fetch(import.meta.env.VITE_BACKEND_URL + "/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        navigate("/chats");
    };

    return (
        <div className="container mt-5">
            <h2>Create Chat</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" name="user_id" placeholder="User ID" onChange={handleChange} />
                <input className="form-control mb-2" name="playground_id" placeholder="Playground ID" onChange={handleChange} />
                <textarea className="form-control mb-2" name="message" placeholder="Message" onChange={handleChange}></textarea>
                <button className="btn btn-success">Save</button>
            </form>
        </div>
    );
};

