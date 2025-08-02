import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PlaygroundUserCreate = () => {

  const [playgrounds, setPlaygrounds] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPlayground, setSelectedPlayground] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const getData = async () => {
      try {
        const [pgResponse, userResponse] = await Promise.all([
          fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground"),
          fetch(import.meta.env.VITE_BACKEND_URL + "/api/users"),
        ]);

        const playgroundsData = await pgResponse.json();
        const usersData = await userResponse.json();

        setPlaygrounds( playgroundsData.playgrounds || playgroundsData || []);
        setUsers(usersData.users || usersData || []);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    getData();
  }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedPlayground) {
      setMessage("Select an user and a playground.");
      return;
    }
     try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playgrounduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        user_id: parseInt(selectedUser),
        playground_id: parseInt(selectedPlayground),
        }),
      });
    
          const data = await response.json();

      if (response.ok) {
        setMessage(`The user has joined the room: ${data.user.playground}`);
        setSelectedUser("");
        setSelectedPlayground("");
      } else {
        setMessage(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      setMessage("Could not connect to the backend");
    }
  };

  const handleCancel = () => {
    navigate("/playgrounduser");
  };


    return (
     <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Join user to a playground</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Selector de usuario */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select an user--</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>

        {/* Selector de playground */}
        <select
          value={selectedPlayground}
          onChange={(e) => setSelectedPlayground(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">- Select a playground -</option>
          {playgrounds.map((pg) => (
            <option key={pg.id} value={pg.id}>
              {pg.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full btn btn-success text-white p-2 rounded hover:bg"
        >
          Join playground
        </button>
           <button
            type="button"
            onClick={handleCancel}
            className="btn btn-danger text-white md-2 px-4 py-2 rounded"
        >
            Cancel
        </button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
    );
};


