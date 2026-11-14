// src/pages/CUSTOMER SERVICE/TermsAndConditions.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import {
  FileText,
  UserCheck,
  ShoppingCart,
  ShieldAlert,
  Lightbulb,
  Scale,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Activity,
  Award,
  Users,
  Globe,
  Lock,
  Server,
  Clock,
  ChevronRight
} from 'lucide-react';

const TermsAndConditions = () => {
  const shouldReduceMotion = useReducedMotion();

  const structuredData = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://softgamestudios.web.app/TermsAndConditions#webpage',
          'url': 'https://softgamestudios.web.app/TermsAndConditions',
          'name': 'Terms and Conditions | Soft Game Studio',
          'description':
            'Official Terms and Conditions governing user accounts, developer portfolios, skill competition leaderboards, device telemetry proctoring, rate limiting, and commercial digital purchases at Soft Game Studio.',
          'isPartOf': {
            '@type': 'WebSite',
            '@id': 'https://softgamestudios.web.app/#website',
            'name': 'Soft Game Studio',
            'url': 'https://softgamestudios.web.app'
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://softgamestudios.web.app/TermsAndConditions#breadcrumb',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://softgamestudios.web.app/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Terms and Conditions',
              'item': 'https://softgamestudios.web.app/TermsAndConditions'
            }
          ]
        }
      ]
    });
  }, []);

  const pageTitle = 'Terms & Conditions of Service | Soft Game Studio';
  const pageDescription =
    'Official user covenants, device telemetry tracking rules, anti-cheat proctoring, API rate limiting, developer portfolios, skill leaderboards, and dispute terms for Soft Game Studio.';
  const canonicalUrl = 'https://softgamestudios.web.app/TermsAndConditions';

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="Terms and Conditions, User Agreement, Soft Game Studio Legal, Rate Limiting, Anti Cheat Proctoring, Developer Portfolios, DPDP Act 2023, Skill Leaderboards"
        />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />

        {/* Structured Data */}
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-neutral-900">
        {/* ── Document Header ────────────────────────────────────────── */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6"
            >
              <Link to="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">Terms and Conditions</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <Scale className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Statutory User Agreement</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  Terms &amp; Conditions of Service
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  These terms govern your access to the educational software, digital examination subsystems, developer
                  portfolios, competition leaderboards, and commercial software services operated by Soft Game Studio.
                </p>
              </div>

              <div className="shrink-0 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 text-xs space-y-1">
                <span className="font-mono text-neutral-400 block uppercase tracking-wider text-[10px]">
                  Document Version
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                  Edition 2026/2027 (DPDP Aligned)
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                  Governed by Indian Law &amp; IT Act, 2000
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                  Jurisdiction: Abohar / Fazilka, Punjab (India)
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content Body ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
          {/* Section 1: Agreement to Terms & Statutory Framework */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="agreement-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 id="agreement-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                1. Agreement to Terms &amp; Statutory Authority
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Welcome to <strong>Soft Game Studio</strong>. By accessing, browsing, creating an account on, or
                interacting with our web applications (including{' '}
                <a
                  href="https://softgamestudios.web.app"
                  className="font-medium text-neutral-900 dark:text-neutral-100 underline hover:text-[#00ACF0] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://softgamestudios.web.app
                </a>{' '}
                and related domains), you enter into a legally binding contract governed by the laws of the Republic of
                India.
              </p>
              <p>
                This agreement operates concurrently with our{' '}
                <Link to="/PrivacyPolicy" className="text-[#00ACF0] font-semibold hover:underline">
                  Privacy Policy &amp; Data Governance Charter
                </Link>
                , the Digital Personal Data Protection (DPDP) Act, 2023, the DPDP Rules, 2025, the Information Technology
                Act, 2000, and the Consumer Protection (E-Commerce) Rules, 2020.
              </p>
              <p>
                If you do not agree with all covenants, telemetry conditions, and acceptable use restrictions set forth
                herein, you are strictly prohibited from using our services and must immediately terminate access.
              </p>
            </div>
          </section>

          {/* Section 2: User Eligibility, Account Creation & Age Verification (DPDP Section 9) */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="eligibility-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 id="eligibility-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                2. User Eligibility, Identity Verification &amp; Minors Policy
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                To utilize designated portal features (including academic examinations, digital certificate downloads,
                developer portfolio publication, and notes access), you must establish an authenticated account.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>
                  <strong>Truthful Identification</strong>: You warrant that all information provided during registration
                  (first name, last name, email address, mobile number, and academic institute) is accurate, current, and
                  belongs to you. Impersonation of any individual or entity is a direct violation of Section 15 of the
                  DPDP Act and is subject to statutory penalties and immediate account termination.
                </li>
                <li>
                  <strong>Minors and Parental Consent (Section 9)</strong>: In strict compliance with Section 9 of the DPDP
                  Act 2023, individuals who have not attained eighteen (18) years of age require Verifiable Parental
                  Consent (VPC) from a lawful parent or legal guardian prior to registration. Self-declarations by minors
                  are legally void. Minor accounts are strictly insulated from behavioral advertising, tracking SDKs, and
                  commercial profiling.
                </li>
                <li>
                  <strong>Credential Confidentiality</strong>: You are solely responsible for maintaining the
                  confidentiality of your login credentials. Any activity executed through your authenticated session
                  shall be legally imputed to you.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Device Telemetry & Examination Proctoring Covenants (Google/Facebook Model) */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="proctoring-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 id="proctoring-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                3. Device Telemetry, Machine Data &amp; Examination Proctoring Covenants
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                By enrolling in or attempting any certification exam, coding contest, or quiz module on Soft Game Studio,
                you explicitly acknowledge and consent to client-side device monitoring and telemetry capture, similar to
                enterprise technology standards implemented by Google, Meta, and educational proctoring authorities.
              </p>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                  Proctoring Covenants &amp; Academic Integrity Rules:
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <li>
                    <strong>Full-Screen Enforcement</strong>: Candidates must maintain full-screen interface mode.
                    Dismissing or resizing the window generates automated violation flags in your examination audit trail.
                  </li>
                  <li>
                    <strong>Window Focus &amp; Tab-Switching</strong>: The system records timestamps and counts of all
                    window-blur events, tab departures, secondary application launches, and multi-monitor connections.
                  </li>
                  <li>
                    <strong>Hardware &amp; Input Telemetry</strong>: Device identifiers, screen resolution, GPU renderer
                    details, mouse trajectory consistency, and non-standard keyboard combinations (e.g. Developer Tools,
                    inspection shortcuts, copy/paste operations) are monitored in real time.
                  </li>
                  <li>
                    <strong>Disqualification Authority</strong>: Any detection of automated assistance scripts, browser
                    extensions designed to bypass proctoring, unauthorized tab navigation, or external proxy connections
                    shall result in immediate exam voidance, certificate revocation, and permanent disqualification.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Multi-Tiered Rate Limiting & Abuse Prevention Controls */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="ratelimit-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <h2 id="ratelimit-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                4. Multi-Tiered Rate Limiting, Threat Mitigation &amp; Abuse Prevention
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                To safeguard the availability, confidentiality, and integrity of Soft Game Studio infrastructure in
                compliance with Section 8(5) of the DPDP Act, all users are subject to automated rate-limiting and threat
                mitigation protocols:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-[#00ACF0]" />
                    <span>API &amp; Request Thresholds</span>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Public endpoints are limited to a maximum of 60 requests per minute per IP address. Authentication,
                    password reset, and certificate query endpoints enforce strict burst caps of 5 attempts per minute.
                    Exceeding thresholds results in HTTP 429 status codes and progressive IP blockades.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Scraping &amp; Data Harvesting Ban</span>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Automated harvesting, web scraping, spidering, or sequential credential probing (including systematic
                    roll-number lookups on certificate directories) is strictly prohibited and treated as an unauthorized
                    intrusion under Section 43 &amp; 66 of the Information Technology Act.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Developer Portfolios, Skill Competitions & Public Leaderboards */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="portfolio-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h2 id="portfolio-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                5. Developer Portfolios, Skill Tracking &amp; Competitive Leaderboards
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Soft Game Studio features modular developer profiles, Google technology skill assessments, hackathon team
                portfolios, and competitive performance rankings:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>
                  <strong>Developer Portfolios &amp; User Content</strong>: Users retain full intellectual property
                  ownership of original software code, project write-ups, and portfolio repositories uploaded to the
                  platform. By designating a project or portfolio as &quot;Public&quot;, you grant Soft Game Studio a
                  worldwide, non-exclusive, royalty-free license to host, display, index, and showcase such content for
                  educational and verification purposes.
                </li>
                <li>
                  <strong>Competition Standing &amp; Leaderboards</strong>: Participation in studio hackathons, quizzes,
                  or coding challenges grants the Studio the right to publish your scores, earned skill badges, and
                  relative rankings on our public leaderboards. Users who wish to compete under a pseudonym may configure
                  their display preference within their Profile Settings.
                </li>
                <li>
                  <strong>Third-Party Social Links</strong>: When linking external profiles (GitHub, LinkedIn, Discord),
                  you affirm that you own or have lawful authority over those accounts and that linked repositories do not
                  contain malicious code, malware, or proprietary third-party intellectual property.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Commercial Digital Purchases & Refunds */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="purchases-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h2 id="purchases-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                6. Commercial Purchases, Digital Licensing &amp; Payments
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Soft Game Studio offers digital educational materials, programming courses, source code bundles, and
                verification products. All purchases are delivered on a single-user, non-exclusive, revocable, and
                non-transferable license basis.
              </p>
              <p>
                All fees are billed in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST).
                Due to the instantaneous digital fulfillment of software source code and study materials, purchases are
                non-refundable once download access has been provisioned, except where mandated by statutory consumer
                protection laws or in cases of duplicate billing.
              </p>
            </div>
          </section>

          {/* Section 7: Intellectual Property & Trademark Rights */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="ip-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
              </div>
              <h2 id="ip-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                7. Content Ownership &amp; Intellectual Property Protection
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                All proprietary platform assets, curriculum syllabi, examination question banks, game engine source
                modules, UI component libraries, studio marks, and branding hosted under our domains remain the exclusive
                intellectual property of Soft Game Studio, protected under The Copyright Act, 1957, and The Trade
                Marks Act, 1999.
              </p>
              <p>
                Unauthorized re-hosting, commercial resale, framing, public mirroring, or decompilation of our software
                is strictly prohibited and shall be met with immediate legal prosecution and civil claim for statutory
                damages.
              </p>
            </div>
          </section>

          {/* Section 8: Termination & Account Suspension */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="termination-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h2 id="termination-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                8. Account Termination &amp; Suspension Protocols
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Soft Game Studio reserves the unilateral right to immediately suspend, restrict, or permanently terminate
                any user account without prior liability where:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <li>The user violates any provision of these Terms or the DPDP Privacy Charter.</li>
                <li>The user engages in proctoring evasion, exam fraud, or automated script injection.</li>
                <li>The user triggers repeated rate-limiting violations or initiates denial-of-service attempts.</li>
                <li>Required by statutory directive, police investigation, or competent court order under Indian law.</li>
              </ul>
            </div>
          </section>

          {/* Section 9: Dispute Resolution, Court Jurisdiction & Grievance SLA */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="dispute-heading"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <h2 id="dispute-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                9. Dispute Resolution, Exclusive Jurisdiction &amp; Grievance SLA
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                In compliance with Rule 14(3) of the DPDP Rules 2025, any user concern, data rights request, or contractual
                dispute must first be submitted to our designated Grievance Officer:
              </p>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-xs space-y-1.5">
                <div>
                  <span className="text-neutral-400">Designation:</span>{' '}
                  <strong className="text-neutral-900 dark:text-neutral-100">Grievance &amp; Compliance Officer</strong>
                </div>
                <div>
                  <span className="text-neutral-400">Company:</span> Soft Game Studio
                </div>
                <div>
                  <span className="text-neutral-400">Official Channel:</span>{' '}
                  <a
                    href="mailto:team.softgamestudio@gmail.com?subject=Legal%20Grievance%20Notice"
                    className="font-mono text-[#00ACF0] hover:underline"
                  >
                    team.softgamestudio@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-neutral-400">Resolution Window:</span>{' '}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Mandatory 90 calendar days maximum
                  </span>
                </div>
              </div>

              <p>
                <strong>Exclusive Court Jurisdiction:</strong> If a dispute cannot be amicably resolved through internal
                grievance mechanisms within the statutory 90-day window, both parties agree to submit to the exclusive
                jurisdiction of the competent courts situated in <strong>Abohar / Fazilka, Punjab, India</strong>,
                waiving any objection to venue or convenience of forum.
              </p>
            </div>
          </section>

          {/* Section 10: Legal Inquiry Desk */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 sm:p-8 text-center shadow-xs"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-lg font-bold text-white mb-2">
              Questions Regarding Our Legal Terms?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-6 leading-relaxed">
              For corporate licensing, academic partnerships, or legal inquiries, connect directly with our legal desk.
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
                <span>Support Contact Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/PrivacyPolicy"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium border border-neutral-700 hover:bg-white/10 transition-colors"
              >
                <span>Review Privacy Policy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default TermsAndConditions;
