import { createContext, useState } from "react";
import React from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  const login = (tk, adminFlag, userId) => {
    localStorage.setItem("token", tk);
    localStorage.setItem("isAdmin", adminFlag);
    localStorage.setItem("userId", userId);
    setToken(tk);
    setIsAdmin(adminFlag);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setIsAdmin(false);
    // ✅ navigate काढून टाका - हे Component मध्ये handle करा
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};