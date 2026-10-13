/**
 * UserSignup.jsx: Soft Game Studio Registration Portal
 *
 * Production-grade registration page implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, zero emoji icons
 * - Complete Form Validation: Live password criteria verification & mobile input validation
 * - Firebase Auth & Firestore Integration: Sequential roll-number assignment via transaction
 * - Accessible Controls: Password toggle, inline error alerts, noindex robots directive
 */

import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../DataBase/firebaseConfig";
import { addUserToFirestore } from "../../Modules/signupHandler";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet-async";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserPlus,
  FaCheckCircle,
  FaCircle,
  FaExclamationCircle
} from "react-icons/fa";

export default function UserSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Real-time password criteria
  const passwordCriteria = useMemo(() => {
    const pwd = formData.password || "";
    return {
      minLength: pwd.length >= 6,
      hasCapital: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    };
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordCriteria).every(Boolean);
  }, [passwordCriteria]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage("Please enter both your first and last name.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    if (!isPasswordValid) {
      setShowCriteria(true);
      setErrorMessage("Please make sure your password satisfies all security criteria.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim().toLowerCase(),
        formData.password
      );

      // Save user record with sequential roll-number in Firestore
      await addUserToFirestore(userCredential.user, {
        ...formData,
        phone: cleanPhone,
      });

      toast.success("Account created successfully! Redirecting to login...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });

      navigate("/login");
    } catch (error) {
      console.error("[SGS Auth] Signup error:", error.code, error.message);
      let msg = "Registration could not be completed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        msg = "An account with this email address already exists. Please sign in instead.";
      } else if (error.code === "auth/invalid-email") {
        msg = "Please provide a valid email address.";
      } else if (error.code === "auth/weak-password") {
        msg = "Password is too weak. Please include letters, numbers, and symbols.";
      } else if (error.code === "auth/operation-not-allowed") {
        msg = "Email registration is currently suspended. Please contact studio support.";
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Sign Up | Soft Game Studio Portal</title>
        <meta
          name="description"
          content="Create your Soft Game Studio account to access curated engineering projects, university notes, and developer tools."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Sign Up | Soft Game Studio" />
        <meta
          property="og:description"
          content="Create your Soft Game Studio account."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-lg space-y-6">
          {/* Main Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <FaUserPlus className="text-neutral-500 text-[10px]" />
                New Studio Account
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Create an Account
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Join Soft Game Studio to explore projects, resources, and developer tools.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div
                className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 text-xs flex items-start gap-2.5"
                role="alert"
              >
                <FaExclamationCircle className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      autoComplete="given-name"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      autoComplete="family-name"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setShowCriteria(true)}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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

                {/* Password Criteria Checklist */}
                {(showCriteria || formData.password.length > 0) && (
                  <div className="p-3 mt-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30 text-[11px] space-y-1.5 transition-all">
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Password Requirements:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.minLength ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500"}`}>
                        {passwordCriteria.minLength ? <FaCheckCircle className="text-[10px]" /> : <FaCircle className="text-[6px]" />}
                        <span>At least 6 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.hasCapital ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500"}`}>
                        {passwordCriteria.hasCapital ? <FaCheckCircle className="text-[10px]" /> : <FaCircle className="text-[6px]" />}
                        <span>One capital letter</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.hasNumber ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500"}`}>
                        {passwordCriteria.hasNumber ? <FaCheckCircle className="text-[10px]" /> : <FaCircle className="text-[6px]" />}
                        <span>One numeric digit</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordCriteria.hasSymbol ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500"}`}>
                        {passwordCriteria.hasSymbol ? <FaCheckCircle className="text-[10px]" /> : <FaCircle className="text-[6px]" />}
                        <span>One special symbol</span>
                      </div>
                    </div>
                  </div>
                )}
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
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Navigation */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-600 dark:text-neutral-400">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-bold text-neutral-900 dark:text-white hover:underline ml-1"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}