/**
 * SGSProject.jsx: Soft Game Studio Engineering Portfolio Catalog
 *
 * Production-grade project showcase implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, zero emoji icons
 * - Real-Time Search & Multi-Category Filtering: Filter by keyword, category, or tech stack
 * - Performance & Core Web Vitals: Removed heavy tsparticles, aspect ratio image reservations
 * - Technical SEO: react-helmet-async with CollectionPage and ItemList JSON-LD structured data
 * - Responsive Layout & Fluid Accessibility: Keyboard focus indicators, crawlable link tags
 */

/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fireDB } from '../../DataBase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../../components/layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFolderOpen,
  FaCode,
  FaExternalLinkAlt,
  FaArrowRight,
  FaSearch,
  FaTimes,
  FaLayerGroup,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaLaptopCode,
  FaGlobe,
  FaServer,
  FaGamepad
} from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

export default function SGSProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch Projects with unmount cleanup
  useEffect(() => {
    let isCancelled = false;

    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, 'sgsProjects'));
        if (isCancelled) return;

        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(projectsData);
        setError(null);
      } catch (err) {
        if (!isCancelled) {
          console.error('[SGS Projects] Error fetching projects:', err);
          setError('Failed to load portfolio projects. Please try again.');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchProjects();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Compute Unique Categories
  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      const cat = p.category || p.projectType?.category;
      if (cat) set.add(cat.trim());
    });
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  // Filtered Projects Pipeline
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (selectedCategory !== 'All') {
      result = result.filter((p) => {
        const cat = p.category || p.projectType?.category || '';
        return cat.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((p) => {
        const matchName = p.name?.toLowerCase().includes(term);
        const matchDesc = p.description?.toLowerCase().includes(term);
        const matchTech = Array.isArray(p.technologies || p.techStack) &&
          (p.technologies || p.techStack).some((t) => String(t).toLowerCase().includes(term));
        return matchName || matchDesc || matchTech;
      });
    }

    return result;
  }, [projects, selectedCategory, searchTerm]);

  // Structured Data JSON-LD
  const structuredData = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Soft Game Studio Featured Engineering Projects',
      url: 'https://softgamestudios.web.app/SGS-Projects',
      description: 'Explore full-stack web applications, game engines, and production-grade software engineered by Soft Game Studio.',
      publisher: {
        '@type': 'Organization',
        name: 'Soft Game Studio',
        url: 'https://softgamestudios.web.app',
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: filteredProjects.slice(0, 10).map((p, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: p.name,
          url: `https://softgamestudios.web.app/SGS-Projects/${p.id}`,
        })),
      },
    });
  }, [filteredProjects]);

  return (
    <Layout>
      <Helmet>
        <title>Engineering Projects and Case Studies | Soft Game Studio Portfolio</title>
        <meta
          name="description"
          content="Explore full-stack web applications, game engines, and cloud platforms engineered by Soft Game Studio. Detailed architectural case studies and live demos."
        />
        <meta property="og:title" content="Engineering Projects and Case Studies | Soft Game Studio" />
        <meta
          property="og:description"
          content="Explore production-grade software, interactive games, and web architectures engineered by Soft Game Studio."
        />
        <meta property="og:url" content="https://softgamestudios.web.app/SGS-Projects" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <FaLaptopCode className="text-neutral-500 text-xs" />
              Software Engineering Portfolio
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
              Featured Projects & Case Studies
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Explore production applications, game engines, and enterprise web systems engineered with strict performance, reliability, and security standards.
            </p>

            {/* Portfolio Highlights Bar */}
            {!loading && projects.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <strong>{projects.length}</strong> Completed Projects
                </span>
                <span className="flex items-center gap-1.5">
                  <FaServer className="text-neutral-400" />
                  <strong>{projects.filter((p) => p.deployLink).length}</strong> Live Deployments
                </span>
                <span className="flex items-center gap-1.5">
                  <FaLayerGroup className="text-neutral-400" />
                  <strong>{Math.max(1, categories.length - 1)}</strong> Technical Domains
                </span>
              </div>
            )}
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by project name, description, or technology..."
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    aria-label="Clear search"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>

              {/* Reset Filters when active */}
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Projects Content Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              // Skeleton Loader
              <div key="loading" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm animate-pulse flex flex-col"
                  >
                    <div className="h-52 bg-neutral-200 dark:bg-neutral-800" />
                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                      <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                        <div className="h-3 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded" />
                      </div>
                      <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error State
              <div
                key="error"
                className="max-w-md mx-auto text-center bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 shadow-sm space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xl">
                  <FaExclamationCircle />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Connection Error</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
                >
                  Reload Page
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              // Empty State
              <div
                key="empty"
                className="max-w-md mx-auto text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-10 shadow-sm space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center text-2xl">
                  <FaFolderOpen />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    No Matching Projects Found
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    No project records match your active search terms or category selection.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              // Projects Grid
              <div key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProjects.map((project) => {
                  const techList = project.technologies || project.techStack || [];
                  const categoryName = project.category || project.projectType?.category || 'Software Solution';
                  const isLive = project.status?.toLowerCase() === 'live' || project.status?.toLowerCase() === 'active';

                  return (
                    <div
                      key={project.id}
                      className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      {/* Image Preview Container */}
                      <div className="relative h-52 bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
                        {project.photoUrl ? (
                          <img
                            src={project.photoUrl}
                            alt={`${project.name} preview`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                            <FaCode className="text-3xl mb-2" />
                            <span className="text-xs font-mono">Software Architecture</span>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3.5 right-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${
                              isLive
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-neutral-900/80 text-white dark:bg-neutral-800/80'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isLive ? 'bg-white animate-pulse' : 'bg-neutral-400'
                              }`}
                            />
                            <span>{project.status || 'Completed'}</span>
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-3.5 left-3.5">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-900/80 text-white backdrop-blur-md">
                            {categoryName}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h2 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors line-clamp-1">
                            {project.name}
                          </h2>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            {project.shortDescription || project.description}
                          </p>
                        </div>

                        {/* Technologies Tags */}
                        {techList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {techList.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                              >
                                {tech}
                              </span>
                            ))}
                            {techList.length > 3 && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-neutral-500">
                                +{techList.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-2">
                          <Link
                            to={`/SGS-Projects/${project.id}`}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-xs flex items-center justify-center gap-2 text-center"
                          >
                            <span>Case Study</span>
                            <FaArrowRight className="text-[10px]" />
                          </Link>

                          {project.deployLink && (
                            <a
                              href={project.deployLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                              title="Open Live Deployment"
                              aria-label={`Open live deployment for ${project.name}`}
                            >
                              <FaExternalLinkAlt className="text-xs" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}