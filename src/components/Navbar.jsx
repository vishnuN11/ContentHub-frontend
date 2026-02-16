import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import React from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, isAdmin, logout } = useContext(AuthContext);
  const location = useLocation();

  const isLoggedIn = !!token;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Close mobile menu on window resize (if becomes desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const navItems = [
    { path: "/article", label: "Articles" },
    { path: "/health", label: "Health & Well" },
    { path: "/finance", label: "Financial Tip" },
    // { path: "/travel", label: "Travel" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || open 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              ContentHub
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${
                    location.pathname === item.path ? 'w-full' : ''
                  }`}></span>
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/admin'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  Admin Panel
                </Link>
              )}

              {/* Auth Buttons */}
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none z-50"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span className={`absolute left-0 w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                  open ? 'top-2 rotate-45' : 'top-0'
                }`}></span>
                <span className={`absolute left-0 w-6 h-0.5 bg-gray-700 top-2 transition-all duration-300 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute left-0 w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                  open ? 'top-2 -rotate-45' : 'top-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - FIXED */}
        <div className={`md:hidden fixed inset-x-0 top-16 bg-white shadow-xl transition-all duration-300 ease-in-out z-40 ${
          open 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
        }`}>
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:pl-6'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    location.pathname === '/admin'
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'text-yellow-600 hover:bg-yellow-50 hover:pl-6'
                  }`}
                >
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-gray-200 my-3"></div>

              {/* Mobile Auth Buttons */}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 hover:pl-6 transition-all duration-300 text-left"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 text-center shadow-md"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
}