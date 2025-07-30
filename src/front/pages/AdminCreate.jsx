import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const AdminEdit = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");


  useEffect(() => {
    const getAdmintoEdit = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/adminuser/<int:id>");
        if (!res.ok) throw new Error("Failed to get admin information");
        const data = await response.json();
        setAdmin({
          email: data.email,
          password: "", // password vacio por ahora
        });
      } catch (error) {
        console.error("Error loading admin:", error);
        setMessage("Error loading admin data.");
      } finally {
        setLoading(false);
      }
    };
     getAdmintoEdit();
    }, [id]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/adminuser/<int:id>", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(admin),
      });

      if (!response.ok) throw new Error("Failed to update admin");
      setMessage("Admin updated successfully.");
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Error updating admin.");
    }
  };

    if (loading) return <p>Loading...</p>;

    return (

    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Admin</h2>

      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={admin.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">New Password (optional)</label>
        <input
          type="password"
          name="password"
          value={admin.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>

    );
};
