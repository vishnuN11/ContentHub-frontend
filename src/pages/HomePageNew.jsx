import React,{ useContext, useEffect, useState } from "react";
import {  Link} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function HomePageNew() {
  const [count, setCount] = useState(0);
const { token, user } = useContext(AuthContext);
const isLoggedIn = !!token;
  // Smooth counter animation
  useEffect(() => {
    let start = 0;
    const end = 5000;
    const duration = 2000;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, []);
 
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-indigo-600">ContentHub</span>
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Discover premium articles in Health, Wellness, Business, and more.
          Join thousands of readers who trust ContentHub for quality content.
        </p>

        {/* Counter */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-indigo-600">
            {count}+
          </h2>
          <p className="text-gray-500">Active Users</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          
            {!isLoggedIn && (
    <>
          <Link
            to="/signup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg transition duration-300"
          >
            Sign Up Now
          </Link>

          <Link
            to="/signin"
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-xl transition duration-300"
          >
            Login
          </Link>
          </>)}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Premium Articles</h3>
            <p className="text-gray-500 text-sm">
              Access high-quality curated articles across multiple categories.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="text-3xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">Multi-Language</h3>
            <p className="text-gray-500 text-sm">
              Read content in English, Hindi, and Marathi.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="text-3xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Like & Share</h3>
            <p className="text-gray-500 text-sm">
              Engage with articles and share knowledge with others.
            </p>
          </div>

        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-indigo-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Explore Premium Content?
        </h2>
        <p className="mb-6 text-indigo-100">
          Sign up today and unlock full access to ContentHub.
        </p>

       {!isLoggedIn&& <Link
          to="/signup"
          className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          Create Free Account
        </Link>}
      </div>

    </div>
  );
}
