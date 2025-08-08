import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BetEdit = () => {

    const { id, betId } = useParams();
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        amount: 0,
        deadline: "",
        type: "sports",
        event_description: "",
        sport: "football",
        league: "",
        options: []
    });
    const [leagues, setLeagues] = useState([]);
    const [matches, setMatches] = useState([]);
    const [newOption, setNewOption] = useState("");
    const [loadingLeagues, setLoadingLeagues] = useState(false);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [otherBet, setOtherBet] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBet = async () => {
            try {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet/${betId}`);
                if (!resp.ok) throw new Error("Failed to fetch bet");

                const data = await resp.json();

                // Extraer solo nombres de equipos si es apuesta deportiva
                let eventDesc = data.event_description;
                if (data.type === "sports" && data.event_description) {
                    eventDesc = data.event_description.split(" on ")[0]; // Elimina la fecha
                }

                setForm({
                    name: data.name || "",
                    amount: data.amount || 0,
                    deadline: data.deadline ? new Date(data.deadline).toISOString().slice(0, 16) : "",
                    event_description: eventDesc,
                    type: data.type,
                    sport: data.sport || "football",
                    league: data.league || "",
                    options: data.options?.map(opt => typeof opt === 'string' ? { label: opt } : opt) || []
                });

                if (data.type === "others") setOtherBet(data.event_description);

                // Si es apuesta deportiva y tiene league, cargar matches
                if (data.type === "sports" && data.league) {
                    fetchUpcomingMatches().then(() => {
                        // Buscar y seleccionar automáticamente el partido
                        const selectedMatch = matches.find(m =>
                            `${m.homeTeam.shortName} vs ${m.awayTeam.shortName}` === eventDesc
                        );
                        if (selectedMatch) {
                            setForm(prev => ({
                                ...prev,
                                event_description: `${selectedMatch.homeTeam.shortName} vs ${selectedMatch.awayTeam.shortName} on ${new Date(selectedMatch.utcDate).toLocaleDateString()}`
                            }));
                        }
                    });
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchBet();
    }, [id, betId]);

    useEffect(() => {
        if (form.sport === "football") fetchFootballLeagues()
    }, [form.sport])

    useEffect(() => {
        if (form.league) fetchUpcomingMatches()
    }, [form.league])

    const fetchFootballLeagues = async () => {
        setLoadingLeagues(true)
        setError(false)
        try {
            const token = localStorage.getItem("token");
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/football/competitions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!resp.ok) throw new Error("Error fetching leagues");
            const data = await resp.json()
            setLeagues(data.competitions)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingLeagues(false);
        }
    };

    const fetchUpcomingMatches = async () => {
        setLoadingMatches(true)
        setError(false)
        try {
            const token = localStorage.getItem("token");
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/football/matches?competition=${form.league}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!resp.ok) throw new Error("Error fetching matches");
            const data = await resp.json()
            setMatches(data.matches)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingMatches(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
            setError("Amount must be a positive number")
            return;
        }

        if (form.type === "sports" && !form.event_description) {
            setError("Please select a match.");
            return;
        }

        if (form.type === "others" && !otherBet.trim()) {
            setError("Please describe your bet");
            return;
        }

        if (form.options.length < 2) {
            setError("Please add at least two options for the bet.");
            return;
        }

        const finalForm = { ...form }
        if (form.type === "others") {
            finalForm.event_description = otherBet
        }
        try {
            const token = localStorage.getItem("token")
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet/${betId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(finalForm)
            });
            if (!resp.ok) {
                const data = await resp.json()
                throw new Error(data.msg || "Failed to edit bet")
            }
            navigate(`/playground/${id}`, { state: { successMessage: "Bet updated successfully!" } })
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edit Bet</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
                    <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                        <option value="sports">Sports</option>
                        <option value="others">Others</option>
                    </select>
                </div>

                {form.type === "sports" && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Sport</label>
                            <select
                                className="form-select"
                                value={form.sport}
                                onChange={(e) => setForm({ ...form, sport: e.target.value, league: "", event_description: "" })}
                                disabled={loadingLeagues}
                            >
                                <option value="football">Football</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">League</label>
                            <select
                                className="form-select"
                                value={form.league}
                                onChange={(e) => setForm({ ...form, league: e.target.value, event_description: "" })}
                                disabled={loadingLeagues || leagues.length === 0}
                            >
                                <option value="">Select a league</option>
                                {leagues.map((league) => (
                                    <option key={league.id} value={league.code}>
                                        {league.name} ({league.area.name})
                                    </option>
                                ))}
                            </select>
                            {loadingLeagues && <small className="text-muted">Loading leagues...</small>}
                        </div>

                        {form.league && (
                            <div className="mb-3">
                                <label className="form-label">Upcoming Matches</label>
                                {loadingMatches ? (
                                    <div className="text-center py-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : matches.length > 0 ? (
                                    <select
                                        className="form-select"
                                        value={form.event_description}
                                        onChange={(e) => setForm({ ...form, event_description: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a match</option>
                                        {matches.map((match) => {
                                            const matchText = `${match.homeTeam.shortName} vs ${match.awayTeam.shortName} on ${new Date(match.utcDate).toLocaleDateString()}`;
                                            return (
                                                <option key={match.id} value={matchText}>
                                                    {new Date(match.utcDate).toLocaleDateString()} - {match.homeTeam.shortName} vs {match.awayTeam.shortName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                ) : (
                                    <div className="alert alert-info">No upcoming matches found for this league.</div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {form.type === "others" && (
                    <div className="mb-3">
                        <label className="form-label">What is your bet?</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type your bet"
                            value={otherBet}
                            onChange={(e) => setOtherBet(e.target.value)}
                            required
                        />
                    </div>
                )}

                {form.type === "others" || form.league ? (
                    <div className="mb-3">
                        <label className="form-label">Bet Options</label>
                        <div className="d-flex mb-2">
                            <input
                                type="text"
                                className="form-control me-2"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                placeholder="Add an option"
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    const trimmed = newOption.trim();
                                    if (trimmed && !form.options.some(o => o.label === trimmed)) {
                                        setForm({
                                            ...form,
                                            options: [...form.options, { label: trimmed }]
                                        });
                                        setNewOption("");
                                    }
                                }}

                            >
                                Add
                            </button>
                        </div>

                        <ul className="list-group">
                            {form.options.map((opt, index) => (
                                <li key={opt.id || index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {opt.label || opt}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {
                                            const newOptions = form.options.filter((_, i) => i !== index);
                                            setForm({ ...form, options: newOptions });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save changes"}
                </button>

                <button type="button" className="btn btn-danger mx-2" onClick={() => navigate(`/playground/${id}`)} disabled={loading}>
                    Cancel
                </button>
            </form>
        </div>
    );
};