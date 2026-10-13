/**
 * UserLogin.jsx: Soft Game Studio Authentication Portal
 *
 * Production-grade login page implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, zero emoji icons
 * - Firebase Auth Direct Integration: Authoritative credential validation and session handling
 * - Security & Accessibility: Password visibility toggle, inline error alerts, noindex robots directive
 * - Seamless Route Navigation: Clean redirects to dashboard on successful authentication
 */

import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../DataBase/firebaseConfig";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet-async";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaExclamationCircle
} from "react-icons/fa";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      if (userCredential?.user) {
        toast.success("Welcome back! Login successful.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("[SGS Auth] Login failure:", error.code);
      let message = "Invalid email or password. Please verify your credentials.";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again or reset your password.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please wait a few moments or reset your password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Login | Soft Game Studio Portal</title>
        <meta
          name="description"
          content="Sign in to your Soft Game Studio account to access engineering projects, academic notes, courses, and studio community tools."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Login | Soft Game Studio" />
        <meta
          property="og:description"
          content="Secure login to your Soft Game Studio account."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Main Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <FaShieldAlt className="text-neutral-500 text-[10px]" />
                Secure Studio Authentication
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Access your engineering projects, notes, and developer tools.
              </p>
            </div>

            {/* Error Alert Banner */}
            {errorMessage && (
              <div
                className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 text-xs flex items-start gap-2.5"
                role="alert"
              >
                <FaExclamationCircle className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Password
                  </label>
                  <Link
                    to="/resetpassword"
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Navigation */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-600 dark:text-neutral-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-neutral-900 dark:text-white hover:underline ml-1"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}