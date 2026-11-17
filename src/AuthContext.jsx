import { createContext, useContext, useState } from "react";
import { api } from "./api.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const KEY = "blog_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch {
      return null;
    }
  });

  const persist = (u) => {
    const { password, ...safe } = u;
    localStorage.setItem(KEY, JSON.stringify(safe));
    setUser(safe);
    return safe;
  };

  const login = async (email, password) => {
    const found = await api.get(
      `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    );
    if (!found.length) throw new Error("Invalid email or password.");
    if (found[0].status === "blocked")
      throw new Error("This account has been blocked by the admin.");
    return persist(found[0]);
  };

  const register = async ({ name, email, password, bio }) => {
    const existing = await api.get(`/users?email=${encodeURIComponent(email)}`);
    if (existing.length)
      throw new Error("An account with this email already exists.");
    const created = await api.post("/users", {
      name,
      email,
      password,
      bio,
      role: "author",
      status: "active",
    });
    return persist(created);
  };

  const updateProfile = async (changes) => {
    const updated = await api.patch(`/users/${user.id}`, changes);
    return persist(updated);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
