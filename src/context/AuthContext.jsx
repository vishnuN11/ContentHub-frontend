import { createContext, useState } from "react";
import React from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  const login = (tk, adminFlag,userId) => {
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
    navigate("/signin", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



// // context/AuthContext.jsx
// import React, { createContext, useState } from "react";

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [isAdmin, setIsAdmin] = useState(
//     localStorage.getItem("isAdmin") === "true"
//   );

//   // 🔒 Subscription (future use)
//   const [isSubscribed, setIsSubscribed] = useState(
//     localStorage.getItem("isSubscribed") === "true"
//   );

//   const login = (token, adminFlag, subscribeFlag = false) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("isAdmin", String(adminFlag));
//     localStorage.setItem("isSubscribed", String(subscribeFlag));

//     setToken(token);
//     setIsAdmin(adminFlag);
//     setIsSubscribed(subscribeFlag);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("isAdmin");
//     localStorage.removeItem("isSubscribed");

//     setToken(null);
//     setIsAdmin(false);
//     setIsSubscribed(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ token, isAdmin, isSubscribed, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

