// src/components/Suport US/SuportUS.jsx
import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Code,
  Video,
  Award,
  ArrowRight,
  Heart,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Mail,
  Share2,
  Users,
  Smartphone,
  ExternalLink
} from "lucide-react";
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";

import qrCode from "../../Assictes/QR.jpeg";
import Layout from "../layout/Layout";

const SupportUs = () => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const upiId = "liveshgarg@cnrb";
  const payeeName = "Livesh Garg";

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2400);
    } catch {
      // Fallback
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2400);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://softgamestudios.web.app/#organization",
          "name": "Soft Game Studio",
          "url": "https://softgamestudios.web.app",
          "email": "team.softgamestudios@gmail.com",
          "description": "Provider of free computer science education, software engineering notes, and technical tools."
        },
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/SuportUS#webpage",
          "url": "https://softgamestudios.web.app/SuportUS",
          "name": "Support Programming Education | Soft Game Studio",
          "description": "Support Soft Game Studio in building free, open programming resources, notes, and interactive tools for learners.",
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

  const pageTitle = "Support Our Mission | Soft Game Studio";
  const pageDescription = "Help Soft Game Studio provide free, high-quality computer science notes, source code, quizzes, and learning resources to students everywhere.";
  const canonicalUrl = "https://softgamestudios.web.app/SuportUS";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Support Soft Game Studio, Donate Programming Education, Open Source Learning, Coding Notes Sponsor, UPI Donation" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {structuredData}
        </script>
      </Helmet>

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-neutral-900">
        
        {/* ── Page Header / Hero ───────────────────────────────────── */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-5"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span>Community-Powered Mission</span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 max-w-3xl mx-auto leading-tight"
            >
              Empower Free Programming Education
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed"
            >
              At Soft Game Studio, we build open-access programming notes, production-ready source code, and developer tools for students and self-taught engineers everywhere. Your contributions keep our resources free and ad-free.
            </motion.p>
          </div>
        </header>

        {/* ── Core Support Grid ────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Why Support Matters & Impact ──────────── */}
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-6"
              aria-labelledby="impact-heading"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xs">
                <h2
                  id="impact-heading"
                  className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1"
                >
                  Where Your Support Goes
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                  Every rupee contributes directly to real educational infrastructure.
                </p>

                <ul className="space-y-4">
                  <motion.li
                    variants={itemVariants}
                    className="flex items-start gap-4 p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-[#00ACF0]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Structured Technical Notes
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Authoring concise, illustrated notes and cheat sheets for C, C++, Python, Java, and modern web architectures.
                      </p>
                    </div>
                  </motion.li>

                  <motion.li
                    variants={itemVariants}
                    className="flex items-start gap-4 p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                      <Code className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Verified Source Repositories
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Maintaining clean, tested, and runnable code repositories that students can clone, inspect, and learn from.
                      </p>
                    </div>
                  </motion.li>

                  <motion.li
                    variants={itemVariants}
                    className="flex items-start gap-4 p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Interactive Video & Live Sessions
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Producing code walkthroughs, live debugging sessions, and video guides for complex computer science topics.
                      </p>
                    </div>
                  </motion.li>

                  <motion.li
                    variants={itemVariants}
                    className="flex items-start gap-4 p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Skill Certification & Quizzes
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Funding server costs for our real-time quiz engine and certificate verification services.
                      </p>
                    </div>
                  </motion.li>
                </ul>
              </div>

              {/* Mission Statement Box */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-white/10 text-[#00ACF0] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Transparent & Free Platform
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      Soft Game Studio is built by developers for developers. We pledge to keep core educational materials accessible to everyone regardless of financial means.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Right Column: Instant UPI Contribution Card ───────── */}
            <motion.section
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5"
              aria-labelledby="donation-heading"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-7 shadow-sm">
                
                {/* Header */}
                <div className="text-center pb-5 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Direct UPI Transfer
                  </span>
                  <h2
                    id="donation-heading"
                    className="text-lg font-bold text-neutral-900 dark:text-neutral-100"
                  >
                    Quick Contribution
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Scan with any UPI app or copy the UPI ID below
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="my-6 flex flex-col items-center">
                  <div className="p-3 bg-white border border-neutral-200 rounded-xl shadow-xs">
                    <div className="w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                      <img
                        src={qrCode}
                        alt="Scan to donate via UPI to Livesh Garg at Soft Game Studio"
                        className="w-full h-full object-contain"
                        loading="eager"
                        fetchpriority="high"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-3 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5" />
                    Scan with GPay, PhonePe, Paytm, or BHIM
                  </p>
                </div>

                {/* Supported Apps Badges */}
                <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 mb-5">
                  <div className="flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <SiGooglepay className="text-lg text-emerald-600" title="Google Pay" />
                    <span>GPay</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <SiPhonepe className="text-lg text-indigo-500" title="PhonePe" />
                    <span>PhonePe</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <SiPaytm className="text-lg text-sky-500" title="Paytm" />
                    <span>Paytm</span>
                  </div>
                </div>

                {/* Payee Info & One-Click Copy */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                        Verified UPI ID
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-semibold text-neutral-900 dark:text-neutral-100 truncate block">
                        {upiId}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                      aria-label="Copy UPI ID to clipboard"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>Payee Name:</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {payeeName} &middot; Soft Game Studio
                    </span>
                  </div>

                  {/* Direct Mobile UPI Link Button */}
                  <a
                    href={`upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=INR`}
                    className="w-full inline-flex sm:hidden items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    <Smartphone className="w-4 h-4" />
                    Open in UPI App
                  </a>
                </div>

                {/* Sponsorship Contact link */}
                <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 text-center">
                  <a
                    href="mailto:team.softgamestudios@gmail.com?subject=Sponsorship%20or%20Educational%20Support"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#00ACF0]" />
                    <span>Inquire about corporate sponsorship</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </motion.section>

          </div>

          {/* ── Additional Ways to Support Section ──────────────────── */}
          <section
            className="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800"
            aria-labelledby="other-ways-heading"
          >
            <div className="text-center mb-10">
              <h2
                id="other-ways-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
              >
                Other Ways to Help Our Community
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-lg mx-auto">
                Financial support is only one avenue. You can make an immense difference through collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center shadow-xs">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-5 h-5 text-[#00ACF0]" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Share Resources
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Tell your classmates, study groups, and developer peers about our free programming notes and interactive e-books.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center shadow-xs">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mx-auto mb-4">
                  <Code className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Contribute Code
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Submit bug fixes, code examples, documentation enhancements, or test suites to our open repositories.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center shadow-xs">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  Volunteer & Mentor
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Join our community forum to answer questions, guide beginners through challenging concepts, and review projects.
                </p>
              </div>

            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default SupportUs;
