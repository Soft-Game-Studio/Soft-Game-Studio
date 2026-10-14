/**
 * Redirectpage.jsx: Soft Game Studio Production Gateway Redirection
 *
 * Production-grade redirect interstitial implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, zero emoji icons
 * - Interactive Redirect Controls: Live countdown timer, pause/resume, and immediate redirect
 * - Technical SEO & Security: noindex/nofollow directives via react-helmet-async
 * - Direct Navigation Hub: Verified shortcuts to Projects, Notes, Events, and Legal Policies
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import logo from "../../Assictes/23.png";
import {
  FaExternalLinkAlt,
  FaPause,
  FaPlay,
  FaHome,
  FaArrowRight,
  FaShieldAlt,
  FaCode,
  FaBookOpen,
  FaCalendarAlt,
  FaEnvelope
} from "react-icons/fa";

export default function RedirectPage() {
  const siteUrl = "https://softgamestudios.web.app/";
  const TOTAL_SECONDS = 5;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      window.location.href = siteUrl;
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, isPaused, siteUrl]);

  const handleInstantRedirect = () => {
    window.location.href = siteUrl;
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Progress percentage (0 to 100)
  const progressPercent = Math.max(
    0,
    Math.min(100, ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100)
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <Helmet>
        <title>Redirecting | Soft Game Studio Gateway</title>
        <meta
          name="description"
          content="Automatic transitional redirect to the official Soft Game Studio web portal."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Decorative neutral backdrop lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="w-full max-w-xl relative z-10 space-y-6">
        {/* Main Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-center">
          {/* Logo & Status Badge */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <img
                src={logo}
                alt="Soft Game Studio Logo"
                className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 dark:border-neutral-700 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-neutral-900 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <FaShieldAlt className="text-neutral-500 text-[10px]" />
              Official Transition Gateway
            </span>
          </div>

          {/* Heading & Summary */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Redirecting to Soft Game Studio
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              Where creativity meets engineering to craft modern web software, educational resources, and interactive media.
            </p>
          </div>

          {/* Countdown & Progress Meter */}
          <div className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-600 dark:text-neutral-400">
                {isPaused ? "Countdown paused" : `Navigating in ${secondsLeft} second${secondsLeft === 1 ? "" : "s"}...`}
              </span>
              <button
                type="button"
                onClick={togglePause}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                aria-label={isPaused ? "Resume countdown" : "Pause countdown"}
              >
                {isPaused ? <FaPlay className="text-[9px]" /> : <FaPause className="text-[9px]" />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-neutral-900 dark:bg-white h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleInstantRedirect}
              className="flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed Immediately</span>
              <FaExternalLinkAlt className="text-xs" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaHome className="text-xs" />
              <span>Return Home</span>
            </button>
          </div>

          {/* Useful Destinations */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Direct Destination Shortcuts
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Link
                to="/Projects"
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-400 dark:hover:border-neutral-600 text-left transition-all group"
              >
                <FaCode className="text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white text-xs mb-1" />
                <span className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">Projects</span>
                <span className="block text-[10px] text-neutral-500">Live apps</span>
              </Link>
              <Link
                to="/DownloadNotes"
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-400 dark:hover:border-neutral-600 text-left transition-all group"
              >
                <FaBookOpen className="text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white text-xs mb-1" />
                <span className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">Notes</span>
                <span className="block text-[10px] text-neutral-500">Free books</span>
              </Link>
              <Link
                to="/event"
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-400 dark:hover:border-neutral-600 text-left transition-all group"
              >
                <FaCalendarAlt className="text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white text-xs mb-1" />
                <span className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">Events</span>
                <span className="block text-[10px] text-neutral-500">Hackathons</span>
              </Link>
              <Link
                to="/ContactUs"
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-400 dark:hover:border-neutral-600 text-left transition-all group"
              >
                <FaEnvelope className="text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white text-xs mb-1" />
                <span className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">Contact</span>
                <span className="block text-[10px] text-neutral-500">Support</span>
              </Link>
            </div>
          </div>

          {/* Legal Footer Links */}
          <div className="pt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <Link to="/PrivacyPolicy" className="hover:text-neutral-900 dark:hover:text-white hover:underline transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/TermsAndConditions" className="hover:text-neutral-900 dark:hover:text-white hover:underline transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/CookiesPolicy" className="hover:text-neutral-900 dark:hover:text-white hover:underline transition-colors">
              Cookies Policy
            </Link>
            <span>•</span>
            <Link to="/CopyrightPage" className="hover:text-neutral-900 dark:hover:text-white hover:underline transition-colors">
              Copyright
            </Link>
          </div>

          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()} Soft Game Studio. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}