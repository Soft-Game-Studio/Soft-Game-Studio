/**
 * NoPage.jsx: Soft Game Studio 404 Error Experience
 *
 * Production-grade 404 page implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, zero emoji icons
 * - Restrained Motion: Subtle Framer Motion reveal respecting reduced motion
 * - Discovery Directory Grid: Fast navigation to Projects, Notes, Events, and Quizzes
 * - Technical SEO: noindex, follow directive via react-helmet-async
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet-async";
import {
  FaHome,
  FaArrowLeft,
  FaHeadset,
  FaCode,
  FaBookOpen,
  FaTrophy,
  FaAward,
  FaExclamationTriangle,
  FaCompass
} from "react-icons/fa";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "SGS Projects",
      desc: "Explore live web applications, tools, and UI showcases.",
      href: "/Projects",
      icon: FaCode,
    },
    {
      title: "Notes & Books",
      desc: "Download verified semester notes and university textbooks.",
      href: "/DownloadNotes",
      icon: FaBookOpen,
    },
    {
      title: "Hackathons & Events",
      desc: "Participate in coding challenges and developer events.",
      href: "/event",
      icon: FaTrophy,
    },
    {
      title: "Official Quizzes",
      desc: "Take technical assessments and earn verified certificates.",
      href: "/Exam",
      icon: FaAward,
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>404 Page Not Found | Soft Game Studio</title>
        <meta
          name="description"
          content="The page you are looking for does not exist or has been relocated. Explore Soft Game Studio projects, notes, courses, and certifications."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="404 Page Not Found | Soft Game Studio" />
        <meta
          property="og:description"
          content="The requested page could not be located on Soft Game Studio."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="min-h-[calc(100vh-160px)] bg-neutral-50/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-5xl space-y-12">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Messaging & Primary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100/80 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                <FaExclamationTriangle className="text-[11px]" />
                <span>Error 404 • Page Not Found</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                  We could not find the page you were looking for
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  The URL you visited might have been relocated, renamed, or is currently undergoing maintenance. Use the quick navigation controls below to continue exploring.
                </p>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/"
                  className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-all shadow-sm flex items-center gap-2"
                >
                  <FaHome className="text-xs" />
                  <span>Return to Homepage</span>
                </Link>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FaArrowLeft className="text-xs" />
                  <span>Go to Previous Page</span>
                </button>

                <Link
                  to="/ContactUs"
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FaHeadset className="text-xs" />
                  <span>Contact Support</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Visual Artwork */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-sm sm:max-w-md p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm text-center">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2F404Error.png?alt=media"
                  alt="404 illustration - page lost in orbit"
                  loading="eager"
                  className="w-full h-auto max-h-64 object-contain mx-auto"
                />
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2">
                  <FaCompass className="text-neutral-400" />
                  <span>Resource status: HTTP 404 (Not Found)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Directory Quick Navigation */}
          <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Explore Popular Studio Directories
              </h2>
              <span className="text-xs text-neutral-500">
                Verified links to active studio hubs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors">
                        <IconComponent className="text-xs" />
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-neutral-900 dark:group-hover:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white inline-flex items-center gap-1 transition-colors">
                      <span>Visit Directory</span>
                      <span>&rarr;</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
