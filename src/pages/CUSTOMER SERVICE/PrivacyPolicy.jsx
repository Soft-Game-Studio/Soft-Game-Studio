// src/pages/CUSTOMER SERVICE/PrivacyPolicy.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import {
  Shield,
  Search,
  Lock,
  Target,
  Activity,
  Megaphone,
  Mail,
  ArrowRight,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Server
} from 'lucide-react';

const PrivacyPolicy = () => {
  const shouldReduceMotion = useReducedMotion();

  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/PrivacyPolicy#webpage",
          "url": "https://softgamestudios.web.app/PrivacyPolicy",
          "name": "Privacy Policy | Soft Game Studio",
          "description": "Understand how Soft Game Studio protects user personal information, complies with privacy standards, and handles digital data.",
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

  const pageTitle = "Privacy Policy | Soft Game Studio";
  const pageDescription = "Learn how Soft Game Studio collects, uses, and safeguards your personal data, ensures data privacy, and enforces security protocols across our platform.";
  const canonicalUrl = "https://softgamestudios.web.app/PrivacyPolicy";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Privacy Policy, Data Protection, Soft Game Studio, User Privacy, Information Security, Digital Learning Privacy" />
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
                Privacy Policy
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <Shield className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Data Protection & Privacy Policy</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  Privacy Policy
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  How Soft Game Studio collects, utilizes, safeguards, and handles your personal information across all digital services and learning environments.
                </p>
              </div>

              <div className="shrink-0 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 text-xs">
                <span className="font-mono text-neutral-400 block uppercase tracking-wider text-[10px]">
                  Document Status
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mt-0.5">
                  Effective: June 7, 2025
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px] mt-0.5">
                  Governed by Indian IT Act, 2000
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* ── Content Sections ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">

          {/* Section 1: Introduction */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="intro-heading"
          >
            <h2 id="intro-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Our Commitment to Your Privacy
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                At Soft Game Studio, we consider user privacy and confidential data handling fundamental principles of our engineering culture. This policy details our precise data handling mechanisms when you browse our website, download study notes, take coding exams, purchase materials, or communicate with our staff.
              </p>
              <p>
                Every segment of this document outlines actual operational practices. We do not sell personal data to marketing aggregators or unauthorized third parties under any circumstances.
              </p>
              <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                By accessing our platform or registering an account, you acknowledge and agree to the procedures outlined in this policy.
              </p>
            </div>
          </section>

          {/* Section 2: Core Privacy Principles */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="principles-heading"
          >
            <h2 id="principles-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Core Principles of Data Governance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-3.5">
                  <Search className="w-5 h-5 text-[#00ACF0]" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Absolute Transparency
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We explicitly declare what information is requested, why it is necessary, and how it is retained.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-3.5">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Minimal Data Collection
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We only request information directly relevant to authentication, examination integrity, or account services.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-3.5">
                  <Lock className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Security-First Storage
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Industry-standard TLS encryption in transit and parameterized database controls safeguard user records.
                </p>
              </div>

            </div>
          </section>

          {/* Section 3: Information We Collect */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="collection-heading"
          >
            <h2 id="collection-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Information We Collect
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                  Directly Provided Data
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                  When you register, submit an inquiry, or complete a transaction, we collect:
                </p>
                <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Full Legal or Chosen Name</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Verified Email Address</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Phone Number (for SMS notifications or order status)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Billing Address (if purchasing commercial software/books)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Academic Institution or College (optional for student verification)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                  System & Diagnostic Data
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                  To ensure system performance, prevent duplicate submissions, and maintain quiz integrity:
                </p>
                <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ACF0] shrink-0" />
                    <span>Device Specifications (Operating System, Browser Version)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ACF0] shrink-0" />
                    <span>IP Address and Geo-location region</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ACF0] shrink-0" />
                    <span>Navigation timestamps and error logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ACF0] shrink-0" />
                    <span>Quiz scores and certificate completion stamps</span>
                  </li>
                </ul>
              </div>

            </div>
          </section>

          {/* Section 4: How We Use Data */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="usage-heading"
          >
            <h2 id="usage-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Purposes of Data Processing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex items-start gap-3.5 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30">
                <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Service Delivery & Identity
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    Authenticating accounts, delivering purchased digital modules, and managing quiz certifications.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30">
                <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-[#00ACF0]" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Platform Reliability & Diagnostics
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    Analyzing load latency, monitoring API throughput, and preventing DDoS attacks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30">
                <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Direct Communications
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    Replying to customer service inquiries, sending certificate verifications, and security alerts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30">
                <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Security & Fraud Prevention
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    Enforcing examination anti-cheat standards and detecting unauthorized account takeovers.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Section 5: Contact Desk */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 sm:p-8 text-center shadow-xs"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-lg font-bold text-white mb-2">
              Questions Regarding Your Privacy?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-6 leading-relaxed">
              If you wish to review, update, or request the deletion of your personal records from Soft Game Studio, reach out to our privacy officer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:team.softgamestudio@gmail.com?subject=Privacy%20Data%20Request"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#00ACF0]" />
                <span>Email Privacy Officer</span>
              </a>
              <Link
                to="/ContactUs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium border border-neutral-700 hover:bg-white/10 transition-colors"
              >
                <span>Support Contact Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default PrivacyPolicy;