// src/pages/CopyrightPage/CopyrightPage.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  Building2,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  Info,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  ArrowRight
} from "lucide-react";

const CopyrightPage = () => {
  const [copiedUdyam, setCopiedUdyam] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const udyamNumber = "UDYAM-PB-06-0032977";

  const handleCopyUdyam = async () => {
    try {
      await navigator.clipboard.writeText(udyamNumber);
      setCopiedUdyam(true);
      setTimeout(() => setCopiedUdyam(false), 2200);
    } catch {
      // Fallback
    }
  };

  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "GovernmentPermit",
          "@id": `https://softgamestudios.web.app/CopyrightPage#registration`,
          "name": "MSME Udyam Registration",
          "identifier": udyamNumber,
          "validIn": {
            "@type": "Country",
            "name": "India"
          },
          "issuedBy": {
            "@type": "GovernmentOrganization",
            "name": "Ministry of Micro, Small and Medium Enterprises, Government of India"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://softgamestudios.web.app/#organization",
          "name": "Soft Game Studio",
          "url": "https://softgamestudios.web.app",
          "email": "team.softgamestudio@gmail.com",
          "telephone": "+91-1634358414",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Flat No. 574, St. No. 5, Nai Abadi",
            "addressLocality": "Abohar",
            "addressRegion": "Punjab",
            "postalCode": "152116",
            "addressCountry": "IN"
          }
        },
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/CopyrightPage#webpage",
          "url": "https://softgamestudios.web.app/CopyrightPage",
          "name": "Copyright & Legal Information | Soft Game Studio",
          "description": "Official business registration details, intellectual property policies, and legal certifications for Soft Game Studio.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://softgamestudios.web.app/#website",
            "name": "Soft Game Studio",
            "url": "https://softgamestudios.web.app"
          }
        }
      ]
    });
  }, [udyamNumber]);

  const pageTitle = "Copyright & Legal Information | Soft Game Studio";
  const pageDescription = "Explore the verified Udyam registration, corporate identity, copyright policies, and intellectual property terms of Soft Game Studio.";
  const canonicalUrl = "https://softgamestudios.web.app/CopyrightPage";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Soft Game Studio, Copyright, Udyam Registration, UDYAM-PB-06-0032977, MSME India, Software Company Legal, Intellectual Property Rights" />
        <meta name="author" content="Soft Game Studio" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        {/* Twitter Card */}
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
        
        {/* ── Page Header ───────────────────────────────────────────── */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              <Link to="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                Copyright & Legal Information
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Official Corporate Documentation</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  Copyright & Corporate Identity
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  Verified enterprise registration, National Industry Classifications (NIC), statutory intellectual property rights, and commercial licensing guidelines for Soft Game Studio.
                </p>
              </div>

              {/* Verified Emblem */}
              <div className="shrink-0 flex items-center gap-3.5 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 shadow-xs">
                <div className="w-12 h-12 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center p-2 shrink-0">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
                    alt="Soft Game Studio official corporate insignia"
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                    Soft Game Studio
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Reg. Micro Enterprise
                  </p>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* ── Main Content Container ───────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">

          {/* Section 1: MSME Udyam Registration ───────────────────── */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="udyam-heading"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#00ACF0]" />
                </div>
                <div>
                  <h2 id="udyam-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    MSME Udyam Registration Details
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Ministry of Micro, Small and Medium Enterprises, Government of India
                  </p>
                </div>
              </div>

              {/* 1-Click Copy Number */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200">
                  {udyamNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUdyam}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  aria-label="Copy Udyam Registration Number"
                >
                  {copiedUdyam ? (
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Business Overview */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                  Enterprise Classification
                </h3>
                <dl className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
                    <dt className="text-neutral-500 dark:text-neutral-400">Enterprise Name</dt>
                    <dd className="font-semibold text-neutral-900 dark:text-neutral-100">Soft Game Studio</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
                    <dt className="text-neutral-500 dark:text-neutral-400">Enterprise Category</dt>
                    <dd className="font-semibold text-neutral-900 dark:text-neutral-100">Micro Enterprise (2024-25)</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
                    <dt className="text-neutral-500 dark:text-neutral-400">Primary Nature</dt>
                    <dd className="font-semibold text-neutral-900 dark:text-neutral-100">Services</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
                    <dt className="text-neutral-500 dark:text-neutral-400">Social Category</dt>
                    <dd className="font-semibold text-neutral-900 dark:text-neutral-100">General</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
                    <dt className="text-neutral-500 dark:text-neutral-400">Date of Incorporation</dt>
                    <dd className="font-mono text-neutral-900 dark:text-neutral-100">01/01/2025</dd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-neutral-500 dark:text-neutral-400">Date of Registration</dt>
                    <dd className="font-mono text-neutral-900 dark:text-neutral-100">21/01/2025</dd>
                  </div>
                </dl>
              </div>

              {/* Registered Office & Contact */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                  Registered Office & Contact
                </h3>
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                    <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">Official Office Address</p>
                      <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 text-xs leading-relaxed">
                        Flat No. 574, Soft Game Studio, St. No. 5, Nai Abadi, Abohar, Fazilka, Punjab, 152116, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                    <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Official Contact</p>
                      <a href="tel:+911634358414" className="font-mono font-medium text-neutral-900 dark:text-neutral-100 hover:underline">
                        +91 1634358414
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                    <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Direct Inquiries</p>
                      <a href="mailto:team.softgamestudio@gmail.com" className="font-mono font-medium text-neutral-900 dark:text-neutral-100 hover:underline truncate block">
                        team.softgamestudio@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: National Industry Classification (NIC) ─────── */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="nic-heading"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h2 id="nic-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  National Industry Classification (NIC Codes)
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Registered operating domains under official Government of India categories
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                  NIC 62011 &middot; Primary
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Computer Programming & Software Development
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Design, maintenance, and distribution of custom applications, game logic, and technical systems.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                  NIC 62012 &middot; Primary
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Web-Page Designing & User Interface Architecture
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Design, frontend layout, and optimization of client and corporate web applications.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                  NIC 62099 &middot; Primary
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Other Information Technology & Computer Service Activities
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Technical infrastructure deployment, system debugging, and algorithmic consulting.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                  NIC 63112 &middot; Secondary
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Web Hosting & Cloud Data Infrastructure
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Cloud hosting, distribution pipelines, and web asset storage services.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                  NIC 85499 &middot; Secondary
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Other Educational Services
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Computer programming education, technical notes, developer quizzes, and coding assessments.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                  NIC 58142 &middot; Secondary
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Digital Content Creation & Periodical Publishing
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Publishing e-books, online learning manuals, and digital technical articles.
                </p>
              </div>

            </div>
          </section>

          {/* Section 3: Intellectual Property & Ownership ───────────── */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="ip-heading"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 id="ip-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Copyright Notice & Intellectual Property Rights
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  &copy; {new Date().getFullYear()} Soft Game Studio. All rights reserved.
                </p>
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 text-neutral-800 dark:text-neutral-200">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                      Proprietary Content Notice
                    </h3>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                      All content, trademarks, service marks, logo designs, graphics, audio, user interfaces, written documentation, software algorithms, and digital assets published on this domain are the exclusive intellectual property of Soft Game Studio unless otherwise designated. Unauthorized reproduction, scraping, redistribution, or modification without prior written authorization is strictly prohibited.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Statutory Legal Protections
                </h3>
                <p>
                  By accessing or utilizing our digital services, users agree to respect all proprietary rights enforceable under applicable domestic and international laws, including:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <li><strong>The Copyright Act, 1957 (India)</strong> and amendments thereto.</li>
                  <li><strong>The Information Technology Act, 2000 (India)</strong> and its electronic record rules.</li>
                  <li><strong>Digital Millennium Copyright Act (DMCA)</strong> (17 U.S.C. &sect; 512) for international copyright enforcement.</li>
                  <li>Berne Convention for the Protection of Literary and Artistic Works.</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#00ACF0] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                      Licensing & Permission Inquiries
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      To seek permission for citing, republishing, or commercially utilizing any materials produced by Soft Game Studio, please transmit a formal request stating the exact context and distribution scope to our legal desk at{" "}
                      <a 
                        href="mailto:team.softgamestudio@gmail.com?subject=Licensing%20and%20Copyright%20Permission%20Inquiry"
                        className="font-medium text-neutral-900 dark:text-neutral-100 underline hover:text-[#00ACF0] transition-colors"
                      >
                        team.softgamestudio@gmail.com
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Quick Navigation to Legal & Policies ───────── */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="resources-heading"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 id="resources-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Legal Directory & Company Policies
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Review complete transparency and governance documents for our platform
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              
              <Link
                to="/PrivacyPolicy"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#00ACF0] transition-colors">
                    Privacy Policy
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                  Data retention, cookies, and personal info handling.
                </p>
              </Link>

              <Link
                to="/TermsAndConditions"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#00ACF0] transition-colors">
                    Terms & Conditions
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                  Platform rules, acceptable usage, and liability limits.
                </p>
              </Link>

              <Link
                to="/ReturnPolicy"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#00ACF0] transition-colors">
                    Return & Refund Policy
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                  Dispute resolution, refunds, and digital transactions.
                </p>
              </Link>

              <Link
                to="/About-SGS"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#00ACF0] transition-colors">
                    About Soft Game Studio
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                  Company history, mission, and leadership overview.
                </p>
              </Link>

              <Link
                to="/ContactUs"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#00ACF0] transition-colors">
                    Contact Us
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                  Customer care desk, support tickets, and direct lines.
                </p>
              </Link>

              <Link
                to="/OurMembers"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#00ACF0] transition-colors">
                    Our Team Members
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                  Engineers, educators, and development staff directory.
                </p>
              </Link>

            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default CopyrightPage;