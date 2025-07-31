import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export const UserBetsBoard = () => {
  const [userId] = useState(1); // Simulación de usuario logueado
  const [betName, setBetName] = useState("");
  const [betOptionName, setBetOptionName] = useState("");
  const [userBets, setUserBets] = useState([]);
  const [editingBet, setEditingBet] = useState(null); // Para saber si editamos

  // Obtener apuestas de usuarios
  const getUserBets = async () => {
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user_bets");
      const data = await resp.json();
      setUserBets(data);
    } catch (error) {
      console.error("Error fetching user bets:", error);
    }
  };

  // Guardar o actualizar apuesta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBet) {
        // 🔹 Actualizar apuesta
        await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user_bets/${editingBet.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            bet_name: betName,
            bet_option_name: betOptionName
          }),
        });
        setEditingBet(null);
      } else {
        // 🔹 Crear apuesta nueva
        await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user_bets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            bet_name: betName,
            bet_option_name: betOptionName
          }),
        });
      }

      setBetName("");
      setBetOptionName("");
      getUserBets();
    } catch (error) {
      console.error("Error saving bet:", error);
    }
  };

  // Editar apuesta
  const handleEdit = (bet) => {
    setEditingBet(bet);
    setBetName(bet.bet_name);
    setBetOptionName(bet.bet_option_name);
  };

  // Eliminar apuesta
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta apuesta?")) return;
    try {
      await fetch(import.meta.env.VITE_BACKEND_URL + `/api/user_bets/${id}`, {
        method: "DELETE",
      });
      getUserBets();
    } catch (error) {
      console.error("Error deleting bet:", error);
    }
  };

  useEffect(() => {
    getUserBets();
  }, []);

  const nextBetId = userBets.length ? userBets[userBets.length - 1].bet_id + 1 : 1;

  return (
    <div className="container mt-4">
      <h2>User Bets</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <label className="form-label">User ID</label>
        <input className="form-control mb-2" value={userId} readOnly />

        <label className="form-label">Bet ID</label>
        <input className="form-control mb-2" value={editingBet ? editingBet.bet_id : nextBetId} readOnly />

        <label className="form-label">Write Bet Name</label>
        <input
          className="form-control mb-2"
          placeholder="Example: Bet on Team A"
          value={betName}
          onChange={(e) => setBetName(e.target.value)}
          required
        />

        <label className="form-label">Write Bet Option</label>
        <input
          className="form-control mb-2"
          placeholder="Example: Option 1, Option 2..."
          value={betOptionName}
          onChange={(e) => setBetOptionName(e.target.value)}
          required
        />

        <button className="btn btn-primary" type="submit">
          {editingBet ? "Update Bet" : "Save Bet"}
        </button>
      </form>

      <h4 className="mt-4">Saved Bets</h4>
      <ul className="list-group">
        {userBets.length === 0 ? (
          <li className="list-group-item">No bets saved yet.</li>
        ) : (
          userBets.map((ubet) => (
            <li key={ubet.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>User:</strong> {ubet.user_id} |
                <strong> Bet ID:</strong> {ubet.bet_id} |
                <strong> Bet:</strong> {ubet.bet_name} |
                <strong> Option:</strong> {ubet.bet_option_name} |
                <em> {ubet.created_at}</em>
              </span>
              <span>
                <FaEdit
                  className="text-warning me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit(ubet)}
                />
                <FaTrash
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(ubet.id)}
                />
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
