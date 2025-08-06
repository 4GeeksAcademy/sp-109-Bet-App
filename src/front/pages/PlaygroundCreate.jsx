import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PlaygroundCreate = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem("token"); // ✅ Recuperamos el token

        if (!token) {
            setError("Debes iniciar sesión para crear un playground");
            return;
        }

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/playground", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // ✅ Enviamos el token
                },
                body: JSON.stringify({ name, url_image: image, description })
            });

            if (!resp.ok) {
                const data = await resp.json();
                throw new Error(data.msg || "Failed to create playground");
            }

            navigate("/playground", { state: { successMessage: "Playground created successfully!" } });

        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    useEffect(() => {
        const generatedSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        setSlug(generatedSlug);
    }, [name]);

    return (
        <div className="container mt-5">
            <h2>Create New Playground</h2>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="playgroundName" className="form-label">Playground Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="playgroundName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="slug" className="form-label mt-3">Slug</label>
                <input
                    type="text"
                    id="slug"
                    className="form-control"
                    value={slug}
                    readOnly
                />

                <label htmlFor="image" className="form-label">Image URL</label>
                <input
                    type="text"
                    className="form-control"
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} 
                />
                <button type="submit" className="btn btn-primary m-2">Create Playground</button>

                <button
                    type="button"
                    className="btn btn-danger m-2"
                    onClick={() => navigate(`/playground/`)}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};
