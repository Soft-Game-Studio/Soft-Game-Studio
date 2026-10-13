/**
 * SGSProjectDetaisl.jsx: Soft Game Studio Engineering Project Case Study
 *
 * Production-grade technical case study page implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, zero emoji icons
 * - Technical SEO: react-helmet-async with SoftwareApplication JSON-LD structured data
 * - Responsive 2-Column Grid: Architecture visual, comprehensive documentation, specs sidebar
 * - Dynamic Source Code Request: Automated pre-filled query routing to Contact portal
 * - Social Discovery: Native sharing and clipboard integration without em dashes
 */

/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import Layout from '../../components/layout/Layout';
import {
  FaArrowLeft,
  FaGlobe,
  FaCalendarAlt,
  FaClock,
  FaShareAlt,
  FaCheckCircle,
  FaCode,
  FaLayerGroup,
  FaLaptopCode,
  FaBullseye,
  FaFileAlt,
  FaExternalLinkAlt,
  FaChevronRight,
  FaChevronDown,
  FaWrench,
  FaEnvelope,
  FaMicrochip,
  FaCheck,
  FaCopy,
  FaExclamationCircle,
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaServer,
  FaUsers
} from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const map = {
    completed: {
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
      label: 'Completed',
    },
    live: {
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
      label: 'Live Deployment',
    },
    active: {
      cls: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800',
      label: 'Active Development',
    },
    'in-progress': {
      cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
      label: 'In Progress',
    },
    'on-hold': {
      cls: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      label: 'On Hold',
    },
    planned: {
      cls: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      label: 'Planned',
    },
    maintenance: {
      cls: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800',
      label: 'Maintenance',
    },
  };

  const key = status?.toLowerCase() || 'completed';
  const info = map[key] || {
    cls: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
    label: status || 'Completed',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${info.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{info.label}</span>
    </span>
  );
};

// Metadata Row Component
const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex-shrink-0">
        {Icon && <Icon className="text-xs" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
};

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Fetch Project by Document ID with unmount safety
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const snap = await getDoc(doc(fireDB, 'sgsProjects', id));
      if (!snap.exists()) {
        setError('Project case study could not be found.');
        return;
      }
      const data = snap.data();
      setProject({
        id: snap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      });
    } catch (err) {
      console.error('[SGS Project Details] Error fetching project:', err);
      setError('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProject();
  }, [id, fetchProject]);

  const formatDate = useCallback((date) => {
    if (!date) return null;
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return isNaN(d.getTime())
        ? null
        : d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
    } catch {
      return null;
    }
  }, []);

  const copyLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy case study link:', url);
    }
  }, []);

  const share = useCallback(
    (platform) => {
      const title = project?.name || 'SGS Project';
      const desc = project?.shortDescription || project?.description?.substring(0, 100) || '';
      const text = `Explore "${title}": ${desc}`;
      const url = window.location.href;

      const shareTargets = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      };

      if (shareTargets[platform]) {
        window.open(shareTargets[platform], '_blank', 'noopener,noreferrer');
      }
    },
    [project]
  );

  // Pre-filled source code contact link
  const getSourceCodeLink = useMemo(() => {
    if (!project) return '/ContactUs';
    const params = new URLSearchParams({
      subject: 'Get Source Code',
      projectName: project.name || '',
      projectLink: project.deployLink || 'No live url found',
      projecturl: typeof window !== 'undefined' ? window.location.href : '',
      projectDesc: project.shortDescription || project.description?.substring(0, 200) || '',
    });
    return `/ContactUs?${params.toString()}`;
  }, [project]);

  // Structured Data JSON-LD
  const structuredData = useMemo(() => {
    if (!project) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.name,
      description: project.shortDescription || project.description,
      applicationCategory: project.category || project.projectType?.category || 'DeveloperApplication',
      operatingSystem: project.projectType?.platform || 'Web',
      url: `https://softgamestudios.web.app/SGS-Projects/${project.id}`,
      author: {
        '@type': 'Organization',
        name: 'Soft Game Studio',
        url: 'https://softgamestudios.web.app',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  }, [project]);

  // Loading Skeleton State
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-9 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-9 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              <div className="h-10 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-5 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="h-72 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
                <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
                <div className="h-44 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error State
  if (error || !project) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors py-24 px-4">
          <div className="max-w-md mx-auto text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl">
              <FaExclamationCircle />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              {error || 'Project Not Found'}
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The project you requested is not available or may have been unlisted from the public portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                onClick={() => navigate('/SGS-Projects')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
              >
                Browse All Projects
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const techStack = project.techStack?.length ? project.techStack : project.technologies?.length ? project.technologies : null;
  const features = project.features?.length ? project.features : null;
  const devInfo = project.developmentTime;
  const projType = project.projectType;
  const hasDescription = Boolean(project.description?.trim());
  const hasImage = Boolean(project.photoUrl);
  const hasLiveDemo = Boolean(project.deployLink?.trim());
  const currentUrl = `https://softgamestudios.web.app/SGS-Projects/${project.id}`;

  return (
    <Layout>
      <Helmet>
        <title>{project.name} | Soft Game Studio Portfolio Case Study</title>
        <meta
          name="description"
          content={project.shortDescription || project.description?.substring(0, 155) || 'Case study by Soft Game Studio.'}
        />
        <meta property="og:title" content={`${project.name} | Soft Game Studio`} />
        <meta
          property="og:description"
          content={project.shortDescription || project.description?.substring(0, 155) || ''}
        />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        {project.photoUrl && <meta property="og:image" content={project.photoUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.name} | Soft Game Studio`} />
        {structuredData && <script type="application/ld+json">{structuredData}</script>}
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Top Breadcrumbs & Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/SGS-Projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-xs" /> Back to Projects Directory
            </Link>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Copy case study link"
              >
                {copied ? <FaCheck className="text-emerald-500 text-xs" /> : <FaCopy className="text-xs" />}
                <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
              </button>

              {hasLiveDemo && (
                <a
                  href={project.deployLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-xs"
                >
                  <FaGlobe className="text-xs" />
                  <span>Live Demo</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              )}
            </div>
          </div>

          {/* Project Title Header */}
          <header className="space-y-3 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(project.category || projType?.category) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                    <FaLayerGroup className="text-neutral-400 text-[10px]" />
                    {project.category || projType?.category}
                  </span>
                )}
                <StatusBadge status={project.status} />
              </div>

              {formatDate(project.createdAt) && (
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  Published: {formatDate(project.createdAt)}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
              {project.name}
            </h1>

            {(project.tagline || project.shortDescription) && (
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
                {project.tagline || project.shortDescription}
              </p>
            )}
          </header>

          {/* Main 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Documentation & Specs */}
            <div className="lg:col-span-8 space-y-8">
              {/* Architecture Visual / Image Preview */}
              {hasImage && (
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-video shadow-sm">
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-400 animate-pulse">
                      <FaLaptopCode className="text-4xl" />
                    </div>
                  )}
                  <img
                    src={project.photoUrl}
                    alt={`${project.name} system preview`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setImgLoaded(true);
                    }}
                  />
                </div>
              )}

              {/* Detailed Description */}
              {hasDescription && (
                <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <FaFileAlt className="text-neutral-500 text-sm" />
                      <span>About the Project</span>
                    </h2>
                    {formatDate(project.updatedAt || project.createdAt) && (
                      <span className="text-[11px] font-mono text-neutral-400">
                        Updated {formatDate(project.updatedAt || project.createdAt)}
                      </span>
                    )}
                  </div>

                  <div className={`text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed ${
                    !showFullDesc && project.description.length > 500 ? 'line-clamp-6' : ''
                  }`}>
                    {project.description}
                  </div>

                  {project.description.length > 500 && (
                    <button
                      type="button"
                      onClick={() => setShowFullDesc((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:underline cursor-pointer pt-1"
                    >
                      <span>{showFullDesc ? 'Show Less' : 'Read Full Overview'}</span>
                      {showFullDesc ? <FaChevronDown className="rotate-180 text-[10px]" /> : <FaChevronRight className="text-[10px]" />}
                    </button>
                  )}

                  {/* Highlights Grid */}
                  {(project.objective || project.statusDescription) && (
                    <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {project.objective && (
                        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1.5">
                          <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                            <FaBullseye className="text-neutral-500 text-sm" />
                            <span>Primary Objective</span>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {project.objective}
                          </p>
                        </div>
                      )}
                      {project.statusDescription && (
                        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-1.5">
                          <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                            <FaCheckCircle className="text-emerald-500 text-sm" />
                            <span>Current Milestone</span>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {project.statusDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* Technologies Used */}
              {techStack && (
                <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <FaMicrochip className="text-neutral-500 text-sm" />
                    <span>Technologies & Architecture Stack</span>
                  </h2>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                      >
                        <FaCode className="text-[10px] text-neutral-400" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* System Features */}
              {features && (
                <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <FaCheckCircle className="text-neutral-500 text-sm" />
                    <span>Key Features & Capabilities</span>
                  </h2>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-xs text-neutral-700 dark:text-neutral-300"
                      >
                        <FaCheck className="text-emerald-500 text-xs mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Right Column: Sidebar Specs & Actions */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Request Source Code Card */}
              <div className="bg-neutral-900 text-white dark:bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-neutral-400 text-sm" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Source Code Inquiries
                  </h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Interested in licensing the source repository, API contracts, or technical integration documentation for this deployment? Submit an inquiry to our engineering team.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(getSourceCodeLink)}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-neutral-900 bg-white hover:bg-neutral-100 dark:text-neutral-950 dark:bg-white dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Request Source Code</span>
                  <FaChevronRight className="text-[10px]" />
                </button>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  Project Specifications
                </h3>

                <div className="space-y-1">
                  <InfoRow icon={FaCalendarAlt} label="Date Published" value={formatDate(project.createdAt)} />
                  <InfoRow icon={FaClock} label="Last Updated" value={formatDate(project.updatedAt)} />
                  {projType?.industry && <InfoRow icon={FaLayerGroup} label="Industry Sector" value={projType.industry} />}
                  {projType?.platform && <InfoRow icon={FaLaptopCode} label="Deployment Platform" value={projType.platform} />}
                  {devInfo?.duration && <InfoRow icon={FaClock} label="Development Cycle" value={devInfo.duration} />}
                  {devInfo?.teamSize && <InfoRow icon={FaUsers} label="Engineering Team" value={devInfo.teamSize} />}
                  {devInfo?.role && <InfoRow icon={FaBullseye} label="Studio Role" value={devInfo.role} />}
                </div>
              </div>

              {/* Live Deployment Link Card if available */}
              {hasLiveDemo && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                    Live Environment
                  </h3>
                  <a
                    href={project.deployLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-center justify-between gap-3 transition-colors block"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <FaGlobe className="text-neutral-500 text-sm flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">Open Live Demo</p>
                        <p className="text-[11px] text-neutral-500 truncate">{project.deployLink}</p>
                      </div>
                    </div>
                    <FaExternalLinkAlt className="text-xs text-neutral-400 flex-shrink-0" />
                  </a>
                </div>
              )}

              {/* Social Sharing Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <FaShareAlt className="text-neutral-500 text-xs" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Share Case Study
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => share('twitter')}
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
                    title="Share on X (Twitter)"
                    aria-label="Share on X"
                  >
                    <FaTwitter className="text-xs text-neutral-800 dark:text-neutral-200" />
                  </button>

                  <button
                    type="button"
                    onClick={() => share('linkedin')}
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
                    title="Share on LinkedIn"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedinIn className="text-xs text-neutral-800 dark:text-neutral-200" />
                  </button>

                  <button
                    type="button"
                    onClick={() => share('facebook')}
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
                    title="Share on Facebook"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF className="text-xs text-neutral-800 dark:text-neutral-200" />
                  </button>

                  <button
                    type="button"
                    onClick={() => share('whatsapp')}
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-xs text-neutral-800 dark:text-neutral-200" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={copyLink}
                  className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <FaCheck className="text-emerald-500 text-xs" /> : <FaCopy className="text-xs" />}
                  <span>{copied ? 'Link Copied' : 'Copy Direct Link'}</span>
                </button>
              </div>
            </aside>
          </div>

          {/* Bottom Inquiries CTA */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Interested in Custom Engineering?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                Our team architectures web applications, game engines, and production backend services. Let us discuss your product specifications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(getSourceCodeLink)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-xs"
              >
                Inquire About Source Code
              </button>
              <Link
                to="/SGS-Projects"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Browse All Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}