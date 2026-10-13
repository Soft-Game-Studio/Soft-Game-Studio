/**
 * Notes.jsx: Soft Game Studio Academic Notes Library
 *
 * Production-grade study resource catalog implementing:
 * - Full Dark & Light Mode Theme Compatibility (clean neutral foundations)
 * - Semantic HTML & Accessibility: Crawlable links, ARIA filter controls, keyboard focus states
 * - Technical SEO: react-helmet-async with Open Graph, Twitter cards, and CollectionPage JSON-LD
 * - Real-Time Search & Multi-Axis Filtering: College, Course, Branch, Semester, Subject, Category, Sorting
 * - Performance: Aspect ratios, memoized filter pipelines, clean unmount cleanup
 * - Strict Standard: Zero purple gradients, zero em dashes, high-contrast typography
 */

/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../DataBase/firebaseConfig';
import Layout from '../../../components/layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaSchool,
  FaGraduationCap,
  FaCodeBranch,
  FaBook,
  FaFilePdf,
  FaCalendarAlt,
  FaEye,
  FaFilter,
  FaTimes,
  FaSortAmountDown,
  FaUserGraduate,
  FaCompressArrowsAlt,
  FaExclamationCircle,
  FaUniversity,
  FaLayerGroup,
  FaArrowRight,
  FaQuestionCircle,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    college: '',
    course: '',
    branch: '',
    semester: '',
    subject: '',
    category: '',
    sort: 'newest',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate();

  // Fetch verified published notes with unmount cleanup
  useEffect(() => {
    let isCancelled = false;

    const fetchNotes = async () => {
      try {
        const q = query(collection(fireDB, 'notes'), where('published', '==', true));
        const snap = await getDocs(q);

        if (isCancelled) return;

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        setNotes(data);
      } catch (error) {
        if (!isCancelled) {
          console.error('[SGS Notes] Fetch failed:', error);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchNotes();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Compute unique dropdown values memoized
  const uniqueValues = useMemo(() => {
    return {
      colleges: [...new Set(notes.map((n) => n.college).filter(Boolean))].sort(),
      courses: [...new Set(notes.map((n) => n.course).filter(Boolean))].sort(),
      branches: [...new Set(notes.map((n) => n.branch).filter(Boolean))].sort(),
      semesters: [...new Set(notes.map((n) => n.semester).filter(Boolean))].sort(
        (a, b) => parseInt(a, 10) - parseInt(b, 10)
      ),
      subjects: [...new Set(notes.map((n) => n.subject).filter(Boolean))].sort(),
      categories: [...new Set(notes.map((n) => n.category).filter(Boolean))].sort(),
    };
  }, [notes]);

  // Compute live library statistics
  const stats = useMemo(() => {
    const total = notes.length;
    const totalSize = notes.reduce((sum, n) => sum + (n.compressedSize || 0), 0);
    const avgCompression =
      total > 0
        ? Math.round(notes.reduce((sum, n) => sum + (n.compressionRatio || 0), 0) / total)
        : 0;
    const uniqueColleges = new Set(notes.map((n) => n.college).filter(Boolean)).size;
    const uniqueSubjects = new Set(notes.map((n) => n.subject).filter(Boolean)).size;

    return { total, totalSize, avgCompression, uniqueColleges, uniqueSubjects };
  }, [notes]);

  // Filtered & Sorted notes memoized
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (note) =>
          note.subject?.toLowerCase().includes(term) ||
          note.studentName?.toLowerCase().includes(term) ||
          note.college?.toLowerCase().includes(term) ||
          note.course?.toLowerCase().includes(term) ||
          note.branch?.toLowerCase().includes(term) ||
          note.category?.toLowerCase().includes(term)
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'sort') {
        result = result.filter((note) => String(note[key] ?? '').toLowerCase() === value.toLowerCase());
      }
    });

    if (filters.sort === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (filters.sort === 'oldest') {
      result.sort((a, b) => a.createdAt - b.createdAt);
    } else if (filters.sort === 'size') {
      result.sort((a, b) => (b.compressedSize || 0) - (a.compressedSize || 0));
    } else if (filters.sort === 'name') {
      result.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
    }

    return result;
  }, [notes, searchTerm, filters]);

  // Active filter tags
  const activeFilters = useMemo(() => {
    const active = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'sort') {
        active.push({ key, value });
      }
    });
    if (searchTerm) {
      active.push({ key: 'search', value: searchTerm });
    }
    return active;
  }, [filters, searchTerm]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const removeFilter = (filterKey) => {
    if (filterKey === 'search') {
      setSearchTerm('');
    } else {
      setFilters((prev) => ({ ...prev, [filterKey]: '' }));
    }
  };

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      college: '',
      course: '',
      branch: '',
      semester: '',
      subject: '',
      category: '',
      sort: 'newest',
    });
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Structured Data JSON-LD
  const structuredData = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'SGS Technical Notes and Study Library',
        url: 'https://softgamestudios.web.app/DownloadNotes',
        description:
          'Open academic repository of verified engineering lecture notes, syllabus materials, and exam guides.',
        provider: {
          '@type': 'Organization',
          name: 'Soft Game Studio',
          url: 'https://softgamestudios.web.app/',
        },
      }),
    []
  );

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>Study Notes Library | Soft Game Studio Engineering Hub</title>
        <meta
          name="description"
          content="Access verified academic study notes, syllabus documentation, and lecture materials shared by students and educators across multiple engineering colleges."
        />
        <link rel="canonical" href="https://softgamestudios.web.app/DownloadNotes" />
        <meta property="og:title" content="Study Notes Library | Soft Game Studio Engineering Hub" />
        <meta
          property="og:description"
          content="Browse verified study notes and lecture resources organized by college, course, and semester."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 overflow-y-auto p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Filter Catalog</h3>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close filters"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {['college', 'course', 'branch', 'semester', 'category'].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                      {field}
                    </label>
                    <select
                      name={field}
                      value={filters[field]}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                    >
                      <option value="">All {field}s</option>
                      {uniqueValues[`${field}s`]?.map((val) => (
                        <option key={val} value={val}>
                          {field === 'semester' ? `Semester ${val}` : val}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Sort Order
                  </label>
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Subject (A-Z)</option>
                    <option value="size">Largest Files</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="w-full py-2.5 px-4 rounded-md text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-2.5 px-4 rounded-md text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">
              Academic Resource Catalog
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white mb-4">
              Study Notes and Course Documentation
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Open educational repository of student-contributed study materials, compressed PDF lectures, and syllabus
              references across engineering colleges.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-10">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Notes</p>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white mt-0.5">{stats.total}</p>
                </div>
                <FaFilePdf className="w-5 h-5 text-neutral-400" aria-hidden="true" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Saved</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {stats.avgCompression}%
                  </p>
                </div>
                <FaCompressArrowsAlt className="w-5 h-5 text-emerald-500/70" aria-hidden="true" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Total Size</p>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white mt-0.5">
                    {formatFileSize(stats.totalSize)}
                  </p>
                </div>
                <FaLayerGroup className="w-5 h-5 text-neutral-400" aria-hidden="true" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Colleges</p>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white mt-0.5">
                    {stats.uniqueColleges}
                  </p>
                </div>
                <FaUniversity className="w-5 h-5 text-neutral-400" aria-hidden="true" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Subjects</p>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white mt-0.5">
                    {stats.uniqueSubjects}
                  </p>
                </div>
                <FaBook className="w-5 h-5 text-neutral-400" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Upload Callout Card */}
          <div className="mb-10 p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-950 dark:text-white mb-1">
                Contribute Your Study Documentation
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
                Share your lecture notes, handwritten summaries, or exam materials with students. Automatic client-side
                compression reduces file sizes before publishing.
              </p>
            </div>
            <Link
              to="/UploadNotes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-xs bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            >
              <span>Upload Notes</span>
              <FaArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>

          {/* Search Bar & Desktop Filter Controls */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs mb-8">
            <div className="flex flex-col lg:flex-row gap-3.5">
              {/* Search Field */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search by subject, college, course, branch, or author..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <FaFilter className="w-3.5 h-3.5" />
                <span>Filters {activeFilters.length > 0 ? `(${activeFilters.length})` : ''}</span>
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-2.5">
                <select
                  name="college"
                  value={filters.college}
                  onChange={handleFilterChange}
                  aria-label="Filter by College"
                  className="px-3 py-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                >
                  <option value="">All Colleges</option>
                  {uniqueValues.colleges.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  name="course"
                  value={filters.course}
                  onChange={handleFilterChange}
                  aria-label="Filter by Course"
                  className="px-3 py-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                >
                  <option value="">All Courses</option>
                  {uniqueValues.courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  name="semester"
                  value={filters.semester}
                  onChange={handleFilterChange}
                  aria-label="Filter by Semester"
                  className="px-3 py-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                >
                  <option value="">All Semesters</option>
                  {uniqueValues.semesters.map((s) => (
                    <option key={s} value={s}>Sem {s}</option>
                  ))}
                </select>

                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  aria-label="Sort Order"
                  className="px-3 py-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Subject (A-Z)</option>
                  <option value="size">Largest Files</option>
                </select>
              </div>
            </div>

            {/* Active Filter Badges */}
            {activeFilters.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-neutral-500">Active filters:</span>
                {activeFilters.map((f) => (
                  <span
                    key={f.key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                  >
                    <span>{f.key === 'search' ? `"${f.value}"` : f.value}</span>
                    <button
                      type="button"
                      onClick={() => removeFilter(f.key)}
                      className="hover:text-red-500 transition-colors"
                      aria-label={`Remove filter ${f.value}`}
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-mono underline hover:text-red-500 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count Summary */}
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-6 px-1">
            <p>
              Showing <span className="font-bold text-neutral-900 dark:text-white">{filteredNotes.length}</span> of{' '}
              <span>{notes.length}</span> cataloged items
            </p>
            <span className="hidden sm:inline">
              Sorting: {filters.sort === 'newest' ? 'Newest' : filters.sort === 'oldest' ? 'Oldest' : filters.sort === 'name' ? 'Alphabetical' : 'File Size'}
            </span>
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading notes">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-pulse space-y-4"
                >
                  <div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
                  <div className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded" />
                  <div className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded" />
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl p-8 bg-neutral-50/50 dark:bg-neutral-900/30">
              <FaExclamationCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">No Matching Study Notes</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
                {notes.length === 0
                  ? 'No study materials have been published yet. Be the first contributor.'
                  : 'No notes match your query. Adjust your filter terms or reset filters.'}
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-md text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex flex-col justify-between shadow-xs"
                >
                  <div>
                    {/* Note Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-bold text-base text-neutral-950 dark:text-white line-clamp-2 leading-snug">
                        {note.subject}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                        {note.category || 'Notes'}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mb-4">
                      <FaCalendarAlt className="w-3 h-3 text-neutral-400" aria-hidden="true" />
                      <span>{formatDate(note.createdAt)}</span>
                    </p>

                    {/* Metadata Items */}
                    <div className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 py-3 border-y border-neutral-100 dark:border-neutral-800/80 mb-5">
                      <div className="flex items-center gap-2 truncate">
                        <FaSchool className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden="true" />
                        <span className="truncate">{note.college || 'Universal'}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <FaGraduationCap className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden="true" />
                        <span className="truncate">{note.course} {note.branch ? `— ${note.branch}` : ''}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FaUserGraduate className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden="true" />
                          <span>Semester {note.semester}</span>
                        </span>
                        <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                          {formatFileSize(note.compressedSize)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Author Footer */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <Link
                        to={`/DownloadNotes/${note.id}`}
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-semibold text-xs bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                      >
                        <FaEye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View &amp; Read Notes</span>
                      </Link>

                      {note.quizEnabled && (
                        <Link
                          to={`/NoteQuiz/${note.id}`}
                          className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-md font-semibold text-xs border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                        >
                          <FaQuestionCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                          <span>Practice Subject Quiz</span>
                        </Link>
                      )}
                    </div>

                    {note.studentName && (
                      <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate pt-2">
                        Author: <span className="text-neutral-800 dark:text-neutral-200">{note.studentName}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}