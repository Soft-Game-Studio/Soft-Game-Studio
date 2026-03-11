// ProjectDetailsPage.jsx – Premium Modern Redesign (Public-Facing)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import Layout from '../../components/layout/Layout';

import {
  ArrowLeft,
  Globe,
  Calendar,
  Clock,
  Share2,
  Copy,
  CheckCircle,
  Code2,
  Layers,
  Monitor,
  Target,
  TrendingUp,
  FileText,
  ExternalLink,
  ChevronRight,
  Zap,
  Wrench,
  AlertCircle,
  Mail,
  Cpu,
  Sparkles,
} from 'lucide-react';
import {
  FaRegCopy,
  FaWhatsappSquare,
  FaFacebookSquare,
  FaLinkedinIn,
  FaTwitterSquare,
} from 'react-icons/fa';

// ───────────────────────── helpers ──────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    completed: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Completed' },
    active: { cls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', icon: <Zap className="w-3.5 h-3.5" />, label: 'Active' },
    'in-progress': { cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800', icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'In Progress' },
    'on-hold': { cls: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800', icon: <Clock className="w-3.5 h-3.5" />, label: 'On Hold' },
    planned: { cls: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800', icon: <Target className="w-3.5 h-3.5" />, label: 'Planned' },
    maintenance: { cls: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800', icon: <Wrench className="w-3.5 h-3.5" />, label: 'Maintenance' },
  };
  const info = map[status?.toLowerCase()] || { cls: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700', icon: <FileText className="w-3.5 h-3.5" />, label: status || 'Unknown' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${info.cls} transition-colors`}>
      {info.icon}{info.label}
    </span>
  );
};

const InfoRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white break-words">{value}</p>
      </div>
    </div>
  );
};

// ───────────────────────── main component ──────────────────────────

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // ── fetch only the single project document (no team / tasks queries) ──
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const snap = await getDoc(doc(fireDB, 'sgsProjects', id));
      if (!snap.exists()) { setError('Project not found'); return; }
      setProject({
        id: snap.id,
        ...snap.data(),
        createdAt: snap.data().createdAt?.toDate?.(),
        updatedAt: snap.data().updatedAt?.toDate?.(),
      });
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) fetchProject(); }, [id, fetchProject]);

  // ── utilities ──
  const fmt = (date) => {
    if (!date) return null;
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return isNaN(d.getTime()) ? null : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return null; }
  };

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const share = useCallback((platform) => {
    const text = `Check out "${project?.name}" – ${project?.shortDescription || project?.description?.substring(0, 120)}`;
    const url = window.location.href;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  }, [project]);

  // Build the "Get Source Code" contact link with pre-filled params
  const getSourceCodeLink = useMemo(() => {
    if (!project) return '/ContactUs';
    const params = new URLSearchParams({
      subject: 'Get Source Code',
      projectName: project.name || '',
      projectLink: project.deployLink || "No live url found",
      projecturl: window.location.href ||"no url found",
      projectDesc: project.shortDescription || project.description?.substring(0, 200) || '',
    });
    return `/ContactUs?${params.toString()}`;
  }, [project]);

  // ── loading skeleton ──
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="animate-pulse space-y-8">
              <div className="flex items-center justify-between">
                <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>
                <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── error state ──
  if (error || !project) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{error || 'Project Not Found'}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>
              <button onClick={() => navigate('/SGS-Projects')} className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                Browse All Projects
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── derived data (only compute what exists) ──
  const techStack = project.techStack?.length ? project.techStack : null;
  const features = project.features?.length ? project.features : null;
  const devInfo = project.developmentTime;
  const projType = project.projectType;
  const hasDescription = !!project.description?.trim();
  const hasImage = !!project.photoUrl;
  const hasLiveDemo = !!project.deployLink?.trim();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="container mx-auto px-4 py-8 max-w-6xl">

          {/* ─── Top bar ─── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-md">
              <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all">
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              {hasLiveDemo && (
                <a href={project.deployLink} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium">
                  <Globe className="w-4 h-4" />
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </div>

          {/* ─── Project header ─── */}
          <header className="mb-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                {projType?.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 dark:border-blue-800">
                    <Layers className="w-3.5 h-3.5" />{projType.category}
                  </span>
                )}
                <StatusBadge status={project.status} />
              </div>
              {fmt(project.createdAt) && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{fmt(project.createdAt)}</p>
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {project.name}
            </h1>
            {project.tagline || project.shortDescription ? (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">{project.tagline || project.shortDescription}</p>
            ) : null}
          </header>

          {/* ─── Main grid ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Hero image */}
              {hasImage && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 bg-gray-200 dark:bg-gray-800">
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                      <Monitor className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                  <img
                    src={project.photoUrl}
                    alt={project.name}
                    className={`w-full h-64 md:h-80 object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'; setImgLoaded(true); }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Description */}
              {hasDescription && (
                <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      About the Project
                    </h2>
                    {fmt(project.updatedAt || project.createdAt) && (
                      <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" /> Updated {fmt(project.updatedAt || project.createdAt)}
                      </span>
                    )}
                  </div>

                  <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed ${!showFullDesc && project.description.length > 400 ? 'line-clamp-5' : ''}`}>
                    {project.description}
                  </p>

                  {project.description.length > 400 && (
                    <button onClick={() => setShowFullDesc(!showFullDesc)} className="mt-4 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group">
                      {showFullDesc ? 'Show Less' : 'Read More'}
                      <ChevronRight className={`w-4 h-4 transition-transform ${showFullDesc ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                    </button>
                  )}

                  {/* Highlights */}
                  {(project.objective || project.statusDescription) && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.objective && (
                        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900 border border-blue-100 dark:border-blue-800/30">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30"><Target className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Objective</h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{project.objective}</p>
                        </div>
                      )}
                      {project.statusDescription && (
                        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900 border border-emerald-100 dark:border-emerald-800/30">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30"><CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Current Status</h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{project.statusDescription}</p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* Tech Stack */}
              {techStack && (
                <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Cpu className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    Technologies Used
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {techStack.map((tech, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-200 dark:from-violet-900/15 dark:to-purple-900/15 dark:text-violet-300 dark:border-violet-800/40 transition-colors hover:shadow-sm">
                        <Code2 className="w-3.5 h-3.5" />{tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Features */}
              {features && (
                <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                    Key Features
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                        <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* ── Right sidebar ── */}
            <aside className="space-y-6">

              {/* Get Source Code CTA */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-purple-800 dark:to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5" />
                    <h3 className="text-lg font-bold">Get Source Code</h3>
                  </div>
                  <p className="text-purple-100 text-sm mb-5 leading-relaxed">
                    Want the source code for this project? Submit a request and our team will get back to you via email.
                  </p>
                  <button
                    onClick={() => navigate(getSourceCodeLink)}
                    className="w-full py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Request Source Code
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Project Details</h3>
                <div className="space-y-4">
                  <InfoRow icon={<Calendar className="w-4 h-4" />} label="Created" value={fmt(project.createdAt)} />
                  <InfoRow icon={<Clock className="w-4 h-4" />} label="Last Updated" value={fmt(project.updatedAt)} />
                  {projType?.industry && <InfoRow icon={<Layers className="w-4 h-4" />} label="Industry" value={projType.industry} />}
                  {projType?.platform && <InfoRow icon={<Monitor className="w-4 h-4" />} label="Platform" value={projType.platform} />}
                  {devInfo?.duration && <InfoRow icon={<Clock className="w-4 h-4" />} label="Development Time" value={devInfo.duration} />}
                  {devInfo?.teamSize && <InfoRow icon={<Code2 className="w-4 h-4" />} label="Team Size" value={devInfo.teamSize} />}
                  {devInfo?.role && <InfoRow icon={<Target className="w-4 h-4" />} label="Role" value={devInfo.role} />}
                </div>
              </div>

              {/* Live Demo Quick Link */}
              {hasLiveDemo && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Quick Links</h3>
                  <a
                    href={project.deployLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                  >
                    <div className="p-2.5 rounded-lg bg-blue-600"><Globe className="w-5 h-5 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">Live Demo</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Try it out now</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </a>
                </div>
              )}

              {/* Development Status */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Project Status</span>
                    <StatusBadge status={project.status} />
                  </div>
                  {projType?.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Category</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{projType.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Share */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-5">
                  <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Project</h3>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { key: 'twitter', Icon: FaTwitterSquare, bg: 'bg-black hover:bg-gray-800' },
                    { key: 'linkedin', Icon: FaLinkedinIn, bg: 'bg-blue-700 hover:bg-blue-800' },
                    { key: 'facebook', Icon: FaFacebookSquare, bg: 'bg-blue-600 hover:bg-blue-700' },
                    { key: 'whatsapp', Icon: FaWhatsappSquare, bg: 'bg-green-500 hover:bg-green-600' },
                  ].map(({ key, Icon, bg }) => (
                    <button key={key} onClick={() => share(key)} className={`p-3 ${bg} text-white rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95`}>
                      <Icon className="text-lg" />
                      <span className="text-[10px] font-medium capitalize">{key}</span>
                    </button>
                  ))}
                </div>
                <button onClick={copyLink} className="w-full py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 text-sm">
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <FaRegCopy className="text-sm" />}
                  {copied ? 'Link Copied!' : 'Copy Project Link'}
                </button>
              </div>
            </aside>
          </div>

          {/* ─── Bottom CTA ─── */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Interested in This Project?</h2>
                <p className="text-purple-100 dark:text-gray-400 mb-6 max-w-2xl">
                  Want the source code or have questions about this project? Get in touch with our team.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => navigate(getSourceCodeLink)} className="px-6 py-3 bg-white text-purple-700 dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-100 hover:shadow-lg transition-all flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Request Source Code
                  </button>
                  <button onClick={() => navigate('/SGS-Projects')} className="px-6 py-3 bg-transparent border-2 border-white/80 text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                    Browse More Projects
                  </button>
                  {hasLiveDemo && (
                    <a href={project.deployLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-transparent border-2 border-white/80 text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Try Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}