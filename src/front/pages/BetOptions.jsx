import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export const BetOptions = () => {
    const { id, betId } = useParams();
    const navigate = useNavigate();

    const [newOptionLabel, setNewOptionLabel] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAddOption = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet/${betId}/options`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: newOptionLabel })
            });

            if (!resp.ok) throw new Error("Failed to add option");

            setNewOptionLabel("");
            navigate(`/playground/${id}`, { state: { successMessage: "Option added successfully!" } });

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }; 

    const handleDeleteOption = async (optionId) => {
    if (!confirm("Are you sure you want to delete this option?")) return;

    setError(null);
    setLoading(true);

    try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet/${betId}/options/${optionId}`, {
            method: "DELETE",
        });

        if (!resp.ok) throw new Error("Failed to delete option");

        setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
    } catch (err) {
        console.error(err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add a New Option to Bet</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleAddOption}>
                <div className="mb-3">
                    <label className="form-label">Option Label</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newOptionLabel}
                        onChange={(e) => setNewOptionLabel(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Option"}
                </button>

                <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => navigate(`/playground/${id}`)}
                    disabled={loading}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};
