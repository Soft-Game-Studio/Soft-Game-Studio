/**
 * HeroSection.jsx: Soft Game Studio Homepage
 *
 * Production-grade lightweight React architecture:
 * - Immediate First Paint: NavbarMenu and Hero section are rendered immediately above the fold
 * - Lazy Loading: All below-the-fold sections (Capabilities, Projects, Pricing, About, Events, Contact, Footer)
 *   are code-split via React.lazy and dynamically mounted via IntersectionObserver / idle scheduling
 * - Performance: Minimal initial JS bundle, zero initial Firestore network calls, instant LCP/FCP
 * - Accessibility: Native crawlable links, keyboard focus states, WCAG 2.1 AA contrast, prefers-reduced-motion
 * - SEO & AI Discoverability: Full Helmet metadata, canonical tags, Open Graph, Twitter cards, JSON-LD structured data
 */

import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import { NavbarMenu } from '../navbar/Navbar';

/* Dynamic code-split chunk for below-the-fold content and footer */
const HomeBelowFold = lazy(() => import('./HomeBelowFold'));

/* -------------------------------------------------------------------------- */
/* Reduced-Motion Aware Animation Variants                                    */
/* -------------------------------------------------------------------------- */
function useMotionVariants() {
  const shouldReduceMotion = useReducedMotion();
  return useMemo(
    () => ({
      fadeUp: {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
        visible: (delay = 0) => ({
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.01 : 0.45,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
        }),
      },
      fadeIn: {
        hidden: { opacity: 0 },
        visible: (delay = 0) => ({
          opacity: 1,
          transition: {
            duration: shouldReduceMotion ? 0.01 : 0.35,
            delay,
            ease: 'easeOut',
          },
        }),
      },
    }),
    [shouldReduceMotion]
  );
}

/* -------------------------------------------------------------------------- */
/* Interactive Studio Architecture Inspector (Hero Visual Component)          */
/* -------------------------------------------------------------------------- */
const ARCHITECTURE_PILLARS = [
  {
    id: 'web',
    name: 'Web Systems',
    badge: 'React 18 + Vite',
    target: 'Single Page & Enterprise Web Apps',
    metric: 'Sub-second LCP and INP under 50ms',
    layers: [
      { step: '01', title: 'Modular UI', detail: 'Component hierarchies with strict state boundaries' },
      { step: '02', title: 'Client Cache', detail: 'Optimized store with selective re-renders' },
      { step: '03', title: 'Network Layer', detail: 'Async fetch with AbortController and retries' },
      { step: '04', title: 'Asset Pipeline', detail: 'Vite code splitting and modern format compression' },
    ],
    features: ['Accessible WCAG 2.1 AA Markup', 'Zero Layout Shift Architecture', 'Tailwind Utility Design System'],
  },
  {
    id: 'game',
    name: 'Game Engineering',
    badge: 'Phaser 3 + WebGL',
    target: 'Interactive 2D Canvas Engines',
    metric: 'Deterministic 60 FPS update cycle',
    layers: [
      { step: '01', title: 'Canvas Stage', detail: 'WebGL and Canvas rendering with adaptive resolution' },
      { step: '02', title: 'Physics Loop', detail: 'Deterministic delta time collision resolution' },
      { step: '03', title: 'Asset Preload', detail: 'Texture atlas packing and audio buffer caching' },
      { step: '04', title: 'State Manager', detail: 'Scene transitions and responsive user input events' },
    ],
    features: ['High-Performance Sprite Pipelines', 'Touch and Keyboard Controllers', 'Zero-Lag Game Mechanics'],
  },
  {
    id: 'cloud',
    name: 'Cloud Infrastructure',
    badge: 'Firebase + Firestore',
    target: 'Distributed Real-Time Database',
    metric: 'Encrypted transit and real-time sync',
    layers: [
      { step: '01', title: 'Identity Layer', detail: 'Firebase Auth with session validation' },
      { step: '02', title: 'Security Rules', detail: 'Authoritative server-side field allowlists' },
      { step: '03', title: 'Firestore Sync', detail: 'Real-time document listeners and offline cache' },
      { step: '04', title: 'Global CDN', detail: 'Immutable static assets with long-term cache headers' },
    ],
    features: ['Role-Based Data Access', 'Automatic Offline Fallbacks', 'Multi-Region High Availability'],
  },
];

function StudioArchitectureInspector() {
  const [activeTab, setActiveTab] = useState('web');
  const currentPillar = useMemo(
    () => ARCHITECTURE_PILLARS.find((p) => p.id === activeTab) || ARCHITECTURE_PILLARS[0],
    [activeTab]
  );

  return (
    <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden flex flex-col">
      {/* Inspector Chrome Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </span>
          <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 ml-2">
            architecture.inspector.sys
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>VERIFIED STACK</span>
        </div>
      </div>

      {/* Pillar Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-950/50 overflow-x-auto scrollbar-hide">
        {ARCHITECTURE_PILLARS.map((pillar) => {
          const isActive = pillar.id === activeTab;
          return (
            <button
              key={pillar.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${pillar.id}`}
              id={`tab-${pillar.id}`}
              onClick={() => setActiveTab(pillar.id)}
              className={`flex-1 min-w-[130px] px-3.5 py-2.5 text-xs font-medium transition-colors border-b-2 text-center whitespace-nowrap focus-visible:outline-none focus-visible:bg-neutral-200/50 dark:focus-visible:bg-neutral-800 ${isActive
                  ? 'border-neutral-900 dark:border-white text-neutral-950 dark:text-white bg-white dark:bg-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
            >
              {pillar.name}
            </button>
          );
        })}
      </div>

      {/* Tab Panel Body */}
      <div
        id={`panel-${currentPillar.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentPillar.id}`}
        className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between"
      >
        {/* Primary Spec */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Engineering Target
              </p>
              <h3 className="text-base font-bold text-neutral-950 dark:text-neutral-50">
                {currentPillar.target}
              </h3>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
              {currentPillar.badge}
            </span>
          </div>

          <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950/70 px-3 py-1.5 rounded border border-neutral-200 dark:border-neutral-800">
            Performance Standard: {currentPillar.metric}
          </p>
        </div>

        {/* 4-Step Architecture Flow */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Pipeline Topology
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentPillar.layers.map((layer) => (
              <div
                key={layer.step}
                className="p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 dark:text-neutral-400">
                    {layer.step}
                  </span>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {layer.title}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
                  {layer.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Feature Checklist */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
          {currentPillar.features.map((feat) => (
            <div key={feat} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-[11px] font-medium">{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Below-The-Fold Lazy Placeholder                                            */
/* -------------------------------------------------------------------------- */
function BelowFoldPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="py-20 max-w-7xl mx-auto px-5 sm:px-8 space-y-12 opacity-60"
    >
      <div className="h-8 bg-neutral-100 dark:bg-neutral-900 rounded w-1/4 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main HomePage Component                                                    */
/* -------------------------------------------------------------------------- */
const HomePage = () => {
  const variants = useMotionVariants();
  const sentinelRef = useRef(null);

  /* Progressive Lazy-Loading State for Below-The-Fold Content */
  const [shouldLoadBelowFold, setShouldLoadBelowFold] = useState(() => {
    // If user navigated directly to an anchor link (#work, #about, etc.), load immediately
    if (typeof window !== 'undefined' && window.location.hash) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (shouldLoadBelowFold) return;

    // Trigger 1: Viewport intersection (sentinel entered or approaching within 400px)
    let observer;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && sentinelRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldLoadBelowFold(true);
          }
        },
        { rootMargin: '400px 0px' }
      );
      observer.observe(sentinelRef.current);
    }

    // Trigger 2: User interaction (scroll / touch)
    const handleUserInteraction = () => {
      setShouldLoadBelowFold(true);
    };

    window.addEventListener('scroll', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: true });

    // Trigger 3: Idle fallback timeout (ensures crawlers and non-scrollers receive full page)
    const idleTimer = setTimeout(() => {
      setShouldLoadBelowFold(true);
    }, 1200);

    return () => {
      if (observer) observer.disconnect();
      clearTimeout(idleTimer);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [shouldLoadBelowFold]);

  /* Structured Data JSON-LD Memoized */
  const structuredData = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://softgamestudios.web.app/#organization',
            name: 'Soft Game Studio',
            alternateName: 'SGS',
            url: 'https://softgamestudios.web.app/',
            logo: {
              '@type': 'ImageObject',
              url: 'https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media',
              width: 512,
              height: 512,
            },
            description:
              'Soft Game Studio is an independent software engineering studio developing production web systems, mobile applications, and interactive 2D games using React, Firebase, and Phaser.',
            knowsAbout: [
              'React.js Development',
              'Vite',
              'Phaser 3 Game Engine',
              'Firebase Firestore Architecture',
              'Mobile Application Development',
              'Web Performance Optimization',
            ],
            contactPoint: [
              {
                '@type': 'ContactPoint',
                contactType: 'technical support',
                email: 'sgs.web.app@gmail.com',
                telephone: '+91-9914267704',
                availableLanguage: ['English', 'Hindi'],
              },
            ],
            sameAs: [
              'https://github.com/SOFTGAMESTUDIO',
              'https://www.linkedin.com/company/soft-game-studio/',
              'https://www.youtube.com/@SoftGameStudioOfficial',
              'https://www.instagram.com/softgamestudioofficial/',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': 'https://softgamestudios.web.app/#website',
            url: 'https://softgamestudios.web.app/',
            name: 'Soft Game Studio',
            publisher: { '@id': 'https://softgamestudios.web.app/#organization' },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://softgamestudios.web.app/Projects?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@type': 'ProfessionalService',
            '@id': 'https://softgamestudios.web.app/#service',
            name: 'Soft Game Studio Software Engineering Services',
            url: 'https://softgamestudios.web.app/',
            image:
              'https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media',
            description:
              'Custom web application development, cross-platform mobile apps, and interactive 2D canvas game development.',
            areaServed: 'Worldwide',
            serviceType: [
              'Web Application Development',
              'Mobile App Development',
              '2D Game Development',
              'Cloud Architecture and Firebase Integration',
            ],
          },
        ],
      }),
    []
  );

  return (
    <div className="bg-white dark:bg-neutral-950 m-0 p-0 min-h-screen text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* -------------------------------------------------------------------- */}
      {/* Search Engine and AI-Search Metadata                                 */}
      {/* -------------------------------------------------------------------- */}
      <Helmet>
        <html lang="en" />
        <title>Soft Game Studio | Web Development, Mobile Apps &amp; Game Engineering</title>
        <meta
          name="description"
          content="Soft Game Studio is an independent software studio building production web platforms, cross-platform mobile applications, and 2D games with React, Firebase, and Phaser."
        />
        <link rel="canonical" href="https://softgamestudios.web.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta property="og:title" content="Soft Game Studio | Web Development, Mobile Apps &amp; Game Engineering" />
        <meta
          property="og:description"
          content="Independent software engineering studio building production web apps, mobile platforms, and interactive games with React, Firebase, and Phaser."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />
        <meta property="og:url" content="https://softgamestudios.web.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Soft Game Studio | Web Development, Mobile Apps &amp; Game Engineering" />
        <meta
          name="twitter:description"
          content="Production-grade web apps, mobile platforms, and interactive games engineered with React, Firebase, and Phaser."
        />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      {/* -------------------------------------------------------------------- */}
      {/* Accessible Skip Navigation Link                                      */}
      {/* -------------------------------------------------------------------- */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-neutral-900 focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
      >
        Skip to main content
      </a>

      {/* -------------------------------------------------------------------- */}
      {/* GLOBAL NAVBAR (Rendered immediately)                                 */}
      {/* -------------------------------------------------------------------- */}
      <NavbarMenu />

      {/* ================================================================== */}
      {/* HERO SECTION (Rendered immediately above the fold)                 */}
      {/* ================================================================== */}
      <header
        role="banner"
        aria-label="Soft Game Studio: Software Engineering and Game Development"
        className="relative border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950 overflow-hidden"
      >
        {/* Subtle geometric dot grid for depth (decorative) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Eyebrow Status Badge */}
              <motion.div
                variants={variants.fadeIn}
                initial="hidden"
                animate="visible"
                custom={0}
                className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-700 dark:text-neutral-300 shadow-xs"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm sm:text-base">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse"
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Soft Game Studio
                  </span>
                  <span
                    className="hidden text-neutral-300 dark:text-neutral-700 sm:inline"
                    aria-hidden="true"
                  >
                    /
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Available for Client Projects
                  </span>
                </div>
              </motion.div>

              {/* Single Semantic H1 */}
              <motion.h1
                variants={variants.fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.06}
                className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12] mb-6"
              >
                Engineering high-performance web systems, mobile platforms, and interactive games.
              </motion.h1>

              {/* Supporting Copy */}
              <motion.p
                variants={variants.fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.12}
                className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed mb-8"
              >
                We build production software for companies, educators, and product teams. From responsive React web
                applications to 60 FPS Phaser game engines and resilient Firebase cloud infrastructure, our
                engineering delivers verified reliability and fast performance.
              </motion.p>

              {/* Primary and Secondary CTA Buttons */}
              <motion.div
                variants={variants.fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.18}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10"
              >
                <Link
                  to="/Projects"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <span>Explore Engineering Work</span>
                  <HiOutlineArrowNarrowRight aria-hidden="true" className="w-4 h-4" />
                </Link>

                <Link
                  to="/ContactUs"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <span>Contact the Studio</span>
                  <FaArrowRight aria-hidden="true" className="w-3 h-3 text-neutral-400" />
                </Link>
              </motion.div>

              {/* Studio Trust Signals & Technical Focus */}
              <motion.div
                variants={variants.fadeIn}
                initial="hidden"
                animate="visible"
                custom={0.24}
                className="pt-6 border-t border-neutral-200 dark:border-neutral-800 w-full flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-neutral-500 dark:text-neutral-400"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
                  React 18 &amp; Vite
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
                  Phaser 3 Engine
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
                  Firebase Architecture
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
                  WCAG 2.1 AA Compliant
                </span>
              </motion.div>
            </div>

            {/* Right Column: Interactive Studio Architecture Inspector */}
            <div className="lg:col-span-5 w-full">
              <motion.div
                variants={variants.fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.15}
                className="w-full"
              >
                <StudioArchitectureInspector />
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Sentinel marker: Triggers lazy loading of below-the-fold content */}
      <div ref={sentinelRef} className="h-2 w-full pointer-events-none" aria-hidden="true" />

      {/* ================================================================== */}
      {/* LAZY-LOADED MAIN CONTENT & FOOTER                                  */}
      {/* ================================================================== */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        {shouldLoadBelowFold ? (
          <Suspense fallback={<BelowFoldPlaceholder />}>
            <HomeBelowFold />
          </Suspense>
        ) : (
          <BelowFoldPlaceholder />
        )}
      </main>
    </div>
  );
};

export default HomePage;