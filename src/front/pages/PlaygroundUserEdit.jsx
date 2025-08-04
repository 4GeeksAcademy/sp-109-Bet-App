import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const PlaygroundUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playgrounds, setPlaygrounds] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user_id: "", playground_id: "" });

  useEffect(() => {
    getPlaygrounds();
    getUsers();
    getPlaygroundUser();
  }, []);

  const getPlaygrounds = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground");
      const data = await res.json();
      setPlaygrounds(data.playgrounds || data || []);
    } catch (err) {
      console.error("Error loading playgrounds:", err);
    }
  };

  const getUsers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users");
      const data = await res.json();
      setUsers(data.users || data || []);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const getPlaygroundUser = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playgrounduser/${id}`);
      if (!res.ok) throw new Error("PlaygroundUser not found");

      const user = await res.json();
      setForm({
        user_id: user.user_id,
        playground_id: user.playground_id,
      });
    } catch (error) {
      console.error("Error fetching playground user:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playgrounduser/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update.");
      alert("User updated successfully.");
      navigate("/playgrounduser");
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/playgrounduser");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Playground User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Select Username */}
        <select
          name="user_id"
          value={String(form.user_id)}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        >
          <option value="">- Select User -</option>
          {users.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Select Playground */}
        <select
          name="playground_id"
          value={String(form.playground_id)}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        >
          <option value="">- Select Playground -</option>
          {playgrounds.map((pg) => (
            <option key={pg.id} value={String(pg.id)}>
              {pg.name}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-success text-white px-4 py-2 rounded">
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-danger text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};