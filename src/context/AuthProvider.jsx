import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  // Save tokens + decode user
  useEffect(() => {
    if (authTokens) {
      localStorage.setItem("authTokens", JSON.stringify(authTokens));
      setUser(jwtDecode(authTokens.access));
    } else {
      localStorage.removeItem("authTokens");
      setUser(null);
    }
  }, [authTokens]);

  // Refresh tokens periodically
  useEffect(() => {
    if (!authTokens) return;

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 59 * 60 * 1000); // every 59 min

    return () => clearInterval(refreshInterval);
  }, [authTokens]);

  const refreshToken = async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return;
    }

    const response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: authTokens.refresh }),
    });

    if (response.ok) {
      const data = await response.json();
      const updatedTokens = { ...authTokens, access: data.access };
      setAuthTokens(updatedTokens);
      setUser(jwtDecode(data.access));
    } else {
      logoutUser();
    }
  };

  const loginUser = async (username, password) => {
    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      return true;
    } else {
      alert("Login failed!");
      return false;
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    isLoggedIn: !!authTokens,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
