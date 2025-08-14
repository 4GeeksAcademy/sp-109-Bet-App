// hooks/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error("Error fetching user");
        const data = await resp.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setToken(null);
        setRole(null)
        localStorage.removeItem("token");
        localStorage.removeItem("role")
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = (newToken, userData, userRole) => {
    localStorage.setItem("token", newToken,);
    localStorage.setItem("role", userRole);
    setToken(newToken);
    setUser(userData);
    setRole(userRole)
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    setToken(null);
    setUser(null);
    setRole(null)
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

