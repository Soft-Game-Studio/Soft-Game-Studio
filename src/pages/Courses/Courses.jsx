import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  ListVideo, 
  Calendar, 
  Search, 
  AlertCircle, 
  RefreshCw,
  ArrowRight,
  Clock
} from 'lucide-react';
import { fireDB } from '../../DataBase/firebaseConfig';
import Layout from '../../components/layout/Layout';

const DisplayCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'single' | 'playlist'
  const shouldReduceMotion = useReducedMotion();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(fireDB, 'courses'));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
    } catch (err) {
      setError('Unable to load curriculum catalog. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesType = 
        filterType === 'all' 
          ? true 
          : filterType === 'single'
            ? course.type === 'single'
            : course.type === 'playlist' || course.type === 'plalist'; // handle potential legacy typos

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        !query ||
        (course.title && course.title.toLowerCase().includes(query)) ||
        (course.description && course.description.toLowerCase().includes(query));

      return matchesType && matchesSearch;
    });
  }, [courses, filterType, searchQuery]);

  // Format creation date safely
  const formatDate = (createdAt) => {
    if (!createdAt) return 'Curriculum Module';
    try {
      if (typeof createdAt.toDate === 'function') {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(createdAt.toDate());
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(createdAt));
    } catch {
      return 'Curriculum Module';
    }
  };

  // Structured Data JSON-LD
  const structuredData = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://softgamestudios.web.app/OurCourse#webpage',
          url: 'https://softgamestudios.web.app/OurCourse',
          name: 'Technical Courses & Curricula | Soft Game Studio',
          description: 'Explore project-driven courses in web architecture, game development, and software engineering by Soft Game Studio.',
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://softgamestudios.web.app/#website',
            name: 'Soft Game Studio',
            url: 'https://softgamestudios.web.app/'
          }
        },
        {
          '@type': 'ItemList',
          itemListElement: courses.slice(0, 10).map((c, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Course',
              name: c.title || 'Course Module',
              description: c.description || 'Technical course module offered by Soft Game Studio.',
              provider: {
                '@type': 'Organization',
                name: 'Soft Game Studio',
                sameAs: 'https://softgamestudios.web.app/'
              },
              url: `https://softgamestudios.web.app/${c.type === 'single' ? 'SingleCourse' : 'PlayListCourse'}/${c.id}`
            }
          }))
        }
      ]
    });
  }, [courses]);

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>Technical Courses &amp; Curricula | Soft Game Studio</title>
        <meta 
          name="description" 
          content="Explore project-driven engineering courses in web systems, 2D game engines, and full-stack development. High-density, self-paced video lessons by Soft Game Studio." 
        />
        <link rel="canonical" href="https://softgamestudios.web.app/OurCourse" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta property="og:title" content="Technical Courses &amp; Curricula | Soft Game Studio" />
        <meta 
          property="og:description" 
          content="Explore project-driven engineering courses in web systems, 2D game engines, and full-stack development." 
        />
        <meta property="og:url" content="https://softgamestudios.web.app/OurCourse" />
        <meta 
          property="og:image" 
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" 
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Technical Courses &amp; Curricula | Soft Game Studio" />
        <meta 
          name="twitter:description" 
          content="Explore project-driven engineering courses in web systems, 2D game engines, and full-stack development." 
        />
        <meta 
          name="twitter:image" 
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" 
        />
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      <main id="main-content" className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 mb-3">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                TECHNICAL CURRICULUM
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Engineering &amp; Development Courses
              </h1>
              <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
                Focused, self-paced video modules on modern web architecture, interactive game engineering, and production practices.
              </p>
            </div>

            {/* Quick Catalog Stats */}
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <div className="px-3 py-2 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{courses.length}</span> Courses Total
              </div>
            </div>
          </div>

          {/* Controls: Filter Segmented Control & Search Input */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Type Filter */}
            <div 
              role="radiogroup" 
              aria-label="Filter courses by format"
              className="inline-flex p-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            >
              <button
                type="button"
                role="radio"
                aria-checked={filterType === 'all'}
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                All Courses ({courses.length})
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={filterType === 'playlist'}
                onClick={() => setFilterType('playlist')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  filterType === 'playlist'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <ListVideo className="w-3.5 h-3.5" aria-hidden="true" />
                Playlists
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={filterType === 'single'}
                onClick={() => setFilterType('single')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  filterType === 'single'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <Video className="w-3.5 h-3.5" aria-hidden="true" />
                Single Modules
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search curriculum..."
                aria-label="Search curriculum"
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-colors"
              />
            </div>
          </div>
        </header>

        {/* Loading Skeleton State */}
        {loading && (
          <div 
            aria-busy="true" 
            aria-label="Loading courses" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-5 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3.5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-7 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div 
            role="alert"
            className="p-8 text-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 max-w-xl mx-auto"
          >
            <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Catalog Unavailable</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
            <button
              type="button"
              onClick={fetchCourses}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="py-16 text-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">No matching courses found</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              {searchQuery 
                ? `No courses matching "${searchQuery}". Try clearing search filters or adjusting keywords.` 
                : 'There are currently no courses published under this section.'}
            </p>
            {(searchQuery || filterType !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="mt-4 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => {
              const isPlaylist = course.type === 'playlist' || course.type === 'plalist';
              const targetUrl = isPlaylist 
                ? `/PlayListCourse/${course.id}` 
                : `/SingleCourse/${course.id}`;

              return (
                <motion.article
                  key={course.id}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: shouldReduceMotion ? 0.01 : 0.35, 
                    delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.3),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group flex flex-col rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  {/* Thumbnail / Aspect Container */}
                  <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                    {course.thumbnail ? (
                      <img 
                        loading="lazy" 
                        src={course.thumbnail} 
                        alt={course.title ? `Thumbnail for ${course.title}` : 'Course thumbnail'} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                        <BookOpen className="w-8 h-8 mb-1.5 opacity-60" aria-hidden="true" />
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Curriculum Module
                        </span>
                      </div>
                    )}

                    {/* Format Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-neutral-900/85 text-white dark:bg-neutral-950/90 dark:text-neutral-200 backdrop-blur-sm border border-neutral-700/50">
                        {isPlaylist ? (
                          <>
                            <ListVideo className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                            PLAYLIST
                          </>
                        ) : (
                          <>
                            <Video className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                            SINGLE MODULE
                          </>
                        )}
                      </span>
                    </div>

                    {/* Chapter count badge if available */}
                    {isPlaylist && Array.isArray(course.chapters) && course.chapters.length > 0 && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/75 text-neutral-200 backdrop-blur-sm">
                          {course.chapters.length} CHAPTERS
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                      <Link 
                        to={targetUrl}
                        className="focus:outline-none focus-visible:underline"
                        aria-label={`Open ${course.title || 'Course'}`}
                      >
                        {course.title || 'Untitled Curriculum'}
                      </Link>
                    </h2>

                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 flex-1 leading-relaxed">
                      {course.description || 'Comprehensive technical instruction with source code and references.'}
                    </p>

                    {/* Card Meta & Action */}
                    <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{formatDate(course.createdAt)}</span>
                      </div>

                      <Link
                        to={targetUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                        aria-label={`View curriculum for ${course.title || 'this course'}`}
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>
    </Layout>
  );
};

export default DisplayCourses;