import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  // Step management
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details
  
  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Timer for resend OTP
  const startTimer = (seconds) => {
    setTimer(seconds);
    setResendDisabled(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Validate email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_URL}/otp/send-otp`, { email });
      setSuccess("OTP sent successfully! Check your email.");
      setStep(2);
      startTimer(60); // 60 seconds cooldown
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_URL}/otp/resend-otp`, { email });
      setSuccess("New OTP sent successfully! Check your email.");
      startTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_URL}/otp/verify-otp`, { email, otp });
      setSuccess("OTP verified successfully!");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Complete Registration
  const handleRegister = async () => {
    // Validation
    if (!name || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        otp,
      });

      setSuccess("Registration successful! Redirecting to login...");
      
      // Auto login (optional - uncomment if you want auto login)
      // localStorage.setItem('token', res.data.token);
      // localStorage.setItem('userId', res.data.user.id);
      // localStorage.setItem('isAdmin', res.data.user.isAdmin);
      // navigate('/');
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 py-8">
      <div className="bg-white rounded-xl w-[90%] sm:w-[450px] p-8 shadow-2xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
          {step === 1 && "Create Account"}
          {step === 2 && "Verify Email"}
          {step === 3 && "Complete Registration"}
        </h1>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200"></div>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`relative z-10 flex flex-col items-center ${
                s < step
                  ? 'text-green-600'
                  : s === step
                  ? 'text-purple-600 font-bold'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${
                  s < step
                    ? 'bg-green-100 border-green-500'
                    : s === step
                    ? 'bg-purple-100 border-purple-500'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                {s < step ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              <span className="text-xs">
                {s === 1 && 'Email'}
                {s === 2 && 'OTP'}
                {s === 3 && 'Details'}
              </span>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">{success}</span>
            </div>
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm">
                We've sent a verification code to
              </p>
              <p className="font-semibold text-purple-600">{email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                maxLength="6"
                className="w-full text-center text-2xl tracking-widest py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend OTP Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              
              {resendDisabled ? (
                <p className="text-center text-sm text-gray-500">
                  Resend available in <span className="font-bold text-purple-600">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-purple-600 hover:text-purple-800 font-semibold text-sm"
                >
                  Resend OTP
                </button>
              )}
              
              <p className="text-center text-xs text-gray-400 mt-3">
                Check your spam folder if you don't see the email
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={handleBack}
              className="w-full text-gray-600 hover:text-gray-800 text-sm mt-2"
            >
              ← Back to email
            </button>
          </div>
        )}

        {/* Step 3: Registration Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Back Button */}
            <button
              onClick={handleBack}
              className="w-full text-gray-600 hover:text-gray-800 text-sm mt-2"
            >
              ← Back to OTP verification
            </button>
          </div>
        )}

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="text-purple-600 font-semibold hover:text-purple-800" to="/signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}