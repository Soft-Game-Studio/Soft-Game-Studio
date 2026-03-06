// ProjectDetailsPage.js - Premium Modern Redesign
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';

// Lucide React Icons (Professional & Modern)
import {
  ArrowLeft,
  Users,
  Globe,
  Calendar,
  Clock,
  Share2,
  Copy,
  CheckCircle,
  Code,
  Image as ImageIcon,
  Building,
  Mail,
  Crown,
  Layers,
  Monitor,
  Target,
  TrendingUp,
  FileText,
  ExternalLink,
  ChevronRight,
  Zap,
  Wrench,
  UserCheck,
  UserPlus,
  Github,
  Link2,
  AlertCircle,
} from 'lucide-react';
import {
  FaGithubSquare,
  FaUserClock,
  FaRegCopy,
  FaWhatsappSquare,
  FaFacebookSquare,
  FaLinkedinIn,
  FaTwitterSquare,
} from 'react-icons/fa';
import Layout from '../../components/layout/Layout';

// ----------------------------------------------------------------------
// Helper Components (for cleaner code)
// ----------------------------------------------------------------------

const StatusBadge = ({ status }) => {
  const statusMap = {
    completed: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: 'Completed',
    },
    active: {
      color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      icon: <Zap className="w-3.5 h-3.5" />,
      label: 'Active',
    },
    'in-progress': {
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      label: 'In Progress',
    },
    'on-hold': {
      color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'On Hold',
    },
    planned: {
      color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      icon: <Target className="w-3.5 h-3.5" />,
      label: 'Planned',
    },
    maintenance: {
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
      icon: <Wrench className="w-3.5 h-3.5" />,
      label: 'Maintenance',
    },
  };
  const info = statusMap[status?.toLowerCase()] || {
    color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700',
    icon: <FileText className="w-3.5 h-3.5" />,
    label: 'Unknown',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${info.color}`}>
      {info.icon}
      {info.label}
    </span>
  );
};

const CategoryBadge = ({ category }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 dark:border-blue-800">
    <Layers className="w-3.5 h-3.5" />
    {category || 'Web Development'}
  </span>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const QuickLink = ({ href, icon, title, subtitle, gradient }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
  >
    <div className={`p-2.5 rounded-lg ${gradient}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 dark:text-white truncate">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
    </div>
    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
  </a>
);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Monitor className="w-4 h-4" /> },
    { id: 'developers', label: 'Team', icon: <Users className="w-4 h-4" /> },
  ];

  // Fetch all project data
  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const projectDoc = await getDoc(doc(fireDB, 'sgsProjects', id));
      if (!projectDoc.exists()) {
        setError('Project not found');
        setProject(null);
        return;
      }

      const projectData = {
        id: projectDoc.id,
        ...projectDoc.data(),
        createdAt: projectDoc.data().createdAt?.toDate?.(),
        updatedAt: projectDoc.data().updatedAt?.toDate?.(),
      };
      setProject(projectData);

      // Fetch team members
      const assignmentsQuery = query(
        collection(fireDB, 'projectAssignments'),
        where('projectId', '==', id),
        where('status', '==', 'Active')
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const team = assignmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        assignedAt: doc.data().assignedAt?.toDate?.(),
      }));
      setTeamMembers(team);

      // Fetch project tasks (optional)
      const tasksQuery = query(
        collection(fireDB, 'projectTasks'),
        where('projectId', '==', id)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate?.(),
        createdAt: doc.data().createdAt?.toDate?.(),
      }));
      setProjectTasks(tasks);

      // Fetch related projects
      const projectsCollection = collection(fireDB, 'sgsProjects');
      const projectsSnapshot = await getDocs(projectsCollection);
      const allProjects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredProjects = allProjects
        .filter(p => p.id !== id && p.status === 'active')
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setRelatedProjects(filteredProjects);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProjectDetails();
  }, [id, fetchProjectDetails]);

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(d.getTime())) return 'Invalid Date';
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Date unavailable';
    }
  };

  const getLeadDevelopers = () => teamMembers.filter(m => m.roleInProject?.toLowerCase() === 'lead');
  const getActiveDevelopers = () => teamMembers.filter(m => m.status === 'Active' || !m.status);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Use a toast notification in a real app
    alert('Project link copied to clipboard!');
  };

  const handleShare = (platform) => {
    const text = `Check out "${project?.name}" – ${project?.shortDescription || project?.description?.substring(0, 100)}`;
    const url = window.location.href;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank');
  };

  // Loading Skeleton (Premium)
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="animate-pulse space-y-8">
              {/* Header skeleton */}
              <div className="flex items-center justify-between">
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              </div>
              {/* Title & badges */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>
                <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
              {/* Tabs */}
              <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              {/* Content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {error || 'Project Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Browse All Projects
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const leadDevelopers = getLeadDevelopers();
  const activeDevelopers = getActiveDevelopers();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header with back button and actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all"
              >
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="hidden sm:inline text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">Copy Link</span>
              </button>

              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  <FaGithubSquare className="w-4 h-4" />
                  <span className="font-medium">View Code</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </div>

          {/* Project header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <CategoryBadge category={project.category} />
                <StatusBadge status={project.status} />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(project.createdAt)}</p>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {project.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              {project.tagline || project.shortDescription || project.description?.substring(0, 200)}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-1.5 w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column (main content) */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'overview' && (
                <>
                  {/* Hero image */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
                    <img
                      src={project.photoUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                      alt={project.name}
                      className="w-full h-64 md:h-80 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Description card */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Project Details
                      </h2>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        Updated {formatDate(project.updatedAt || project.createdAt)}
                      </div>
                    </div>

                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed ${!showFullDescription && project.description?.length > 500 ? 'line-clamp-5' : ''}`}>
                        {project.description || 'No description available for this project.'}
                      </p>
                    </div>

                    {project.description?.length > 500 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-4 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
                      >
                        {showFullDescription ? 'Show Less' : 'Read More'}
                        <ChevronRight className={`w-4 h-4 transform transition-transform ${showFullDescription ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                      </button>
                    )}

                    {/* Highlights grid */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900 border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Objective</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {project.objective || 'To build a scalable and efficient solution that addresses user needs.'}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900 border border-emerald-100 dark:border-emerald-800/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Current Status</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {project.statusDescription || 'Development is progressing as planned.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Team preview (if any) */}
                  {teamMembers.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          Development Team
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                            <UserCheck className="w-3 h-3" />
                            {activeDevelopers.length} Active
                          </span>
                        </div>
                      </div>

                      {/* Lead developers */}
                      {leadDevelopers.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                            <Crown className="w-4 h-4 text-amber-500" />
                            Lead Developers
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {leadDevelopers.slice(0, 2).map(member => (
                              <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                                <img
                                  src={member.memberPhoto || `https://ui-avatars.com/api/?name=${member.memberName}&background=f59e0b&color=fff`}
                                  alt={member.memberName}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{member.memberName}</h4>
                                  <p className="text-sm text-amber-600 dark:text-amber-400">{member.roleInProject}</p>
                                  {member.department && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{member.department}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other team members */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Team Members</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {teamMembers.filter(m => !leadDevelopers.includes(m)).slice(0, 6).map(member => (
                            <div key={member.id} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                              <img
                                src={ `https://ui-avatars.com/api/?name=${member.memberName}&background=3b82f6&color=fff`}
                                alt={member.memberName}
                                className="w-10 h-10 rounded-lg object-cover mb-2"
                              />
                              <p className="font-medium text-sm text-gray-900 dark:text-white text-center truncate w-full">{member.memberName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{member.roleInProject || 'Developer'}</p>
                            </div>
                          ))}
                          {teamMembers.length > 6 && (
                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                                <UserPlus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">+{teamMembers.length - 6} more</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('developers')}
                        className="mt-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
                      >
                        View Full Team
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'developers' && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Development Team
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{teamMembers.length} team members</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        <Crown className="w-3 h-3" />
                        {leadDevelopers.length} Leads
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <UserCheck className="w-3 h-3" />
                        {activeDevelopers.length} Active
                      </span>
                    </div>
                  </div>

                  {teamMembers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Team Members</h3>
                      <p className="text-gray-500 dark:text-gray-400">Team information is not available for this project.</p>
                    </div>
                  ) : (
                    <>
                      {leadDevelopers.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-500" />
                            Lead Developers
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {leadDevelopers.map(member => (
                              <div key={member.id} className="flex items-start gap-4 p-5 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                                <img
                                  src={member.memberPhoto || `https://ui-avatars.com/api/?name=${member.memberName}&background=f59e0b&color=fff`}
                                  alt={member.memberName}
                                  className="w-14 h-14 rounded-xl object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 dark:text-white">{member.memberName}</h4>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                      {member.roleInProject}
                                    </span>
                                    {member.department && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                        {member.department}
                                      </span>
                                    )}
                                  </div>
                                  {member.memberEmail && (
                                    <a href={`mailto:${member.memberEmail}`} className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mt-3">
                                      <Mail className="w-3 h-3" />
                                      {member.memberEmail}
                                    </a>
                                  )}
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    Since {formatDate(member.assignedAt)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Team Members</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {teamMembers.filter(m => !leadDevelopers.includes(m)).map(member => (
                            <div key={member.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                              <div className="flex items-center gap-3">
                                <img
                                  src={member.memberPhoto || `https://ui-avatars.com/api/?name=${member.memberName}&background=3b82f6&color=fff`}
                                  alt={member.memberName}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">{member.memberName}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.roleInProject || 'Developer'}</p>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between text-xs">
                                <span className={member.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'}>
                                  {member.status || 'Active'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">{formatDate(member.assignedAt)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Project info card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Project Details</h3>
                <div className="space-y-4">
                  <InfoItem icon={<Calendar className="w-4 h-4" />} label="Created" value={formatDate(project.createdAt)} />
                  <InfoItem icon={<Clock className="w-4 h-4" />} label="Last Updated" value={formatDate(project.updatedAt || project.createdAt)} />
                  <InfoItem icon={<Code className="w-4 h-4" />} label="Project ID" value={project.id.substring(0, 8) + '...'} />
                  {project.client && <InfoItem icon={<Building className="w-4 h-4" />} label="Client" value={project.client} />}
                  {project.category && <InfoItem icon={<Layers className="w-4 h-4" />} label="Category" value={project.category} />}
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Quick Links</h3>
                <div className="space-y-3">
                  {project.sourceCode && (
                    <QuickLink
                      href={project.sourceCode}
                      icon={<FaGithubSquare className="w-5 h-5 text-white" />}
                      title="Source Code"
                      subtitle="View on GitHub"
                      gradient="bg-gray-900 dark:bg-gray-700"
                    />
                  )}
                  {project.deployLink && (
                    <QuickLink
                      href={project.deployLink}
                      icon={<Globe className="w-5 h-5 text-white" />}
                      title="Live Demo"
                      subtitle="Try it out now"
                      gradient="bg-blue-600"
                    />
                  )}
                  {project.documentation && (
                    <QuickLink
                      href={project.documentation}
                      icon={<FileText className="w-5 h-5 text-white" />}
                      title="Documentation"
                      subtitle="Read the docs"
                      gradient="bg-emerald-600"
                    />
                  )}
                  {project.photoUrl && (
                    <QuickLink
                      href={project.photoUrl}
                      icon={<ImageIcon className="w-5 h-5 text-white" />}
                      title="Project Image"
                      subtitle="View full size"
                      gradient="bg-purple-600"
                    />
                  )}
                </div>
              </div>

              {/* Development status */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Development Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Project Status</span>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Team Size</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">{teamMembers.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Tasks</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{projectTasks.length}</span>
                  </div>
                </div>
              </div>

              {/* Share project */}
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
                    <button
                      key={key}
                      onClick={() => handleShare(key)}
                      className={`p-3 ${bg} text-white rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95`}
                    >
                      <Icon className="text-lg" />
                      <span className="text-xs font-medium capitalize">{key}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <FaRegCopy className="text-sm" />
                  Copy Project Link
                </button>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Similar Projects</h2>
                <button
                  onClick={() => navigate('/SGS-Projects')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProjects.map(related => (
                  <div
                    key={related.id}
                    onClick={() => navigate(`/SGS-Projects/${related.id}`)}
                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:-translate-y-1"
                  >
                    <div className="h-40 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                      <img
                        src={related.photoUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={related.status} />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
                        {related.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {related.shortDescription || related.description?.substring(0, 100)}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{related.teamSize || 'Team'}</span>
                        </div>
                        <span>{formatDate(related.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-3">Interested in This Project?</h2>
                <p className="text-purple-100 mb-6 max-w-2xl">
                  Want to know more or have questions about the development process?
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/SGS-Projects')}
                    className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 hover:shadow-lg transition-all"
                  >
                    Browse More Projects
                  </button>
                  {project.deployLink && (
                    <a
                      href={project.deployLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                    >
                      Try Live Demo
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