import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BetEdit = () => {

    const { id, betId } = useParams();
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        amount: 0,
        status: "",
        deadline: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBet = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet/${betId}`);
                if (!resp.ok) throw new Error("Failed to fetch bet");

                const data = await resp.json();
                setForm({
                    name: data.name || "",
                    amount: data.amount || 0,
                    status: data.status || "",
                    deadline: data.deadline ? new Date(data.deadline).toISOString().slice(0, 16) : ""
                });
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchBet();
    }, [id, betId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
            setError("Amount must be a positive number")
            return;
        }


        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet/${betId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
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
                        onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
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

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Confirm changes"}
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