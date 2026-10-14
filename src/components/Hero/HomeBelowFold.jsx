/**
 * HomeBelowFold.jsx: Soft Game Studio Below-The-Fold Sections
 *
 * Lazy-loaded module containing:
 * - Core Capabilities (#capabilities)
 * - Featured Projects from Firestore (#work)
 * - Collaboration Engagement Models (#pricing)
 * - Studio Profile and Engineering Pillars (#about)
 * - Developer Events and Hackathons (#community)
 * - Direct Inquiries (#contact)
 * - Global Footer (<Footer />)
 *
 * Lazy-loaded to ensure the homepage initial paint is ultra-lightweight.
 */

/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaGlobe,
  FaMobileAlt,
  FaGamepad,
  FaCloud,
  FaCheck,
  FaEnvelope,
  FaPhoneAlt,
  FaCode,
  FaServer,
  FaShieldAlt,
  FaTerminal,
} from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { fireDB } from '../../DataBase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Footer from '../footer/Footer';

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
      stagger: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : 0.08,
          },
        },
      },
      cardItem: {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.01 : 0.4,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      },
    }),
    [shouldReduceMotion]
  );
}

/* -------------------------------------------------------------------------- */
/* Section Header Utility                                                     */
/* -------------------------------------------------------------------------- */
function SectionHeader({ kicker, title, description, id }) {
  return (
    <div className="max-w-3xl mb-12 sm:mb-16">
      {kicker && (
        <p className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">
          {kicker}
        </p>
      )}
      <h2
        id={id}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mb-4 leading-snug"
      >
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Project Card Skeleton                                                      */
/* -------------------------------------------------------------------------- */
function ProjectSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg overflow-hidden animate-pulse"
    >
      <div className="h-48 bg-neutral-100 dark:bg-neutral-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-full" />
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-5/6" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Project Card with Native Crawlable Link and Fallback Support               */
/* -------------------------------------------------------------------------- */
function ProjectCard({ project }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link
      to={`/Projects/${project.id}`}
      aria-label={`View case study for ${project.name}`}
      className="group block border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg overflow-hidden flex flex-col hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 h-full"
    >
      {/* Thumbnail with strict aspect ratio reservation to prevent CLS */}
      <div className="relative aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        {project.photoUrl && !imageFailed ? (
          <img
            loading="lazy"
            decoding="async"
            src={project.photoUrl}
            alt={`${project.name} interface screenshot`}
            width={480}
            height={270}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-neutral-100 dark:bg-neutral-850">
            <FaCode className="w-6 h-6 text-neutral-400 dark:text-neutral-600 mb-2" aria-hidden="true" />
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {project.name}
            </span>
          </div>
        )}

        {project.status && (
          <div
            aria-label={`Project Status: ${project.status}`}
            className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-neutral-900/85 text-white dark:bg-neutral-100/95 dark:text-neutral-950 backdrop-blur-sm"
          >
            {project.status}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-neutral-950 dark:text-neutral-100 mb-2 truncate group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
          {project.name}
        </h3>

        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3" aria-label="Technologies used">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-0.5 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-neutral-200">
          <span>View Case Study</span>
          <HiOutlineArrowNarrowRight
            aria-hidden="true"
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Below-The-Fold Main Component                                              */
/* -------------------------------------------------------------------------- */
export default function HomeBelowFold() {
  const variants = useMotionVariants();

  /* Firestore Projects Fetch (Deferred until this component mounts) */
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    setProjectsLoading(true);
    setProjectsError(null);

    getDocs(collection(fireDB, 'sgsProjects'))
      .then((snapshot) => {
        if (isCancelled) return;
        const loadedProjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(loadedProjects);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('[SGS] Failed to load projects from Firestore:', err);
        setProjectsError('Unable to load projects right now. Please check your network connection.');
      })
      .finally(() => {
        if (!isCancelled) setProjectsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  /* Static Capabilities Memoized */
  const capabilities = useMemo(
    () => [
      {
        icon: <FaGlobe aria-hidden="true" className="w-4 h-4" />,
        title: 'Web Systems',
        description:
          'Production-ready React applications with modular component architecture, code-split bundles, and accessible semantic markup.',
      },
      {
        icon: <FaMobileAlt aria-hidden="true" className="w-4 h-4" />,
        title: 'Mobile Applications',
        description:
          'Cross-platform applications for iOS and Android with offline-first caching, native device integrations, and secure local storage.',
      },
      {
        icon: <FaGamepad aria-hidden="true" className="w-4 h-4" />,
        title: 'Game Development',
        description:
          'Interactive 2D web games and simulations utilizing Phaser 3, deterministic physics loops, and real-time state management.',
      },
      {
        icon: <FaCloud aria-hidden="true" className="w-4 h-4" />,
        title: 'Cloud and API Infrastructure',
        description:
          'Firebase Firestore databases, automated serverless pipelines, and security rule architectures engineered for continuous uptime.',
      },
    ],
    []
  );

  /* Engineering Pillars Memoized */
  const engineeringPillars = useMemo(
    () => [
      {
        icon: <FaCode aria-hidden="true" className="w-4 h-4" />,
        title: 'Modular Architecture',
        detail: 'Clear boundaries separating visual UI, state stores, and data services for maintainable codebases.',
      },
      {
        icon: <FaTerminal aria-hidden="true" className="w-4 h-4" />,
        title: 'Bundle Optimization',
        detail: 'Vite code splitting, vendor chunk partitioning, and fast First Contentful Paint across all viewports.',
      },
      {
        icon: <FaServer aria-hidden="true" className="w-4 h-4" />,
        title: 'Cloud Persistence',
        detail: 'Structured Firestore collections, encrypted transit, real-time listeners, and automated rule validation.',
      },
      {
        icon: <FaShieldAlt aria-hidden="true" className="w-4 h-4" />,
        title: 'Quality Assurance',
        detail: 'Rigorous linting, keyboard accessibility checks, cross-browser validation, and regression safeguards.',
      },
    ],
    []
  );

  /* Engagement Pricing Tiers Memoized */
  const pricingTiers = useMemo(
    () => [
      {
        name: 'Starter',
        description: 'Core web application or targeted proof-of-concept module.',
        featured: false,
        features: [
          'Responsive interface for mobile, tablet, and desktop',
          'Search engine metadata and accessibility foundation',
          'Modular React component architecture',
          'Validated contact and lead generation forms',
          '30-day post-launch technical support',
        ],
      },
      {
        name: 'Growth',
        description: 'Full-featured web application with dynamic database integration.',
        featured: false,
        features: [
          'Custom UI design system and responsive layout',
          'Firestore real-time database integration',
          'Client-side state management and caching',
          'Multi-page routing with deep link support',
          '90-day maintenance and technical updates',
        ],
      },
      {
        name: 'Professional',
        description: 'Production platform with authenticated users and interactive tools.',
        featured: true,
        features: [
          'Full-stack architecture with custom business logic',
          'Firebase Authentication with role-based access control',
          'Interactive dashboards and real-time data sync',
          'Automated build pipeline and deployment integration',
          '6-month maintenance, monitoring, and updates',
        ],
      },
      {
        name: 'Enterprise',
        description: 'Tailored software and game systems with dedicated engineering capacity.',
        featured: false,
        features: [
          'Custom system architecture and engineering roadmap',
          'Dedicated sprint collaboration and code reviews',
          'Complex cloud integrations and game engine pipelines',
          'Security audits and performance testing',
          'Dedicated service agreement and technical support',
        ],
      },
    ],
    []
  );

  /* Developer Events Memoized */
  const events = useMemo(
    () => [
      {
        id: 1,
        img: 'https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Our%20Social%20Work%2FIMG-20250319-WA0005.jpg?alt=media&token=1be384ea-b1c2-4728-a2cd-e26752f0c14e',
        title: 'Code Vortex',
        tag: 'Coding Competition',
        description:
          'Live programming challenges and algorithmic problem solving designed for student developers and tech enthusiasts.',
        link: '/event',
      },
      {
        id: 2,
        img: 'https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Our%20Social%20Work%2FWhatsApp%20Image%202025-10-29%20at%202.41.56%20PM%20(2).jpeg?alt=media&token=f748965f-07dc-4881-9946-6f0c32e18a2c',
        title: 'Code Clash',
        tag: 'Hackathon',
        description:
          'A competitive hackathon focused on speed of execution, algorithmic design, and real-world web application development.',
        link: '/event',
      },
    ],
    []
  );

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* CAPABILITIES SECTION                                               */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="capabilities"
        aria-labelledby="capabilities-heading"
        className="py-20 sm:py-28 max-w-7xl mx-auto px-5 sm:px-8"
      >
        <SectionHeader
          id="capabilities-heading"
          kicker="Core Competencies"
          title="Disciplined engineering across four domains"
          description="Production software capabilities across modular web applications, native-capable mobile platforms, real-time game simulations, and cloud data systems."
        />

        <motion.div
          variants={variants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {capabilities.map((item) => (
            <motion.div
              key={item.title}
              variants={variants.cardItem}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex flex-col justify-between"
            >
              <div>
                <div
                  aria-hidden="true"
                  className="w-10 h-10 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-5 text-neutral-800 dark:text-neutral-200"
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-neutral-950 dark:text-neutral-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FEATURED PROJECTS SECTION                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="work"
        aria-labelledby="work-heading"
        className="py-20 sm:py-28 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12 sm:mb-16">
            <SectionHeader
              id="work-heading"
              kicker="Production Portfolio"
              title="Selected client systems and engineering projects"
            />
            <Link
              to="/Projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white underline-offset-4 hover:underline transition-colors mb-12 sm:mb-16 flex-shrink-0"
            >
              <span>Browse all projects</span>
              <HiOutlineArrowNarrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>

          {projectsError ? (
            <div
              role="alert"
              className="py-10 px-6 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 rounded-lg text-center"
            >
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{projectsError}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                You can visit the dedicated{' '}
                <Link to="/Projects" className="underline font-semibold">
                  projects catalog
                </Link>{' '}
                directly.
              </p>
            </div>
          ) : projectsLoading ? (
            <div
              aria-busy="true"
              aria-label="Loading projects from database"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <motion.div
              variants={variants.stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.slice(0, 6).map((project) => (
                <motion.div key={project.id} variants={variants.cardItem}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg">
              <p className="text-sm font-mono text-neutral-500">No projects currently listed.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/Projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
            >
              <span>View All Documented Projects</span>
              <FaArrowRight aria-hidden="true" className="w-3 h-3 text-neutral-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ENGAGEMENT MODELS SECTION                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="pricing"
        aria-labelledby="pricing-heading"
        className="py-20 sm:py-28 max-w-7xl mx-auto px-5 sm:px-8"
      >
        <SectionHeader
          id="pricing-heading"
          kicker="Collaboration Scopes"
          title="Structured engagement models"
          description="Transparent collaboration frameworks for prototypes, dedicated product modules, or comprehensive engineering retainers. Contact our team for customized scope pricing."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-lg p-6 flex flex-col justify-between ${tier.featured
                  ? 'border-2 border-neutral-950 dark:border-white bg-white dark:bg-neutral-900 shadow-md'
                  : 'border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50'
                }`}
            >
              {tier.featured && (
                <div
                  aria-label="Recommended engagement model"
                  className="absolute -top-3 left-5 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                >
                  Recommended
                </div>
              )}

              <div>
                <div className="mb-5 mt-1">
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-1.5">{tier.name}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="h-px bg-neutral-100 dark:bg-neutral-800 mb-5" />

                <ul className="space-y-3 mb-8" aria-label={`${tier.name} tier deliverables`}>
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                      <FaCheck
                        aria-hidden="true"
                        className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0"
                      />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/ContactUs"
                aria-label={`Inquire about ${tier.name} engagement model`}
                className={`w-full text-center py-2.5 px-4 rounded-md font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${tier.featured
                    ? 'bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-xs focus-visible:ring-neutral-900 dark:focus-visible:ring-white'
                    : 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-neutral-500'
                  }`}
              >
                Request Project Estimate
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STUDIO PROFILE AND STANDARDS                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="py-20 sm:py-28 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Profile Overview */}
            <motion.div
              variants={variants.fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={0}
              className="lg:col-span-5"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">
                Studio Overview
              </p>
              <h2
                id="about-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mb-6 leading-snug"
              >
                Disciplined architecture and dependable software delivery.
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                <p>
                  Soft Game Studio is an independent software development studio based in India. We construct
                  production applications and interactive graphics systems for startups, businesses, and educational
                  platforms worldwide.
                </p>
                <p>
                  Our engineering methodology emphasizes modular code quality over superficial trends: clearly defined
                  component boundaries, clean bundle optimization, security-first database rules, and attentive
                  post-launch engineering collaboration.
                </p>
              </div>
              <Link
                to="/About-SGS"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
              >
                <span>Read Studio Background</span>
                <HiOutlineArrowNarrowRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Right Engineering Pillars */}
            <motion.div
              variants={variants.stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {engineeringPillars.map((pillar) => (
                <motion.div
                  key={pillar.title}
                  variants={variants.cardItem}
                  className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <div
                    aria-hidden="true"
                    className="w-9 h-9 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-3.5 text-neutral-800 dark:text-neutral-200"
                  >
                    {pillar.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-950 dark:text-neutral-100 mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {pillar.detail}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* COMMUNITY EVENTS & HACKATHONS                                      */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="community"
        aria-labelledby="community-heading"
        className="py-20 sm:py-28 border-t border-neutral-200 dark:border-neutral-800 max-w-7xl mx-auto px-5 sm:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12 sm:mb-16">
          <SectionHeader
            id="community-heading"
            kicker="Community &amp; Culture"
            title="Developer events and coding competitions"
            description="Educational hackathons and coding tournaments organized by Soft Game Studio for the emerging student developer community."
          />
          <Link
            to="/event"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white underline-offset-4 hover:underline transition-colors mb-12 sm:mb-16 flex-shrink-0"
          >
            <span>View all events</span>
            <HiOutlineArrowNarrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group block border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
              aria-label={`${item.title}: ${item.tag}`}
            >
              <div className="relative aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <img
                  loading="lazy"
                  decoding="async"
                  src={item.img}
                  alt={`${item.title} hackathon session`}
                  width={720}
                  height={405}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-neutral-950/20" />
                <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-mono font-medium rounded bg-neutral-900/85 text-white backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold text-neutral-950 dark:text-neutral-100 mb-1.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* DIRECT CONTACT SECTION                                             */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="py-20 sm:py-28 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            custom={0}
          >
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">
              Direct Inquiries
            </p>
            <h2
              id="contact-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mb-4 leading-snug"
            >
              Initiate a project discussion with our studio
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Provide your technical requirements or product brief. Our engineering team will review your scope and
              respond with an architecture overview and feasibility estimate.
            </p>
          </motion.div>

          <motion.div
            variants={variants.stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-2xl mx-auto"
          >
            {/* Email Channel */}
            <motion.div
              variants={variants.cardItem}
              className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <div
                aria-hidden="true"
                className="w-8 h-8 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-700 dark:text-neutral-300"
              >
                <FaEnvelope className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white mb-1">Email</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Project proposals and inquiries</p>
              <a
                href="mailto:sgs.web.app@gmail.com"
                className="text-xs font-mono font-medium text-neutral-950 dark:text-neutral-100 hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
              >
                sgs.web.app@gmail.com
              </a>
            </motion.div>

            {/* Telephone Channel */}
            <motion.div
              variants={variants.cardItem}
              className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <div
                aria-hidden="true"
                className="w-8 h-8 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-700 dark:text-neutral-300"
              >
                <FaPhoneAlt className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white mb-1">Direct Phone</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Mon to Fri, 10:00 to 18:00 IST</p>
              <div className="text-xs font-mono space-y-1">
                <p>
                  <span className="text-neutral-500 dark:text-neutral-400">Hindi: </span>
                  <a
                    href="tel:+919914267704"
                    className="text-neutral-950 dark:text-neutral-100 hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
                  >
                    +91 9914267704
                  </a>
                </p>
                <p>
                  <span className="text-neutral-500 dark:text-neutral-400">English: </span>
                  <a
                    href="tel:+916283400770"
                    className="text-neutral-950 dark:text-neutral-100 hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
                  >
                    +91 6283400770
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>

          <Link
            to="/ContactUs"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
          >
            <span>Send a Project Brief</span>
            <HiOutlineArrowNarrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* GLOBAL FOOTER (Deferred with below-the-fold content)               */}
      {/* ------------------------------------------------------------------ */}
      <Footer />
    </>
  );
}
