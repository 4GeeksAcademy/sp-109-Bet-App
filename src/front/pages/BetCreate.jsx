import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BetCreate = () => {

    const [form, setForm] = useState({
        name: "",
        amount: 0,
        deadline: "",
        type: "sports",
        event_id: ""
    });
    const [sportsQuery, setSportsQuery] = useState("");
    const [sportsResult, setSportsResult] = useState(null);
    const [otherBet, setOtherBet] = useState("")
    const [fetchingResult, setFetchingResult] = useState(false);


    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (form.type === "sports" && !form.event_id) {
            setError("Please select a sports event.");
            return;
        }

        if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
            setError("Amount must be a positive number");
            return;
        }

        if (form.type === "others" && !otherBet.trim()) {
            setError("Please enter your bet description.");
            return;
        }

        const finalForm = { ...form };

        if (form.type === "others") {
            finalForm.event_id = otherBet;
        }

        const token = localStorage.getItem("token");

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(finalForm)
            });
            if (!resp.ok) {
                const data = await resp.json();
                throw new Error(data.msg || "Failed to create bet");
            }
            navigate(`/playground/${id}`, { state: { successMessage: "Bet created successfully!" } });
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const searchEventOnApi = async () => {
        setFetchingResult(true);
        setError(null);

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sports/search?q=${encodeURIComponent(sportsQuery)}`);


            if (!resp.ok) throw new Error("Error fetching sports result");

            const data = await resp.json();

            if (!data.sports_results) {
                setSportsResult(null);
                setError("No sports event found for that query");
                return;
            }


            setSportsResult(data.sports_results);
            setForm(prev => ({ ...prev, event_id: sportsQuery }));

        } catch (err) {
            setError("Error fetching sports results");
        } finally {
            setFetchingResult(false)
        }
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Create a New Bet</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Deadline</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                        className="form-select"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        <option value="sports">Sports</option>
                        <option value="others">Others</option>
                    </select>
                </div>

                {form.type === "sports" && (
                    <div className="mb-3">
                        <label className="form-label">Search Sport Event</label>
                        <div className="d-flex mb-2">
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder="Ej: Alcaraz Sinner"
                                value={sportsQuery}
                                onChange={(e) => setSportsQuery(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={searchEventOnApi}
                                disabled={fetchingResult || !sportsQuery.trim()}
                            >
                                {fetchingResult ? "Searching..." : "Search"}
                            </button>
                        </div>

                        {sportsResult && (
                            <div className="border rounded p-3 bg-light d-flex flex-column gap-2">
                                <h5 className="mb-1">{sportsResult.tables.title || "No title"}</h5>

                                <p className="mb-1">
                                    {sportsResult.tables.games[0].players
                                        .map(player => `${player.name} (${player.ranking})`)
                                        .join(" vs ")}
                                </p>

                                <small className="text-muted">
                                    <strong>Date:</strong> {sportsResult.tables.games[0].date || "No date"} —{" "}
                                    <strong>Stage:</strong> {sportsResult.tables.games[0].stage || "No stage info"}
                                </small>

                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success mt-2"
                                        onClick={() => {
                                            setForm((prev) => ({ ...prev, event_id: sportsQuery }));
                                            setSportsResult(null);
                                            setSportsQuery("");
                                        }}
                                    >
                                        Select this event
                                    </button>
                                </div>
                            </div>
                        )}


                        {form.event_id && (
                            <div className="alert alert-info mt-3">
                                <strong>Selected Event:</strong> {form.event_id}
                            </div>
                        )}
                    </div>
                )}

                {form.type === "others" && (
                    <div className="mb-3">
                        <label className="form-label"> What is your bet? </label>
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Type your bet"
                            value={otherBet}
                            onChange={(e) => setOtherBet(e.target.value)}
                        />
                    </div>
                )}


                <button type="submit" className="btn btn-primary" disabled={loading}>
                    Create bet
                </button>

                <button
                    type="button"
                    className="btn btn-danger mx-2"
                    onClick={() => navigate(`/playground/${id}`)}
                    disabled={loading}
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}