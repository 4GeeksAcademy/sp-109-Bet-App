import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const PlaygroundSingle = () => {

    const { id } = useParams()
    const navigate = useNavigate();

    const [playground, setPlayground] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayground = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`);
                if (!resp.ok) throw new Error("Failed to fetch playground");

                const data = await resp.json();
                setPlayground(data.playground)
            } catch (err) {
                console.error(err)
                setError("Could not load playground")
            }
        }

        fetchPlayground()
    }, [id])


    if (error) return <p className="text-danger mt-5">{error}</p>;
    if (!playground) return <p className="mt-5">Loading...</p>;

    return (
        <div className="container mt-5">
            <h1>{playground.name}</h1>
            <p><strong>Slug:</strong> {playground.slug}</p>
            <img src={playground.image} alt="Image" />
            <pre>{playground.description}</pre>


            <button
                className="btn btn-outline-danger mt-3"
                onClick={() => navigate(`/playground/`)}
            >
                Go Back
            </button>
        </div>
    )
}