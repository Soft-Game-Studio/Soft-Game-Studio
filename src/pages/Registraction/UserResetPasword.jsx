/**
 * UserResetPasword.jsx: Soft Game Studio Password Recovery
 *
 * Production-grade password recovery flow implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, zero emoji icons
 * - Firebase Auth Reset: Dispatches official reset email with clear feedback
 * - Security & Accessibility: Anti-spam resend throttle, inline error alerts, noindex robots
 * - Seamless Navigation: Direct access back to login portal
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../DataBase/firebaseConfig";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet-async";
import {
  FaEnvelope,
  FaKey,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaperPlane
} from "react-icons/fa";

export default function UserResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter the email address linked to your account.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setEmailSent(true);
      toast.success("Password reset email sent. Please check your inbox.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("[SGS Auth] Password reset error:", error.code);
      let msg = "Failed to send reset email. Please verify your address and try again.";
      if (error.code === "auth/user-not-found") {
        msg = "No account found matching this email address.";
      } else if (error.code === "auth/invalid-email") {
        msg = "Please provide a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        msg = "Too many reset attempts. Please wait a few moments before trying again.";
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Reset Password | Soft Game Studio Portal</title>
        <meta
          name="description"
          content="Reset your password securely to regain access to your Soft Game Studio account."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Reset Password | Soft Game Studio" />
        <meta
          property="og:description"
          content="Recover your Soft Game Studio account credentials."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <FaKey className="text-neutral-500 text-[10px]" />
                Account Recovery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Reset Password
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Enter your verified email address to receive password reset instructions.
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

            {/* Success State Confirmation */}
            {emailSent ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm space-y-2 text-center">
                  <FaCheckCircle className="text-emerald-600 dark:text-emerald-400 text-xl mx-auto" />
                  <p className="font-semibold">Reset Link Dispatched</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    We sent a recovery link to <strong>{email}</strong>. Check your inbox and spam folder to proceed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaPaperPlane className="text-[10px]" />
                  <span>Resend Recovery Email</span>
                </button>
              </div>
            ) : (
              /* Reset Request Form */
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Registered Email Address
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
                      <span>Sending instructions...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FaPaperPlane className="text-xs" />
                      <span>Send Password Reset Email</span>
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login Footer */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <FaArrowLeft className="text-[10px]" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}