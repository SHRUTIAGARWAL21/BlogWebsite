import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/user/profile`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (data.username) {
          setUser(data);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); // Done loading
  }, []);

  function logout() {
    fetch(`${apiUrl}/user/logout`, { credentials: "include", method: "POST" })
      .then(() => setUser(null))
      .catch((error) => console.error("Logout failed:", error));
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
