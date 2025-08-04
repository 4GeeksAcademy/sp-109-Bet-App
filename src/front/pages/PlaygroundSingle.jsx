import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export const PlaygroundSingle = () => {

    const { id } = useParams()
    const navigate = useNavigate();
    const location = useLocation();

    const [playground, setPlayground] = useState(null);
    const [error, setError] = useState(null);
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);

            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);


    useEffect(() => {
        const fetchPlaygroundAndBets = async () => {
            try {
                const playgroundResp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`);
                if (!playgroundResp.ok) throw new Error("Failed to fetch playground");
                const playgroundData = await playgroundResp.json();
                setPlayground(playgroundData.playground)

                const betsResp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet`);
                if (!betsResp) throw new Error("Failed to fetch bets");
                const betsData = await betsResp.json();
                setBets(betsData)
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPlaygroundAndBets()
    }, [id])

    const handleDelete = async (betId) => {
        if (!confirm("Are you sure you want to delete this bet?")) return;

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet/${betId}`, {
                method: 'DELETE'
            });
            if (!resp.ok) throw new Error("Failed to delete bet")

            setBets(prev => prev.filter(b => b.id !== betId))
        } catch (err) {
            console.error(err)
            setError("Error deleting bet");
        }
    }

    const handleDeleteOption = async (betId, optionId) => {
        if (!confirm("Are you sure you want to delete this option?")) return;

        setError(null);
        setLoading(true);

        try {
            const resp = await fetch(
                import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet/${betId}/options/${optionId}`,
                { method: 'DELETE' }
            );
            if (!resp.ok) throw new Error("Failed to delete option");


            setBets((prevBets) =>
                prevBets.map((bet) =>
                    bet.id === betId
                        ? { ...bet, options: bet.options.filter((opt) => opt.id !== optionId) }
                        : bet
                )
            );
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!playground) return <p>Playground not found</p>;

    return (
        <div className="container mt-5">
            <h1>{playground.name}</h1>
            <p><strong>Slug:</strong> {playground.slug}</p>
            <img src={playground.url_image || playground.image} alt="Image" className="img-fluid mb-3" />
            <pre>{playground.description}</pre>

            {successMessage && (
                <div className="alert alert-success w-100" role="alert">
                    {successMessage}
                </div>
            )}

            <button
                className="btn btn-outline-primary my-3"
                onClick={() => navigate(`/playground/${id}/bet`)}
            >
                Create New Bet
            </button>

            <h3>Bets</h3>
            {bets.length === 0 ? (
                <p>No bets found.</p>
            ) : (
                <ul className="list-group">
                    {bets.map((bet) => (
                        <li key={bet.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h4 className="mb-4">{bet.name}</h4>
                                    <p><strong>Event:</strong> {bet.event_id}</p>
                                    <p><strong>Amount:</strong> {bet.amount}</p>
                                    <p><strong>Status:</strong> {bet.status}</p>
                                    <p><strong>Deadline:</strong> {bet.deadline ? new Date(bet.deadline).toLocaleString() : "No deadline"}</p>
                                    <p><strong>Created by:</strong> {bet.user || "Unknown"}</p>

                                    {bet.options && bet.options.length > 0 && (
                                        <>
                                            <strong>Options:</strong>
                                            <ul className="list-group list-group-flush">
                                                {bet.options.map((option) => (
                                                    <li
                                                        key={option.id}
                                                        className="list-group-item d-flex justify-content-between align-items-center px-0"
                                                    >
                                                        {option.label}
                                                        <p
                                                            className="text-danger m-auto"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleDeleteOption(bet.id, option.id)}
                                                        >
                                                            x
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                </div>

                                <div className="btn-group d-flex flex-column gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => navigate(`/playground/${id}/bet/${bet.id}/edit`)}
                                    >
                                        Edit ✏️
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-info"
                                        onClick={() => navigate(`/playground/${id}/bet/${bet.id}/options`)}
                                    >
                                        Add Option ➕
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(bet.id)}
                                    >
                                        Delete 🗑️
                                    </button>
                                </div>

                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <button
                className="btn btn-outline-danger mt-3"
                onClick={() => navigate(`/playground/`)}
            >
                Go Back
            </button>
        </div>
    )
}