// ProjectDetailsPage.js - Professional Modern Design
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
} from 'lucide-react';
import { FaGithubSquare, FaUserClock, FaRegCopy, FaWhatsappSquare, FaFacebookSquare, FaLinkedinIn, FaTwitterSquare } from 'react-icons/fa';
import Layout from '../../components/layout/Layout';

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

  // Tabs configuration for users
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Monitor className="w-4 h-4" /> },
    { id: 'developers', label: 'Team', icon: <Users className="w-4 h-4" /> },
  ];

  // Fetch all project data
  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project
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
        assignedAt: doc.data().assignedAt?.toDate?.()
      }));
      setTeamMembers(team);

      // Fetch project tasks
      const tasksQuery = query(
        collection(fireDB, 'projectTasks'),
        where('projectId', '==', id)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate?.(),
        createdAt: doc.data().createdAt?.toDate?.()
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
    if (id) {
      fetchProjectDetails();
    }
  }, [id, fetchProjectDetails]);

  // Format date function
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(d.getTime())) return 'Invalid Date';
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Date unavailable';
    }
  };


  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusMap = {
      'completed': {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completed',
        description: 'Project is fully developed and deployed'
      },
      'active': {
        color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        icon: <Zap className="w-4 h-4" />,
        label: 'Active',
        description: 'Currently under active development'
      },
      'in-progress': {
        color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'In Progress',
        description: 'Development is ongoing'
      },
      'on-hold': {
        color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
        icon: <Clock className="w-4 h-4" />,
        label: 'On Hold',
        description: 'Development temporarily paused'
      },
      'planned': {
        color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
        icon: <Target className="w-4 h-4" />,
        label: 'Planned',
        description: 'In planning phase'
      },
      'maintenance': {
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
        icon: <Wrench className="w-4 h-4" />,
        label: 'Maintenance',
        description: 'Regular updates and maintenance'
      }
    };
    return statusMap[status?.toLowerCase()] || {
      color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-black',
      icon: <FileText className="w-4 h-4" />,
      label: 'Unknown',
      description: 'Status information unavailable'
    };
  };

  // Get lead developers
  const getLeadDevelopers = () => {
    return teamMembers.filter(member =>
      member.roleInProject === 'lead' ||
      member.roleInProject === 'Lead'
    );
  };

  // Get active developers
  const getActiveDevelopers = () => {
    return teamMembers.filter(member =>
      member.status === 'Active' ||
      !member.status // If no status, assume active
    );
  };



  // Handle share
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Project link copied to clipboard!');
  };

  const handleShare = (platform) => {
    const text = `Check out "${project?.name}" - ${project?.shortDescription || project?.description?.substring(0, 100)}`;
    const url = window.location.href;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  // Render loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-96 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-2xl"></div>
                  <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-3">
            {error || 'Project Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gradient-to-r from-gray-950 to-gray-700 text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="px-6 py-3 border-2 border-gray-950 text-gray-950 dark:border-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-black/50 transition-all duration-200"
            >
              Browse All Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(project.status);
  const leadDevelopers = getLeadDevelopers();
  const activeDevelopers = getActiveDevelopers();


  return (
    <Layout>
 <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-950 dark:to-black/90">
      {/* Header */}
    

      <div className="container mx-auto px-4 py-8">
           <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-950 dark:group-hover:text-white">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Link</span>
              </button>

              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-950 to-gray-700 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <FaGithubSquare className="w-4 h-4" />
                  <span className="font-medium">View Code</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </div>
      </div>
        <div className="max-w-7xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {project.category || 'Web Development'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-950 dark:text-white mb-2">
                  {project.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl">
                  {project.tagline || project.shortDescription || project.description?.substring(0, 200)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                  <p className="font-medium text-gray-950 dark:text-white">{formatDate(project.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 dark:bg-black rounded-2xl p-1.5 max-w-md">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-white dark:bg-gray-950 text-gray-950 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {/* Project Hero Image */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-black">
                    <img
                      src={project.photoUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                      alt={project.name}
                      className="w-full h-64 md:h-80 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Project Description Card */}
                  <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-black">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-950 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Project Details
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        Updated {formatDate(project.updatedAt || project.createdAt)}
                      </div>
                    </div>

                    <div className="relative">
                      <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed ${!showFullDescription && project.description?.length > 500 ? 'line-clamp-5' : ''
                        }`}>
                        {project.description || 'No description available for this project.'}
                      </p>

                      {project.description?.length > 500 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="mt-4 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
                        >
                          {showFullDescription ? 'Show Less' : 'Read More'}
                          <ChevronRight className={`w-4 h-4 transform transition-transform ${showFullDescription ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                        </button>
                      )}
                    </div>

                    {/* Project Highlights Grid */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-950 border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-gray-950 dark:text-white">Objective</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {project.objective || 'To build a scalable and efficient solution that addresses user needs.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-950 border border-emerald-100 dark:border-emerald-800/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="font-semibold text-gray-950 dark:text-white">Current Status</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {statusInfo.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Development Team Preview */}
                  {teamMembers.length > 0 && (
                    <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-black">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-950 dark:text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          Development Team
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                            <UserCheck className="w-3 h-3" />
                            {activeDevelopers.length} Active
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lead Developers */}
                        {leadDevelopers.length > 0 && (
                          <div>
                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                              <Crown className="w-4 h-4 text-amber-500" />
                              Lead Developers
                            </h3>
                            <div className="space-y-3">
                              {leadDevelopers.slice(0, 2).map(member => (
                                <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-950 border border-amber-100 dark:border-amber-800/30">
                                  <div className="relative">
                                    <img
                                      src={member.memberPhoto || `https://ui-avatars.com/api/?name=${member.memberName}&background=f59e0b&color=fff`}
                                      alt={member.memberName}
                                      className="w-14 h-14 rounded-xl object-cover"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950">
                                      <Crown className="w-3 h-3 text-white" />
                                    </div>
                                  </div>

                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-950 dark:text-white">{member.memberName}</h4>
                                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                      {member.roleInProject?.toUpperCase()}
                                    </p>
                                    {member.department && (
                                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{member.department?.toUpperCase()}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Active Developers */}
                        <div>
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Active Contributors</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {activeDevelopers.slice(0, 6).map(member => (
                              <div key={member.id} className="group p-3 rounded-xl bg-gray-50 dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-200">
                                <div className="flex flex-col items-center text-center">
                                  <img
                                    src={member.memberPhoto || `https://ui-avatars.com/api/?name=${member.memberName}&background=3b82f6&color=fff`}
                                    alt={member.memberName}
                                    className="w-10 h-10 rounded-lg object-cover mb-2 group-hover:scale-105 transition-transform"
                                  />
                                  <div>
                                    <h4 className="font-medium text-gray-950 dark:text-white text-sm truncate">{member.memberName.split(' ')[0]}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.roleInProject?.toUpperCase() || 'Lead Developer'}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {activeDevelopers.length > 6 && (
                              <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-white dark:from-black dark:to-gray-950 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                                  <UserPlus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  +{activeDevelopers.length - 6} more
                                </span>
                              </div>
                            )}
                          </div>
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

              {/* Developers Tab */}
              {activeTab === 'developers' && (
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-black">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-950 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Development Team
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {teamMembers.length} team members
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        <Crown className="w-3 h-3" />
                        {leadDevelopers.length} Leads
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <UserCheck className="w-3 h-3" />
                        {activeDevelopers.length} Active
                      </span>
                    </div>
                  </div>

                  {teamMembers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No Team Members
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Team information is not available for this project.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Lead Developers Section */}
                      {leadDevelopers.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-4 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-500" />
                            Lead Developers
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {leadDevelopers.map(member => (
                              <div key={member.id} className="p-5 rounded-xl bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-950 border border-amber-200 dark:border-amber-800/50">
                                <div className="flex items-start gap-4">
                                  <div className="relative">
                                    <img
                                      src={member.memberPhoto || `https://ui-avatars.com/api/?name=${member.memberName}&background=f59e0b&color=fff`}
                                      alt={member.memberName}
                                      className="w-16 h-16 rounded-xl object-cover border-2 border-amber-300 dark:border-amber-700"
                                    />
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h4 className="font-bold text-gray-950 dark:text-white">{member.memberName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            {member.roleInProject?.toUpperCase() || 'Lead Developer'}
                                          </span>
                                          {member.department && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                              {member.department?.toUpperCase()}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-amber-100 dark:border-amber-800/30">
                                      {member.memberEmail && (
                                        <a href={`mailto:${member.memberEmail}`}
                                          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                          <Mail className="w-3 h-3" />
                                          Email
                                        </a>
                                      )}
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-3 h-3 inline mr-1" />
                                        Since: {formatDate(member.assignedAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* All Team Members */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-4">All Team Members</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {teamMembers
                            .filter(member => !leadDevelopers.some(lead => lead.id === member.id))
                            .map(member => (
                              <div key={member.id} className="p-4 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={member.memberPhoto || `https://ui-avatars.com/api/?name=${member.memberName}&background=3b82f6&color=fff`}
                                    alt={member.memberName}
                                    className="w-12 h-12 rounded-xl object-cover"
                                  />

                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-950 dark:text-white truncate">{member.memberName}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                        {member.roleInProject?.toUpperCase() || 'Developer'}
                                      </span>
                                      {member.department && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                          {member.department?.toUpperCase()}
                                        </span>
                                      )}
                                    </div>

                                    {member.memberEmail && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                                        {member.memberEmail}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <span className="text-xs">
                                    {member.status === 'Active' ? (
                                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                        <UserCheck className="w-3 h-3" />
                                        Active
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-gray-500">
                                        <FaUserClock className="w-3 h-3" />
                                        Inactive
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(member.assignedAt)}
                                  </span>
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

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Project Quick Info Card */}
              <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-black">
                <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-6">Project Details</h3>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created Date</p>
                      <p className="font-medium text-gray-950 dark:text-white">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                      <p className="font-medium text-gray-950 dark:text-white">
                        {formatDate(project.updatedAt || project.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-black">
                      <Code className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Project ID</p>
                      <p className="font-medium text-gray-950 dark:text-white font-mono text-sm">
                        {project.id.substring(0, 8)}...
                      </p>
                    </div>
                  </div>

                  {project.client && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Building className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                        <p className="font-medium text-gray-950 dark:text-white">
                          {project.client}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.category && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                        <p className="font-medium text-gray-950 dark:text-white">
                          {project.category}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-black">
                <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-6">Quick Links</h3>

                <div className="space-y-3">
                  {project.sourceCode && (
                    <a
                      href={project.sourceCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="p-2.5 rounded-lg bg-gradient-to-r from-gray-950 to-gray-700 group-hover:from-black group-hover:to-gray-600">
                        <FaGithubSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-950 dark:text-white truncate">Source Code</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          View on GitHub
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </a>
                  )}

                  {project.deployLink && (
                    <a
                      href={project.deployLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="p-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-950 dark:text-white truncate">Live Demo</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          Try it out now
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-500" />
                    </a>
                  )}

                  {project.documentation && (
                    <a
                      href={project.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="p-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-950 dark:text-white truncate">Documentation</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          Read the docs
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-emerald-500" />
                    </a>
                  )}

                  {project.photoUrl && (
                    <a
                      href={project.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-950 dark:text-white truncate">Project Image</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          View full size
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-500" />
                    </a>
                  )}
                </div>
              </div>

              {/* Development Status Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50">
                <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-6">Development Status</h3>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Project Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Team Size</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-950 dark:text-white">{teamMembers.length} members</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Tasks</span>
                    <span className="font-semibold text-gray-950 dark:text-white">{projectTasks.length} total</span>
                  </div>
                </div>
              </div>

              {/* Share Project Card */}
              <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-black">

                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                  <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
                    Share Project
                  </h3>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    {
                      key: "twitter",
                      label: "Twitter",
                      Icon: FaTwitterSquare,
                      bg: "bg-black hover:bg-gray-950",
                    },
                    {
                      key: "linkedin",
                      label: "LinkedIn",
                      Icon: FaLinkedinIn,
                      bg: "bg-blue-700 hover:bg-blue-800",
                    },
                    {
                      key: "facebook",
                      label: "Facebook",
                      Icon: FaFacebookSquare,
                      bg: "bg-blue-600 hover:bg-blue-700",
                    },
                    {
                      key: "whatsapp",
                      label: "WhatsApp",
                      Icon: FaWhatsappSquare,
                      bg: "bg-green-500 hover:bg-green-600",
                    },
                  ].map(({ key, label, Icon, bg }) => (
                    <button
                      key={key}
                      onClick={() => handleShare(key)}
                      className={`p-3 ${bg} text-white rounded-xl 
          flex flex-col items-center justify-center gap-1.5
          transition-all duration-200
          hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      <Icon className="text-lg" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 rounded-xl font-medium
      bg-gray-100 dark:bg-black
      text-gray-700 dark:text-gray-300
      hover:bg-gray-200 dark:hover:bg-gray-700
      transition-all duration-200
      flex items-center justify-center gap-2"
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
                <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                  Similar Projects
                </h2>
                <button
                  onClick={() => navigate('/SGS-Projects')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProjects.map((relatedProject) => {
                  const relatedStatusInfo = getStatusInfo(relatedProject.status);
                  return (
                    <div
                      key={relatedProject.id}
                      onClick={() => navigate(`/SGS-Projects/${relatedProject.id}`)}
                      className="group bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 dark:border-black hover:border-gray-300 dark:hover:border-gray-700 hover:translate-y-[-2px]"
                    >
                      <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-black relative overflow-hidden">
                        <img
                          src={relatedProject.photoUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={relatedProject.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${relatedStatusInfo.color}`}>
                            {relatedStatusInfo.icon}
                            {relatedStatusInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                          {relatedProject.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                          {relatedProject.shortDescription || relatedProject.description?.substring(0, 100)}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-black">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Users className="w-3 h-3" />
                            <span>{relatedProject.teamSize || 'Team'}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(relatedProject.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-gray-950 dark:to-black rounded-2xl p-8 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-3">Interested in This Project?</h2>
                <p className="text-gray-300 mb-6 max-w-2xl">
                  Want to know more or have questions about the development process?
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/SGS-Projects')}
                    className="px-6 py-3 bg-white text-gray-950 rounded-xl font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-200"
                  >
                    Browse More Projects
                  </button>

                  {project.deployLink && (
                    <a
                      href={project.deployLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
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
    </div>
    </Layout>
   
  );
}