import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Bets = () => {
  const { id } = useParams();
  const [bets, setBets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBets = async () => {
      try {
        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}/bet`
        );
        if (!resp.ok) throw new Error("Failed to fetch bets");

        const data = await resp.json();
        // Mantengo la forma original (data.bets)
        setBets(data.bets);
      } catch (err) {
        console.error(err);
        setError("Error fetching bets");
      } finally {
        setLoading(false);
      }
    };

    getBets();
  }, [id]);

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
            <li key={bet.id} className="border p-4 rounded shadow d-flex gap-3 align-items-center">
              {/* Miniatura si viene url_image */}
              {bet.url_image ? (
                <img
                  src={bet.url_image}
                  alt={bet.name}
                  width={72}
                  height={72}
                  style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }}
                />
              ) : null}

              <div>
                <h3 className="text-lg font-bold mb-1">{bet.name}</h3>
                <p className="mb-1"><strong>Amount:</strong> {bet.amount}</p>
                <p className="mb-1"><strong>Status:</strong> {bet.status}</p>
                <p className="mb-1">
                  <strong>Deadline:</strong>{" "}
                  {bet.deadline ? new Date(bet.deadline).toLocaleString() : "No deadline"}
                </p>
                <p className="mb-0"><strong>Created by:</strong> {bet.user || "Unknown"}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
