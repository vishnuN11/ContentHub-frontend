import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
const navigate=useNavigate()
  const submit = async () => {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      email, password
    });
    
    login(res.data.token,res.data.isAdmin,res.data.userId);
     navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
      <div className="bg-white rounded-xl w-[90%] sm:w-[380px] p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-purple-700">
          Welcome Back
        </h1>

        <input
          className="w-full mt-6 border p-3 rounded-lg"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mt-4 border p-3 rounded-lg"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full mt-6 bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition"
        >
          Sign In
        </button>
        {/* Register Redirect Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-purple-700 font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
