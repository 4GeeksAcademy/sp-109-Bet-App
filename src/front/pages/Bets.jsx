import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export const Bets = () => {

    const { id } = useParams();
    const [bets, setBets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBets = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet`);
                if (!resp.ok) throw new Error("Failed to fetch bets")

                const data = await resp.json()
                setBets(data.bets);
            } catch (err) {
                console.error(err);
                setError("Error fetching bets")
            } finally {
                setLoading(false)
            }
        }

        getBets()
    }, [id])


    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Bets for Playground {id}</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {bets.length === 0 && !loading && !error ? (
                <p>No bets found.</p>
            ) : (
                <ul className="space-y-3">
                    {bets.map((bet) => (
                        <li key={bet.id} className="border p-4 rounded shadow">
                            <h3 className="text-lg font-bold">{bet.name}</h3>
                            <p><strong>Amount:</strong> {bet.amount}</p>
                            <p><strong>Status:</strong> {bet.status}</p>
                            <p><strong>Deadline:</strong> {bet.deadline ? new Date(bet.deadline).toLocaleString() : "No deadline"}</p>
                            <p><strong>Created by:</strong> {bet.user || "Unknown"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}