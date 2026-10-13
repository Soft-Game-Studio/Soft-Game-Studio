// src/pages/CUSTOMER SERVICE/AboutSGSExam.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  ShieldAlert,
  Lock,
  Eye,
  RefreshCw,
  Zap,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  Server,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const AboutExam = () => {
  const shouldReduceMotion = useReducedMotion();

  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/About-Exam#webpage",
          "url": "https://softgamestudios.web.app/About-Exam",
          "name": "About SGS Exam Platform | Soft Game Studio",
          "description": "Secure, scalable, and proctored examination platform designed by Soft Game Studio for academic testing and developer certifications.",
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

  const pageTitle = "About Exam Platform | Soft Game Studio";
  const pageDescription = "Learn about the SGS Exam Platform: secure, scalable online assessment system with browser lockdown, tab monitoring, and automated grading.";
  const canonicalUrl = "https://softgamestudios.web.app/About-Exam";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="SGS Exam Platform, Online Exams, Proctored Assessment, Secure Examination, Anti Cheating Testing, Developer Quiz Engine" />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

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
                SGS Exam Platform
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Proctored Testing Engine</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  SGS Examination & Proctoring Platform
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  How our assessment platform secures student testing with browser lockdown protocols, tab-switching detection, automated question randomization, and instant grading.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  to="/About-Exam"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Take An Assessment</span>
                </Link>
              </div>
            </div>

          </div>
        </header>

        {/* ── Content Sections ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">

          {/* Section 1: Overview & Key Features */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="overview-heading"
          >
            <h2 id="overview-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Engineered for Academic Rigor & Integrity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p>
                  The SGS Exam Platform is a custom-built assessment architecture tailored for academic evaluations, coding quizzes, and developer certification exams.
                </p>
                <p>
                  By deploying client-side activity listeners, full-screen lockdown enforcement, and cloud-synchronized question bank randomization, the platform eliminates exam evasion and preserves fairness for every student.
                </p>
                <p>
                  Scores are calculated server-side immediately upon submission, preventing client-side script tampering and enabling automated digital certificate issuance.
                </p>
              </div>

              <div className="md:col-span-5 p-5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3 text-xs">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  System Capabilities
                </h3>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Active tab switching and window blur detection</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Real-time countdown sync with grace period recovery</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Randomized question and answer order per candidate</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Instant verifiable certificate generation</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: How It Operates (6 Steps) */}
          <section aria-labelledby="steps-heading">
            <div className="text-center mb-10">
              <h2 id="steps-heading" className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Examination Pipeline Architecture
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-lg mx-auto">
                Step-by-step security enforcement throughout the assessment lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-[#00ACF0]" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider">Step 01</span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Secure Authentication
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Cryptographically verified session tokens ensure only registered and eligible students can start the exam.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5 text-indigo-500" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider">Step 02</span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Proctoring Monitors
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Real-time event logging flags multiple monitor configurations, secondary window focus, and external clipboard copy attempts.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider">Step 03</span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Anti-Cheating Safeguards
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Tab-switch warnings trigger strike penalties that automatically terminate the session upon repeated infractions.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <RefreshCw className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider">Step 04</span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Randomized Question Banks
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Questions and option sequences are dynamically scrambled for each candidate to prevent peer collaboration.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider">Step 05</span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Automated Grading
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Submissions are graded instantly against authoritative answer matrices, delivering immediate score metrics.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-sky-500" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider">Step 06</span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Verifiable Certification
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Passing candidates receive a tamper-resistant digital certificate with a unique verification code recognized on portfolios.
                </p>
              </div>

            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default AboutExam;