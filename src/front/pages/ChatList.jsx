import React, { useEffect, useState } from "react";

export const ChatList = () => {
    const [chats, setChats] = useState([]);

    const getChats = async () => {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/chats");
        const data = await res.json();
        setChats(data);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this chat?")) return;
        await fetch(import.meta.env.VITE_BACKEND_URL + `/api/chat/${id}`, {
            method: "DELETE"
        });
        getChats();
    };

    useEffect(() => {
        getChats();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Playground Chats</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Playground ID</th>
                        <th>Message</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {chats.map(chat => (
                        <tr key={chat.id}>
                            <td>{chat.user_id}</td>
                            <td>{chat.playground_id}</td>
                            <td>{chat.message}</td>
                            <td>{new Date(chat.created_at).toLocaleString()}</td>
                            <td>
                                <a className="btn btn-sm btn-primary me-2" href={`/chat/edit/${chat.id}`}>Edit</a>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(chat.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a className="btn btn-success" href="/chat/create">Create New Chat</a>
        </div>
    );
};
