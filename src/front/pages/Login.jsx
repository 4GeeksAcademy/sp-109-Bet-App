import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () =>{

    const [form, setForm] = useState({
        "email": "",
        "password": ""
    })
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try{
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })
            const data = await resp.json()

            if (!resp.ok){
                throw new Error(data.msg || "Failed to login")
            }
            localStorage.setItem('token', data.token)
            navigate(`/private`)

        } catch (err) {
            console.error(err);
            setError(err.message)
        }
    }


    return(
        <div className="container mt-5">
            <h1 className="mb-4"> LOGIN </h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="form-label"> Email </label>
                <input 
                    type="email" 
                    className="form-control"
                    value={form.email}
                    id="email"
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required
                    />

                <label htmlFor="pass" className="form-label"> Password </label>
                <input 
                    type="password" 
                    className="form-control"
                    value={form.password}
                    id="pass"
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    required
                    />

                <button type="submit" className="btn btn-primary mt-2"> Login </button>   
            </form>
        </div>
    )
}