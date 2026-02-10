import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { token, isAdmin, logout } = useContext(AuthContext);

  const isLoggedIn = !!token;

  return (
    <nav className="bg-dark text-white px-6 py-4 flex justify-between relative">
      <Link className="font-bold" to="/">ContentHub</Link>

      {/* Desktop */}
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/article">Articles</Link>
        {/* <Link to="/stock">Stock</Link> */}
        <Link to="/contact">Contact</Link>

        {isAdmin && (
          <Link className="text-yellow-400 font-semibold" to="/admin">
            Admin Panel
          </Link>
        )}

        {/* 🔑 LOGIN / LOGOUT */}
        {isLoggedIn ? (
          <button onClick={logout} className="text-red-400">
            Logout
          </button>
        ) : (
          <Link className="text-green-400" to="/signin">
            Login
          </Link>
        )}
      </div>

      {/* Mobile */}
      <button className="md:hidden" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-dark flex flex-col items-center gap-4 py-6">
          <Link to="/article">Articles</Link>
          {/* <Link to="/stock">Stock</Link> */}
          <Link to="/contact">Contact</Link>

          {isAdmin && (
            <Link className="text-yellow-400 font-semibold" to="/admin">
              Admin Panel
            </Link>
          )}

          {isLoggedIn ? (
            <button onClick={logout} className="text-red-400">
              Logout
            </button>
          ) : (
            <Link className="text-green-400" to="/signin">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
