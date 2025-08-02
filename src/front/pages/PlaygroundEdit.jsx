import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const PlaygroundEdit = () => {

    const { id } = useParams();
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [error, setError] = useState(null)
    const [slug, setSlug] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        const fetchPlayground = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`);
                if (!resp.ok) throw new Error("Failed to fetch playground");

                const data = await resp.json();

                setName(data.playground.name)
                setImage(data.playground.url_image);
                setDescription(data.playground.description);

            } catch (err) {
                console.error(err)
                setError("Could not load playground")
            }
        }

        fetchPlayground()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);


        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/playground/${id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, url_image: image, description })
            })

            if (!resp.ok) {
                const data = await resp.json();
                throw new Error(data.msg || "Failed to update playground")
            }

            navigate("/playground", { state: { successMessage: "Playground upadted successfully!" } })
        } catch (err) {
            console.error(err);
            setError(err.message)
        }
    }

    useEffect(() => {
        const generatedSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        setSlug(generatedSlug)
    }, [name])

    return (
        <div className="container mt-5">
            <h2>Edit Playground</h2>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="playgroundName" className="form-label">Playground Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="playgroundName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}>
                </input>

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
                >
                </input>

                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit" className="btn btn-primary m-2">Save Changes</button>
                <button
                    className="btn btn-danger m-2"
                    onClick={() => navigate(`/playground/`)}
                >
                    Cancel
                </button>

            </form>
        </div>
    )
}

