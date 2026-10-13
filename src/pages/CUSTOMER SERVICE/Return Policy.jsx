// src/pages/CUSTOMER SERVICE/Return Policy.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  FileText,
  RotateCcw,
  BookOpen,
  AlertTriangle,
  Mail,
  ArrowRight,
  ShieldAlert,
  Info
} from "lucide-react";

const ReturnPolicy = () => {
  const shouldReduceMotion = useReducedMotion();

  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/ReturnPolicy#webpage",
          "url": "https://softgamestudios.web.app/ReturnPolicy",
          "name": "Return & Refund Policy | Soft Game Studio",
          "description": "Commercial policies governing digital asset delivery, course notes access, and non-refundable service terms at Soft Game Studio.",
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

  const pageTitle = "Return & Refund Policy | Soft Game Studio";
  const pageDescription = "Read the official Return and Refund Policy of Soft Game Studio regarding instant digital goods, educational notes, and final sale conditions.";
  const canonicalUrl = "https://softgamestudios.web.app/ReturnPolicy";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Return Policy, Refund Policy, Soft Game Studio, Digital Goods Policy, No Refund Terms, Educational Purchases" />
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
                Return & Refund Policy
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <RotateCcw className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Commercial Terms</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  Return & Refund Policy
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  Understand how Soft Game Studio handles electronic orders, immediate digital delivery, and non-refundable digital goods.
                </p>
              </div>

              <div className="shrink-0 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 text-xs">
                <span className="font-mono text-neutral-400 block uppercase tracking-wider text-[10px]">
                  Policy Record
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mt-0.5">
                  Last Updated: January 09, 2025
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px] mt-0.5">
                  Immediate Digital Provision
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
                <FileText className="w-5 h-5 text-[#00ACF0]" />
              </div>
              <h2 id="overview-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                1. Core Policy Overview
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Thank you for utilizing the educational tools and publications offered by <strong>Soft Game Studio</strong>.
              </p>
              <p>
                Because our commercial offerings consist predominantly of instantly delivered electronic content (including downloadable PDF notes, source code repositories, digital quiz exam keys, and online publications), <strong>all completed transactions are final</strong>. We do not provide cash refunds, credits, or return processing once access has been provisioned.
              </p>
            </div>
          </section>

          {/* Section 2: Definitions */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="definitions-heading"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 id="definitions-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                2. Interpretation & Definitions
              </h2>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <dt className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Company</dt>
                <dd className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs">
                  Refers to Soft Game Studio, an MSME-registered enterprise based in Fazilka, Punjab, India.
                </dd>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <dt className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Digital Goods</dt>
                <dd className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs">
                  Refers to electronic manuals, PDFs, code archives, and assessments delivered via web download or immediate portal access.
                </dd>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <dt className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Order</dt>
                <dd className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs">
                  A formal user-initiated request to obtain premium digital items through our online payment pipeline.
                </dd>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <dt className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Service Platform</dt>
                <dd className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs">
                  The web application hosted at https://softgamestudios.web.app and related official subdomains.
                </dd>
              </div>
            </dl>
          </section>

          {/* Section 3: No-Return Notice */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="terms-heading"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
              <h2 id="terms-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                3. Final Sale Terms
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Once payment is confirmed and digital content access has been granted, the transaction is irreversible. Users are strongly encouraged to inspect free preview modules, syllabus outlines, and sample notes available across our library before initiating purchase.
              </p>

              <div className="p-4 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 text-neutral-800 dark:text-neutral-200">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-xs text-rose-900 dark:text-rose-200">
                      Binding Transaction Conditions
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 mt-1 text-xs text-rose-800 dark:text-rose-300">
                      <li>No refunds are issued under any standard circumstance once files are delivered.</li>
                      <li>Returns cannot be processed for intangible software licenses, downloaded PDFs, or completed quiz evaluations.</li>
                      <li>In the rare event of duplicate charges caused by gateway timeouts, contact our billing desk with proof of payment for resolution.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Contact & Resolution */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 sm:p-8 text-center shadow-xs"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-lg font-bold text-white mb-2">
              Have an Order Ingestion Problem?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-6 leading-relaxed">
              If you experienced a failed download, corrupted file extraction, or gateway deduction issue, our technical team will assist you promptly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:team.softgamestudio@gmail.com?subject=Billing%20or%20Order%20Assistance"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#00ACF0]" />
                <span>Contact Billing Support</span>
              </a>
              <Link
                to="/ContactUs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium border border-neutral-700 hover:bg-white/10 transition-colors"
              >
                <span>Support Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default ReturnPolicy;