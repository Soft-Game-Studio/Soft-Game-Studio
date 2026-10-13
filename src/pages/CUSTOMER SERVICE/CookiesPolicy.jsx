// src/pages/CUSTOMER SERVICE/CookiesPolicy.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  Cookie,
  Info,
  SlidersHorizontal,
  Globe,
  Settings,
  Mail,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

const CookiesPolicy = () => {
  const shouldReduceMotion = useReducedMotion();

  const cookieData = [
    {
      name: "termsAccepted",
      purpose: "Stores user acknowledgment of Terms and Conditions and Legal Notices",
      type: "First-party",
      data: "true / false flag",
      duration: "1 year",
      essential: "Yes",
    },
    {
      name: "_ga, _gid",
      purpose: "Aggregates anonymous traffic metrics via Google Analytics for performance optimization",
      type: "Third-party",
      data: "Pseudonymous client identifier and session metrics",
      duration: "2 years / 24 hours",
      essential: "No",
    },
    {
      name: "firebase-auth",
      purpose: "Maintains authenticated user session token using Firebase Authentication",
      type: "First-party",
      data: "Encrypted Auth ID token (JWT)",
      duration: "Session / Browser lifetime",
      essential: "Yes",
    },
    {
      name: "userProfile",
      purpose: "Caches localized profile attributes (name, email) to reduce redundant queries",
      type: "First-party",
      data: "User metadata object",
      duration: "1 year",
      essential: "Yes",
    },
    {
      name: "cartData",
      purpose: "Preserves selected course notes and educational products in shopping cart",
      type: "First-party",
      data: "Array of product identifiers and quantities",
      duration: "30 days",
      essential: "No",
    },
    {
      name: "orderHistory",
      purpose: "Stores temporary order reference keys for immediate receipt confirmation",
      type: "First-party",
      data: "Order identifier and verification status",
      duration: "30 days",
      essential: "No",
    },
    {
      name: "paymentSession",
      purpose: "Tracks transaction token state during checkout execution",
      type: "First-party",
      data: "Transaction reference hash",
      duration: "Session",
      essential: "Yes",
    },
    {
      name: "theme",
      purpose: "Remembers chosen interface mode (dark or light mode)",
      type: "First-party",
      data: "dark / light string",
      duration: "1 year",
      essential: "No",
    }
  ];

  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/CookiesPolicy#webpage",
          "url": "https://softgamestudios.web.app/CookiesPolicy",
          "name": "Cookies Policy | Soft Game Studio",
          "description": "Inventory of first-party and third-party cookies utilized by Soft Game Studio for authentication, session handling, and analytics.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://softgamestudios.web.app/#website",
            "name": "Soft Game Studio",
            "url": "https://softgamestudios.web.app"
          }
        }
      ]
    });
  }, []);

  const pageTitle = "Cookies Policy | Soft Game Studio";
  const pageDescription = "Learn how Soft Game Studio utilizes cookies and local storage tokens for authentication, session security, and learning preferences.";
  const canonicalUrl = "https://softgamestudios.web.app/CookiesPolicy";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Cookies Policy, Soft Game Studio, Web Storage, Firebase Auth Cookies, Analytics Cookies, Cookie Table" />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {structuredData}
        </script>
      </Helmet>

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-neutral-900">
        
        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              <Link to="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                Cookies Policy
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <Cookie className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Browser Storage & Transparency</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  Cookies Policy
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  Clear accounting of cookies, session identifiers, and local browser storage mechanisms deployed across Soft Game Studio.
                </p>
              </div>

              <div className="shrink-0 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 text-xs">
                <span className="font-mono text-neutral-400 block uppercase tracking-wider text-[10px]">
                  Audit Date
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mt-0.5">
                  Last Updated: June 7, 2025
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px] mt-0.5">
                  EU & India e-Privacy Compliant
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* ── Content Sections ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">

          {/* Section 1: Overview */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="overview-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-[#00ACF0]" />
              </div>
              <h2 id="overview-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Understanding Browser Cookies
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Cookies are compact data files saved in your local web browser when visiting websites. They allow our systems to recognize your logged-in session, persist your theme preferences (Dark vs. Light mode), and retain your items in the cart while navigating.
              </p>
              <p>
                Soft Game Studio strictly avoids intrusive third-party cross-site advertising beacons. The table below provides an exhaustive audit of all cookies and tokens used on our platform.
              </p>
            </div>
          </section>

          {/* Section 2: Complete Cookie Audit Table */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs overflow-hidden"
            aria-labelledby="table-heading"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h2 id="table-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Active Cookie Inventory
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Detailed declaration of purpose, duration, and classification
                </p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 sm:-mx-8">
              <div className="inline-block min-w-full align-middle px-6 sm:px-8">
                <table className="min-w-full text-left text-xs divide-y divide-neutral-200 dark:divide-neutral-800">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="py-3 px-4">Cookie / Key</th>
                      <th scope="col" className="py-3 px-4">Functional Purpose</th>
                      <th scope="col" className="py-3 px-4">Provider</th>
                      <th scope="col" className="py-3 px-4">Retention</th>
                      <th scope="col" className="py-3 px-4 text-center">Essential</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                    {cookieData.map((cookie, idx) => (
                      <tr 
                        key={idx}
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                          {cookie.name}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 max-w-xs leading-relaxed">
                          {cookie.purpose}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {cookie.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {cookie.duration}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {cookie.essential === "Yes" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Required
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                              Optional
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3: Third Party Providers */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="third-party-heading"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 id="third-party-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Infrastructure & Third-Party Services
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Authenticated cloud services operating beneath our application layer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <a
                href="https://policies.google.com/technologies/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#00ACF0] transition-colors">
                    Google Analytics & Cloud Services
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Used exclusively for calculating site performance and detecting network errors.
                </p>
              </a>

              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#00ACF0] transition-colors">
                    Firebase Authentication & Firestore
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Cryptographically verified token handling for safe student account logins.
                </p>
              </a>

            </div>
          </section>

          {/* Section 4: Browser Management */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="manage-heading"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 id="manage-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Managing & Disabling Cookies
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  You retain complete authority over your browser storage settings
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                You can configure or block cookies at any time via your browser preferences. Please note that blocking essential authentication cookies may prevent you from logging in, accessing paid modules, or taking examination quizzes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="font-semibold block text-neutral-900 dark:text-neutral-100">Google Chrome</span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">Settings &gt; Privacy &gt; Cookies</span>
                </div>
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="font-semibold block text-neutral-900 dark:text-neutral-100">Mozilla Firefox</span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">Options &gt; Privacy &gt; Cookies</span>
                </div>
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="font-semibold block text-neutral-900 dark:text-neutral-100">Apple Safari</span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">Preferences &gt; Privacy</span>
                </div>
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="font-semibold block text-neutral-900 dark:text-neutral-100">Microsoft Edge</span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">Settings &gt; Site Permissions</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Support */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 sm:p-8 text-center shadow-xs"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-lg font-bold text-white mb-2">
              Questions Regarding Our Cookie Architecture?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-6 leading-relaxed">
              Contact our engineering team with inquiries regarding browser storage, tokens, or security headers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:team.softgamestudio@gmail.com?subject=Cookie%20Policy%20Inquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#00ACF0]" />
                <span>Contact Engineering Desk</span>
              </a>
              <Link
                to="/ContactUs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium border border-neutral-700 hover:bg-white/10 transition-colors"
              >
                <span>Support Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default CookiesPolicy;