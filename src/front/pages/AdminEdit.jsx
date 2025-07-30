import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const AdminEdit = () => {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const EditAdmin = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/adminsite/${id}`);
        if (!resp.ok) throw new Error("Failed to get admin");
        const data = await resp.json();
        setEmail(data.email);
      } catch (err) {
        setError("Error loading admin information");
      }
    };

    EditAdmin();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/adminsite/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) throw new Error("Update failed");

      navigate("/adminsite");
    } catch (err) {
      setError("Failed to update admin");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Admin</h2>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
        <button type="" className="btn btn-danger"
        onClick={() => navigate(`/adminsite/`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};