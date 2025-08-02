import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaygroundUser = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playgrounduser");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Are you sure you want delete this playground user?")){
    return;
    } 
    
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playgrounduser/${id}`, {
      method: "DELETE",
      });
     if (!res.ok) throw new Error("Error deleting...");

     const deleted = await res.json();
     setUsers(prev => prev.filter(user => user.id !== deleted.id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };


  const handleEdit = (user) => {
    navigate(`/playgrounduser/edit/${user.id}`);
  };

  const handleCreate = () => {
    navigate("/playgrounduser/create");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Playground Users</h2>

      <button
        className="btn btn-success px-4 py-2 rounded hover:bg"
        onClick={handleCreate}
      >
        Add Playground User
      </button>

      {users.length === 0 ? (
        <p>There's not users asign.</p>
      ) : (
        <div className="d-flex justify-content-center">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Username</th>
              <th className="border p-2">Playground</th>
              <th className="border p-2">Join at</th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.username}</td>
                <td className="border p-2">{u.playground}</td>
                <td className="border p-2">{u.joined_at}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="btn btn-danger text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default PlaygroundUser;
