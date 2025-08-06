import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {

    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError("No token found. Please login.")
            navigate("/login")
            return;
        }

        const fetchPrivateData = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/private`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (!resp.ok) throw new Error("Unauthorized or token expired");


                const data = await resp.json();
                setUser(data.user)
            } catch (err) {
                console.error(err)
                setError(err.message)
                localStorage.removeItem('token')
                navigate("/login")
            }

        }
        fetchPrivateData()
    }, [navigate])

        const handleLogOut = () => {
        if (confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('token');
            navigate ('/login');
            window.location.reload();
        }
        };

    return (
        <div className="container mb-3 mt-5">
            {error && <div className="alert alert-danger">{error}</div>}

            <h1>Welcome to the private zone</h1>

            {user && (
                <>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                </>
            )}

            <button 
            onClick={handleLogOut} className="btn btn-danger mt-3"> Logout </button>
        </div>
    )
}