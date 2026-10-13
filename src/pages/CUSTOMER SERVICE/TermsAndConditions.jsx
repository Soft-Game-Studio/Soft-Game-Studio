// src/pages/CUSTOMER SERVICE/TermsAndConditions.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  FileText,
  UserCheck,
  ShoppingCart,
  ShieldAlert,
  Lightbulb,
  Sparkles,
  Scale,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const TermsAndConditions = () => {
  const shouldReduceMotion = useReducedMotion();

  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/TermsAndConditions#webpage",
          "url": "https://softgamestudios.web.app/TermsAndConditions",
          "name": "Terms and Conditions | Soft Game Studio",
          "description": "Rules, legal terms, and operational guidelines governing user access and commercial services at Soft Game Studio.",
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

  const pageTitle = "Terms and Conditions | Soft Game Studio";
  const pageDescription = "Review the official Terms and Conditions governing account registration, content ownership, purchases, and user responsibilities on Soft Game Studio.";
  const canonicalUrl = "https://softgamestudios.web.app/TermsAndConditions";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Terms and Conditions, User Agreement, Soft Game Studio Legal, Service Rules, Academic Terms, Digital Purchases" />
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
                Terms and Conditions
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <Scale className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Legal User Agreement</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  Terms & Conditions
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  These terms govern your access to and use of all services, digital publications, online quizzes, and software platforms operated by Soft Game Studio.
                </p>
              </div>

              <div className="shrink-0 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 text-xs">
                <span className="font-mono text-neutral-400 block uppercase tracking-wider text-[10px]">
                  Document Version
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mt-0.5">
                  Effective: January 10, 2025
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px] mt-0.5">
                  Jurisdiction: Fazilka, Punjab (India)
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* ── Content Sections ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">

          {/* Section 1: Agreement to Terms */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="agreement-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#00ACF0]" />
              </div>
              <h2 id="agreement-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                1. Agreement to Terms
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Welcome to <strong>Soft Game Studio</strong>. By browsing, registering on, or accessing our web application (
                <a
                  href="https://softgamestudios.web.app"
                  className="font-medium text-neutral-900 dark:text-neutral-100 underline hover:text-[#00ACF0] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://softgamestudios.web.app
                </a>
                ), you enter into a legally binding agreement to comply with and be bound by these Terms & Conditions.
              </p>
              <p>
                If you disagree with any portion of these provisions, you must immediately terminate access to our web applications and digital assets.
              </p>
            </div>
          </section>

          {/* Section 2: Account Creation & Security */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="account-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 id="account-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                2. User Account Creation & Security
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                To utilize designated portal features (including certificate generation, examination submissions, and notes downloads), you may be required to register an account. During registration, you agree to provide truthful, current, and complete contact details (name, email address, and phone number).
              </p>
              <p>
                You are solely responsible for safeguarding your authentication credentials. Any actions executed through your authenticated session remain your legal responsibility. Soft Game Studio must be notified promptly of any suspected security breaches.
              </p>
            </div>
          </section>

          {/* Section 3: Educational Services & Digital Purchases */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="services-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 id="services-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                3. Services & Digital Purchases
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Our portal offers both free open-access materials and premium courses, technical notes, and verification services. Premium items are provided on a one-time transaction basis.
              </p>
              <p>
                By initiating any payment, you affirm that the provided payment information is accurate and authorized. All prices are listed in Indian Rupees (INR) unless expressly stated otherwise.
              </p>
            </div>
          </section>

          {/* Section 4: Proprietary Content & IP */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="ip-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
              </div>
              <h2 id="ip-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                4. Content Ownership & Copyright
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                All materials hosted on our domains—including course syllabi, PDF notes, quiz questionnaires, software architecture guides, company marks, and visual graphics—remain the exclusive property of Soft Game Studio.
              </p>
              <p>
                Reproduction, commercial resale, public re-hosting, or automated data harvesting without prior written permission is prohibited and subject to legal prosecution under The Copyright Act, 1957.
              </p>
            </div>
          </section>

          {/* Section 5: User Feedback & Suggestions */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="feedback-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 id="feedback-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                5. Community Feedback & Submissions
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                When you submit suggestions, bugs, or feature improvements to our team, you grant Soft Game Studio a non-exclusive, royalty-free, perpetual license to implement and distribute such feedback without financial compensation or attribution obligation.
              </p>
            </div>
          </section>

          {/* Section 6: User Conduct & Termination */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="conduct-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <h2 id="conduct-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                6. Acceptable Use & Account Termination
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Users agree never to engage in automated vulnerability scanning, unauthorized credential exploitation, exam proctoring evasion, or distribution of malicious scripts.
              </p>
              <p>
                Soft Game Studio reserves the right to suspend or permanently terminate user accounts found in violation of these standards without prior notice.
              </p>
            </div>
          </section>

          {/* Section 7: Inquiries Desk */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 sm:p-8 text-center shadow-xs"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-lg font-bold text-white mb-2">
              Questions Regarding Our Legal Terms?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-6 leading-relaxed">
              For legal clarifications or corporate partnership inquiries, reach out to our legal desk directly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:team.softgamestudio@gmail.com?subject=Terms%20and%20Conditions%20Inquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#00ACF0]" />
                <span>Email Legal Team</span>
              </a>
              <Link
                to="/ContactUs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium border border-neutral-700 hover:bg-white/10 transition-colors"
              >
                <span>Contact Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default TermsAndConditions;