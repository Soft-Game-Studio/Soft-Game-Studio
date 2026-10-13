// src/pages/CUSTOMER SERVICE/AboutDevelopment.jsx
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import {
  Code,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  GitBranch,
  Terminal,
  Zap
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const DevelopmentPage = () => {
  const shouldReduceMotion = useReducedMotion();

  // Authentic Soft Game Studio open projects & architectural systems
  const projects = [
    {
      id: 1,
      title: "SGS Web Engine & Learning Portal",
      description: "Production React 18 single-page application powering developer notes, interactive KaTeX math rendering, and multi-format curriculum viewers.",
      technologies: ["React", "TailwindCSS", "Framer Motion", "KaTeX", "Vite"],
      link: "/Notes&Books"
    },
    {
      id: 2,
      title: "Real-Time Assessment & Proctoring System",
      description: "Secure, real-time assessment framework featuring browser lockdown protection, tab switching detection, and instant scoring analytics.",
      technologies: ["Firebase Firestore", "JavaScript", "Cloud Functions", "TailwindCSS"],
      link: "/About-Exam"
    },
    {
      id: 3,
      title: "Interactive E-Book & PDF Compilation Engine",
      description: "High-performance client-side document processing engine that compiles complex KaTeX formulas and technical manuals into downloadable PDF archives.",
      technologies: ["html2pdf.js", "JSZip", "FileSaver", "KaTeX"],
      link: "/E-Books"
    }
  ];

  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/AboutDevelopmet#webpage",
          "url": "https://softgamestudios.web.app/AboutDevelopmet",
          "name": "Software Engineering & Development Services | Soft Game Studio",
          "description": "Learn about the engineering philosophy, architecture standards, and active projects built by Soft Game Studio.",
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

  const pageTitle = "Engineering & Development Services | Soft Game Studio";
  const pageDescription = "Explore the engineering practices, architectural standards, and technical projects developed by Soft Game Studio.";
  const canonicalUrl = "https://softgamestudios.web.app/AboutDevelopmet";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Soft Game Studio Development, Web Development, Software Engineering, Cloud Architecture, DevOps, Clean Code" />
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
                Development Philosophy
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <Terminal className="w-3.5 h-3.5 text-[#00ACF0]" />
                  <span>Engineering Architecture</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  Software Engineering & Architecture
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  How Soft Game Studio designs, constructs, and deploys high-performance web systems, proctored testing engines, and educational technologies.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  to="/SGS-Projects"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Explore Projects</span>
                </Link>
              </div>
            </div>

          </div>
        </header>

        {/* ── Content Sections ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">

          {/* Section 1: Core Engineering Principles */}
          <section aria-labelledby="principles-heading">
            <div className="text-center mb-10">
              <h2 id="principles-heading" className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Core Development Principles
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-lg mx-auto">
                Standards guiding our codebase maintainability, security, and performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <Code className="w-5 h-5 text-[#00ACF0]" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Maintainable & Clean Code
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We enforce SOLID design principles, modular component architecture, and comprehensive inline documentation across our front-end and back-end stacks.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Performance & Core Web Vitals
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We benchmark code against stringent Core Web Vitals: sub-second Largest Contentful Paint (LCP), low layout shift (CLS), and instantaneous interaction paint (INP).
                </p>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Security-First Architecture
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We implement input sanitization, rate-limiting, least-privilege Firestore rules, and anti-cheating browser monitors to preserve system integrity.
                </p>
              </div>

            </div>
          </section>

          {/* Section 2: Flagship Systems Showcase */}
          <section aria-labelledby="showcase-heading">
            <div className="mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h2 id="showcase-heading" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Featured Platform Architecture
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Production systems actively serving thousands of student developers
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                        Production Live
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2 leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={project.link}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
                  >
                    <span>View Component</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Technical Skills Matrix */}
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
            aria-labelledby="skills-heading"
          >
            <h2 id="skills-heading" className="text-sm font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              Core Engineering Stack & Tooling
            </h2>

            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "React 18",
                "TypeScript",
                "TailwindCSS",
                "Firebase Firestore",
                "Node.js",
                "Framer Motion",
                "Vite",
                "Git & GitHub",
                "RESTful APIs",
                "KaTeX Engine",
                "Cloud Storage",
                "Lighthouse SEO"
              ].map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
};

export default DevelopmentPage;