import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function SignIn() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    let navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const submit = async () => {
        // 🔒 Frontend validation
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setError("");

            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
                {
                    name,
                    email,
                    password,
                }
            );
            navigate("/signin")
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
            <div className="bg-white rounded-xl w-[90%] sm:w-[380px] p-8 shadow-2xl">
                <h1 className="text-2xl font-bold text-center text-purple-700">
                    Create Account
                </h1>

                {error && (
                    <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
                )}

                <input
                    className="w-full mt-6 border p-3 rounded-lg"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full mt-4 border p-3 rounded-lg"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full mt-4 border p-3 rounded-lg"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full mt-4 border p-3 rounded-lg"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    onClick={submit}
                    className="w-full mt-6 bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition"
                >
                    Sign Up
                </button>

                <p className="mt-4 text-center text-sm">
                    Already have an account?
                    <Link className="text-purple-700 ml-1 font-semibold" to="/signin">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
