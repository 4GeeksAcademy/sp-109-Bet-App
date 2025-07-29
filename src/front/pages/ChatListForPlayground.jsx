import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ChatListForPlayground = () => {
	const { id } = useParams(); // playground_id
	const [chats, setChats] = useState([]);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/chats`);
				if (!resp.ok) throw new Error("Error loading chats");
				const data = await resp.json();
				setChats(data.chats);
			} catch (err) {
				console.error(err);
				setError(err.message);
			}
		};

		fetchChats();
	}, [id]);

	return (
		<div className="container mt-5">
			<h2>Chat messages for playground #{id}</h2>
			{error && <p className="text-danger">{error}</p>}

			{chats.length === 0 ? (
				<p>No messages yet.</p>
			) : (
				<ul className="list-group">
					{chats.map((chat) => (
						<li key={chat.id} className="list-group-item">
							<strong>User #{chat.user_id}:</strong> {chat.message}
							<br />
							<small>{new Date(chat.created_at).toLocaleString()}</small>
						</li>
					))}
				</ul>
			)}

			<button className="btn btn-secondary mt-3" onClick={() => navigate("/playground")}>
				Back to Playgrounds
			</button>
		</div>
	);
};
