// src/pages/CUSTOMER SERVICE/PrivacyPolicy.jsx
import React, { useState, useMemo } from 'react';
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
  Server,
  Cpu,
  Smartphone,
  Globe,
  Users,
  Award,
  AlertCircle,
  Database,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

const PrivacyPolicy = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState('all');

  const structuredData = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://softgamestudios.web.app/PrivacyPolicy#webpage',
          'url': 'https://softgamestudios.web.app/PrivacyPolicy',
          'name': 'Privacy Policy & Data Governance Charter | Soft Game Studio',
          'description':
            'Comprehensive privacy policy and statutory data protection charter of Soft Game Studio under the Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025.',
          'isPartOf': {
            '@type': 'WebSite',
            '@id': 'https://softgamestudios.web.app/#website',
            'name': 'Soft Game Studio',
            'url': 'https://softgamestudios.web.app'
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://softgamestudios.web.app/PrivacyPolicy#breadcrumb',
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
              'name': 'Privacy Policy',
              'item': 'https://softgamestudios.web.app/PrivacyPolicy'
            }
          ]
        }
      ]
    });
  }, []);

  const pageTitle = 'Privacy Policy & Data Governance Charter | Soft Game Studio';
  const pageDescription =
    'Statutory privacy disclosures, device telemetry tracking rules, data principal rights, rate-limiting safeguards, and DPDP Act 2023 compliance architecture for Soft Game Studio.';
  const canonicalUrl = 'https://softgamestudios.web.app/PrivacyPolicy';

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="Privacy Policy, DPDP Act 2023, DPDP Rules 2025, Data Protection, Soft Game Studio, Device Telemetry, CERT-In, Data Principal Rights"
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
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">Privacy Policy</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <Shield className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Statutory Compliance Charter</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  Privacy Policy & Data Governance
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  Official statutory disclosures under the Digital Personal Data Protection (DPDP) Act, 2023, the DPDP
                  Rules, 2025, and CERT-In Directions. This charter outlines our itemized data collection, device telemetry
                  practices, examination proctoring safeguards, and your enforceable statutory rights.
                </p>
              </div>

              <div className="shrink-0 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 text-xs space-y-1">
                <span className="font-mono text-neutral-400 block uppercase tracking-wider text-[10px]">
                  Statutory Edition
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                  DPDP Act 2023 & Rules 2025 Compliant
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                  Enforcement Timeline: Nov 2026 (CM) / May 13, 2027
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                  Fiduciary: Soft Game Studio
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content Body ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/30 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#00ACF0] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Notice & Language Mandate Notice (Section 5(3) & 6(3))
              </p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                In compliance with the DPDP Act 2023, you have the right to review this notice and access all consent
                management workflows in English or any of the 22 languages specified in the Eighth Schedule to the
                Constitution of India. To request a translated notice, contact our Data Protection Grievance Officer.
              </p>
            </div>
          </div>

          {/* Section 1: Data Fiduciary Identity & Legal Basis */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="fiduciary-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <BuildingIcon className="w-5 h-5" />
              </div>
              <h2 id="fiduciary-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                1. Data Fiduciary Identity & Statutory Scope
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                <strong>Soft Game Studio</strong> (referred to herein as &quot;Soft Game Studio&quot;, &quot;the
                Studio&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), having its principal operating address at
                House No. 574, Street No. 5, Nai Abadi, Abohar, Punjab 152116, India, operates as a{' '}
                <strong>Data Fiduciary</strong> under Section 2(i) of the Digital Personal Data Protection (DPDP) Act,
                2023.
              </p>
              <p>
                This policy governs digital personal data collected across our web applications, engineering portals,
                interactive learning engines, examination subsystems, hackathon portals, and administrative workspaces.
                We process personal data solely on two lawful grounds authorized by Indian law:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
                <li>
                  <strong>Valid, Affirmative Consent (Section 6)</strong>: Freely given, specific, informed,
                  unconditional, unambiguous, and signified through clear affirmative action.
                </li>
                <li>
                  <strong>Statutory Legitimate Uses (Section 7)</strong>: Specified purposes for which data was
                  voluntarily provided, compliance with judicial judgments, or legal obligation enforcement under Indian
                  statutes.
                </li>
              </ul>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <strong>Statutory Notice:</strong> Under Indian law, unlike European GDPR, there is no generic
                &quot;legitimate interest&quot; legal ground. Processing for model training, advertising, or secondary
                features requires explicit, affirmative consent.
              </p>
            </div>
          </section>

          {/* Section 2: Device Telemetry & Advanced Client Analytics (Google / Meta Model) */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="telemetry-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 id="telemetry-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                2. Device Telemetry & Client Machine Tracking (Enterprise Standard)
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Similar to standard enterprise platforms such as Google and Meta (Facebook), Soft Game Studio captures
                client device telemetry, hardware attributes, network routing metadata, and interaction telemetry. This
                data is strictly bound to service performance, examination security, and threat defense.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    <Smartphone className="w-4 h-4 text-[#00ACF0]" />
                    <span>Hardware & Operating Environment</span>
                  </div>
                  <ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
                    <li>Device model, CPU architecture, and GPU renderer strings</li>
                    <li>Operating system build, platform name, and distribution</li>
                    <li>Display resolution, pixel ratio, viewport geometry, color depth</li>
                    <li>Battery status API telemetry (charge level and charging state)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span>Network & Session Telemetry</span>
                  </div>
                  <ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
                    <li>IP address, Autonomous System Number (ASN), and ISP identification</li>
                    <li>Regional geolocation (country, state, city) derived via IP lookup</li>
                    <li>Connection type (e.g. 4G, 5G, Wi-Fi), Round Trip Time (RTT), and latency</li>
                    <li>Browser user-agent, installed language headers, and WebGL features</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Examination Anti-Cheat Proctoring Signals</span>
                  </div>
                  <ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
                    <li>Browser window focus and blur event timestamps</li>
                    <li>Tab switching counts, secondary screen connections, and display changes</li>
                    <li>Full-screen mode entry, exit, and dismissal telemetry</li>
                    <li>Copy, paste, inspect-element, and keyboard shortcut interruption flags</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span>Bot Detection & Heuristic Telemetry</span>
                  </div>
                  <ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
                    <li>Mouse movement vectors, scroll physics, and touch contact geometry</li>
                    <li>Keystroke cadence variations (anomalous automated bot typing detection)</li>
                    <li>Honeypot form traps and non-human traversal pattern flags</li>
                    <li>Browser automated execution flags (e.g. navigator.webdriver detection)</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 text-xs text-neutral-600 dark:text-neutral-400">
                <strong>Specific Purpose Limitation (Section 6):</strong> We do not correlate your device hardware
                fingerprint across unaffiliated third-party advertising networks. Telemetry is utilized exclusively for
                exam integrity, platform security, session persistence, and client rendering optimization (such as
                adjusting Phaser and WebGL frame rates).
              </div>
            </div>
          </section>

          {/* Section 3: Itemized Personal Data Collection Matrix */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="matrix-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h2 id="matrix-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                3. Itemized Data Collection & Purpose Specification (Section 5)
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              Under Section 5 of the DPDP Act and Rule 3 of the DPDP Rules 2025, every data field collected is itemized
              with its exact operational purpose:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <thead className="bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3 border-b border-neutral-200 dark:border-neutral-800">Category</th>
                    <th className="p-3 border-b border-neutral-200 dark:border-neutral-800">Data Fields</th>
                    <th className="p-3 border-b border-neutral-200 dark:border-neutral-800">Lawful Purpose Code</th>
                    <th className="p-3 border-b border-neutral-200 dark:border-neutral-800">Retention Horizon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-600 dark:text-neutral-400">
                  <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="p-3 font-semibold text-neutral-900 dark:text-neutral-100">Account Identity</td>
                    <td className="p-3">First Name, Last Name, Email, Mobile Number, Password Hash</td>
                    <td className="p-3 font-mono text-[11px] text-[#00ACF0]">purpose:auth_service_v1</td>
                    <td className="p-3">Duration of active account + 180 days post-deletion</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="p-3 font-semibold text-neutral-900 dark:text-neutral-100">Academic Records</td>
                    <td className="p-3">Assigned Roll Number, Academic Institution, Quiz Scores, Certificates</td>
                    <td className="p-3 font-mono text-[11px] text-[#00ACF0]">purpose:exam_cert_v1</td>
                    <td className="p-3">Permanent credential verification archive (or user deletion request)</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="p-3 font-semibold text-neutral-900 dark:text-neutral-100">Billing & Orders</td>
                    <td className="p-3">Billing Address, GSTIN, Transaction Reference, Invoices</td>
                    <td className="p-3 font-mono text-[11px] text-[#00ACF0]">purpose:billing_gst_v1</td>
                    <td className="p-3">8 Years (Mandatory under Indian GST & Companies Act)</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="p-3 font-semibold text-neutral-900 dark:text-neutral-100">Proctoring Telemetry</td>
                    <td className="p-3">Tab Switches, Window Blur, Fullscreen status, Proctoring logs</td>
                    <td className="p-3 font-mono text-[11px] text-[#00ACF0]">purpose:exam_proctoring_v1</td>
                    <td className="p-3">90 Days post-exam evaluation conclusion</td>
                  </tr>
                  <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="p-3 font-semibold text-neutral-900 dark:text-neutral-100">Support & Feedback</td>
                    <td className="p-3">Inquiry messages, Support tickets, Ratings, Communication log</td>
                    <td className="p-3 font-mono text-[11px] text-[#00ACF0]">purpose:support_crm_v1</td>
                    <td className="p-3">3 Years post ticket closure</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Future Modular Platform Features (Social, Portfolios, Leaderboards) */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="future-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h2 id="future-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                4. Future Platform Features: Developer Portfolios, Skill Tracking & Public Leaderboards
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                As Soft Game Studio expands its engineering ecosystem, we are introducing new modular platform sections
                governed by granular user privacy controls:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#00ACF0]" />
                    <span>Public Developer Portfolios</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Users can publish custom developer portfolios showcasing completed projects, source code links, and
                    technical resumes. Profile visibility can be toggled to Public, Community-Only, or Private at any time.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Skill Tracking & Leaderboards</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Technical skill achievements, Google technology proficiencies, quiz standings, and hackathon scores may
                    be featured on public studio leaderboards. Users retain the right to appear pseudonymously or opt out of
                    public rankings.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <span>Social Media Integrations</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Optional linking of external profiles (GitHub, LinkedIn, Discord, YouTube). Soft Game Studio requests
                    only read-only identity tokens and will never post, message, or modify your external social accounts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Children's Data & Verifiable Parental Consent (Section 9) */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="children-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 id="children-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                5. Protection of Children&apos;s Data (Section 9 & Rule 10)
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Under Section 9 of the DPDP Act 2023, an individual who has not completed eighteen (18) years of age is
                classified as a child. Soft Game Studio enforces strict, non-negotiable statutory safeguards:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>
                  <strong>Verifiable Parental Consent (VPC)</strong>: Before processing any personal data of an
                  individual under 18, we require verifiable consent from their lawful parent or legal guardian via
                  government-authorized digital identity frameworks (such as DigiLocker tokenization under Rule 10). A
                  simple self-declaration or checkbox is legally void.
                </li>
                <li>
                  <strong>Absolute Ban on Behavioral Tracking</strong>: Under Section 9(3), we strictly prohibit tracking,
                  behavioral monitoring, or targeted advertising directed at children. For minor accounts, all third-party
                  advertising pixels (such as Google AdSense) and tracking SDKs are hard-blocked by our platform routing.
                </li>
                <li>
                  <strong>Prohibition of Detrimental Processing</strong>: We do not undertake any data processing
                  activity likely to cause detrimental effects on the well-being of a child.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Rate Limiting, DDoS Defense & Reasonable Security Safeguards */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="security-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 id="security-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                6. Rate Limiting, Threat Mitigation & Reasonable Security Safeguards (Section 8(5))
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                In compliance with Section 8(5) of the DPDP Act, Soft Game Studio implements multi-layered organizational,
                physical, and technical safeguards to prevent unauthorized access, alteration, disclosure, or data
                breaches:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-rose-500" />
                    <span>Multi-Tiered API Rate Limiting</span>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    To prevent credential stuffing, automated candidate roll-number scraping, and API exhaustion, we enforce
                    per-IP and per-account rate limits (e.g. max 60 requests/minute on public endpoints; max 5
                    attempts/minute on authentication routes). Exceeding limits triggers automated 429 Too Many Requests
                    blocks.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-500" />
                    <span>Cryptographic Storage & Transmission</span>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    All data in transit is encrypted using Transport Layer Security (TLS 1.2 and TLS 1.3). Sensitive records
                    in persistent storage (Firebase/Firestore) are encrypted at rest using AES-256 with key management
                    controls.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-indigo-500" />
                    <span>Immutable Consent Artefacts</span>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Consent grants generate an immutable JSON-LD artefact containing a UUIDv4 consent identifier, SHA-256
                    user pseudonym, purpose code, timestamp, and hash of the localized notice text, signed cryptographically
                    to prove non-repudiation during regulatory audits.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>Admin PII Access Logging</span>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    All administrative operations involving student or intern personal data (including CSV exports and
                    record updates) write to an immutable audit log recording the administrator ID, action, timestamp, and
                    purpose, retained for a minimum of 1 year.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Data Principal Rights Automation (Sections 11–14 & Rule 14) */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="rights-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 id="rights-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                7. Your Enforceable Statutory Rights (Sections 11 through 14)
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                The DPDP Act 2023 grants you enforceable statutory rights as a Data Principal. You can exercise these
                directly via your account profile or by submitting a verified request:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1">
                    Right to Access (Section 11)
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    You have the right to obtain a summary of your personal data being processed, the identities of all
                    data fiduciaries and processors with whom data has been shared, and an automated machine-readable export
                    of your records.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1">
                    Right to Correction & Completion (Section 12(1))
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    You may correct inaccurate personal data, complete incomplete information, and update contact records
                    through your Profile Settings.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1">
                    Right to Erasure (Section 12(3))
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    You may request deletion of your account and personal records. Primary accounts, marketing data, and
                    quiz drafts are hard-deleted. Financial transaction records are retained with masked PII where required
                    by superseding Indian tax and accounting statutes.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mb-1">
                    Right to Nominate (Section 14)
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    You have the statutory right to nominate another individual who, in the event of your death or
                    incapacity, shall be authorized to exercise your data principal rights regarding your studio
                    credentials, digital products, and certificates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: Dual Breach Reporting Protocol (CERT-In vs DPBI) */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="breach-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <h2 id="breach-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                8. Incident Response & Dual Breach Reporting Protocol
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                In the event of a verified cybersecurity incident or personal data breach, Soft Game Studio executes a
                synchronized incident response protocol compliant with both Indian regulatory authorities:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-rose-500 block">
                    6-Hour Incident Clock
                  </span>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    CERT-In Cybersecurity Notification
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Covered technical cyber incidents (e.g. system compromise, ransomware, unauthorized access) are
                    reported to the Indian Computer Emergency Response Team (CERT-In) within 6 hours of awareness in
                    accordance with the IT Act Directions, 2022.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#00ACF0] block">
                    72-Hour Personal Data Clock
                  </span>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    DPBI & Data Principal Notification
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Any breach compromising the confidentiality or integrity of personal data is intimated to the Data
                    Protection Board of India (DPBI) and every affected Data Principal without delay, followed by a
                    comprehensive root-cause and mitigation report within 72 hours under Rule 7 of DPDP Rules 2025.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: Data Protection Grievance Officer & Statutory 90-Day SLA */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="officer-heading"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <h2 id="officer-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                9. Data Protection Grievance Officer & Statutory 90-Day SLA (Rule 14)
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Under Section 8(10) of the DPDP Act and Rule 14(3) of the DPDP Rules 2025, Soft Game Studio has designated
                an official Data Protection Grievance Officer. We are legally bound to resolve all privacy grievances,
                rights requests, and data disputes within a maximum timeline of <strong>90 days</strong>:
              </p>

              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-700 dark:text-neutral-300">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Designated Office:</span>
                    <strong className="text-neutral-900 dark:text-neutral-100">
                      Data Protection Grievance Officer
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Entity:</span>
                    <span className="text-neutral-900 dark:text-neutral-100">Soft Game Studio</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Official Redressal Email:</span>
                    <a
                      href="mailto:team.softgamestudio@gmail.com?subject=DPDP%20Statutory%20Grievance%20Notice"
                      className="font-mono text-[#00ACF0] hover:underline"
                    >
                      team.softgamestudio@gmail.com
                    </a>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Resolution SLA:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Maximum 90 calendar days (Statutory)
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-neutral-400 block text-[11px]">Physical Communications:</span>
                    <span className="text-neutral-800 dark:text-neutral-200">
                      House No. 574, Street No. 5, Nai Abadi, Abohar, Punjab 152116, India
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                If your grievance remains unaddressed or you are dissatisfied with our resolution within the 90-day window,
                you retain the statutory right under Section 13(3) to escalate the dispute directly to the{' '}
                <strong>Data Protection Board of India (DPBI)</strong>.
              </p>
            </div>
          </section>

          {/* Section 10: Contact Desk & Action Bar */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 sm:p-8 text-center shadow-xs"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-lg font-bold text-white mb-2">
              Exercise Your Privacy Rights or Submit an Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-6 leading-relaxed">
              Submit an itemized data access request, correct your academic credentials, nominate a successor, or request
              account erasure directly with our privacy team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:team.softgamestudio@gmail.com?subject=DPDP%20Data%20Principal%20Request"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#00ACF0]" />
                <span>Email Grievance Officer</span>
              </a>
              <Link
                to="/ContactUs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium border border-neutral-700 hover:bg-white/10 transition-colors"
              >
                <span>Support Contact Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/TermsAndConditions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium border border-neutral-700 hover:bg-white/10 transition-colors"
              >
                <span>Review Terms &amp; Conditions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default PrivacyPolicy;

function BuildingIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
