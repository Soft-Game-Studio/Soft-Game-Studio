import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import parse from 'html-react-parser';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  BookOpen, 
  ListVideo, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Layers, 
  ExternalLink, 
  AlertCircle, 
  ArrowLeft,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { fireDB } from '../../DataBase/firebaseConfig';
import VideoPlayer from '../../components/Video Player/Videoplayer';
import Layout from '../../components/layout/Layout';

const PlayListCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const fetchCourse = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(fireDB, 'courses', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCourse({ id: docSnap.id, ...data });
        // Clamp activeChapter if out of bounds
        if (data.chapters && activeChapter >= data.chapters.length) {
          setActiveChapter(0);
        }
      } else {
        setError('Curriculum not found in database.');
      }
    } catch (err) {
      setError('Unable to load curriculum content. Please verify your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [id, activeChapter]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Handle URL chapter share copy
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Safe date formatter
  const formattedDate = useMemo(() => {
    if (!course?.createdAt) return null;
    try {
      if (typeof course.createdAt.toDate === 'function') {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(course.createdAt.toDate());
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(course.createdAt));
    } catch {
      return null;
    }
  }, [course]);

  const chapters = useMemo(() => {
    return Array.isArray(course?.chapters) ? course.chapters : [];
  }, [course]);

  const currentChapter = chapters[activeChapter] || null;

  // JSON-LD Schema
  const structuredData = useMemo(() => {
    if (!course) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Course',
          '@id': `https://softgamestudios.web.app/PlayListCourse/${id}#course`,
          name: course.title || 'Technical Curriculum',
          description: course.description || 'Structured engineering playlist course.',
          provider: {
            '@type': 'Organization',
            name: 'Soft Game Studio',
            url: 'https://softgamestudios.web.app/'
          },
          hasCourseInstance: chapters.map((ch, idx) => ({
            '@type': 'CourseInstance',
            name: ch.title || `Chapter ${idx + 1}`,
            position: idx + 1
          }))
        }
      ]
    });
  }, [course, chapters, id]);

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>
          {course?.title 
            ? `${course.title} (Chapter ${activeChapter + 1} of ${chapters.length || 1}) | Soft Game Studio` 
            : 'Playlist Course | Soft Game Studio'}
        </title>
        <meta 
          name="description" 
          content={course?.description || 'Explore modular technical course playlists on Soft Game Studio.'} 
        />
        <link rel="canonical" href={`https://softgamestudios.web.app/PlayListCourse/${id}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="video.other" />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta 
          property="og:title" 
          content={course?.title ? `${course.title} | Soft Game Studio` : 'Playlist Course'} 
        />
        <meta 
          property="og:description" 
          content={course?.description || 'Modular technical course playlists by Soft Game Studio.'} 
        />
        <meta property="og:url" content={`https://softgamestudios.web.app/PlayListCourse/${id}`} />
        {course?.thumbnail && <meta property="og:image" content={course.thumbnail} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta 
          name="twitter:title" 
          content={course?.title ? `${course.title} | Soft Game Studio` : 'Playlist Course'} 
        />
        <meta 
          name="twitter:description" 
          content={course?.description || 'Modular technical course playlists by Soft Game Studio.'} 
        />
        {course?.thumbnail && <meta name="twitter:image" content={course.thumbnail} />}
        
        {structuredData && <script type="application/ld+json">{structuredData}</script>}
      </Helmet>

      <main id="main-content" className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <li>
              <Link 
                to="/OurCourse" 
                className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>All Courses</span>
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="truncate max-w-[200px] sm:max-w-md text-neutral-900 dark:text-neutral-100 font-medium">
              {course?.title || 'Curriculum'}
            </li>
          </ol>
        </nav>

        {/* Loading Skeleton */}
        {loading && (
          <div aria-busy="true" aria-label="Loading curriculum content" className="space-y-8 animate-pulse">
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
              <div className="h-8 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
              <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-6 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
              </div>
              <div className="lg:col-span-4 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
                <div className="h-5 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div 
            role="alert"
            className="p-8 text-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 max-w-xl mx-auto my-12"
          >
            <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" aria-hidden="true" />
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Curriculum Unavailable</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={fetchCourse}
                className="px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Retry
              </button>
              <Link
                to="/OurCourse"
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {!loading && !error && course && (
          <div>
            {/* Header / Meta Bar */}
            <header className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      <ListVideo className="w-3 h-3 text-cyan-500" aria-hidden="true" />
                      PLAYLIST CURRICULUM
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                      <Layers className="w-3 h-3" aria-hidden="true" />
                      {chapters.length} {chapters.length === 1 ? 'Chapter' : 'Chapters'}
                    </span>
                    {formattedDate && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        {formattedDate}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {course.title || 'Untitled Curriculum'}
                  </h1>
                  {course.description && (
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {course.description}
                    </p>
                  )}
                </div>

                {/* Share action */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copy course URL to clipboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>Copied Link</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Share Module</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </header>

            {/* Layout Grid: Player & Notes (Col 8) + Chapter Sidebar (Col 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Video Player & Chapter Content */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Active Chapter Header */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="font-mono text-neutral-500 dark:text-neutral-400">
                    CHAPTER {activeChapter + 1} OF {chapters.length}
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-xs">
                    {currentChapter?.title || `Chapter ${activeChapter + 1}`}
                  </span>
                </div>

                {/* Video Player Container */}
                <section aria-label="Video Player" className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-black overflow-hidden shadow-sm">
                  {currentChapter?.videoUrl ? (
                    <VideoPlayer videoId={String(currentChapter.videoUrl).trim()} />
                  ) : (
                    <div className="aspect-video flex flex-col items-center justify-center p-8 bg-neutral-900 text-neutral-400 text-center">
                      <BookOpen className="w-10 h-10 mb-2 opacity-50" aria-hidden="true" />
                      <p className="text-sm font-medium text-neutral-300">No video media linked for this chapter</p>
                      <p className="text-xs text-neutral-500 mt-1">Review the notes and technical resources below.</p>
                    </div>
                  )}
                </section>

                {/* Chapter Navigation Controls */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    disabled={activeChapter === 0}
                    onClick={() => setActiveChapter(prev => Math.max(0, prev - 1))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    aria-label="Navigate to previous chapter"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Previous Chapter</span>
                  </button>

                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    {activeChapter + 1} / {chapters.length}
                  </span>

                  {activeChapter < chapters.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveChapter(prev => Math.min(chapters.length - 1, prev + 1))}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                      aria-label="Navigate to next chapter"
                    >
                      <span>Next Chapter</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <Link
                      to="/OurCourse"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    >
                      <span>Course Catalog</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>

                {/* Chapter Notes Section */}
                <section 
                  aria-labelledby="chapter-notes-title"
                  className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                    <FileText className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                    <h2 id="chapter-notes-title" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      Chapter Notes &amp; Specification
                    </h2>
                  </div>

                  <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {currentChapter?.notes ? (
                      <div className="prose prose-neutral dark:prose-invert max-w-none prose-sm leading-relaxed">
                        {parse(currentChapter.notes)}
                      </div>
                    ) : course.notes ? (
                      <div className="prose prose-neutral dark:prose-invert max-w-none prose-sm leading-relaxed">
                        {parse(course.notes)}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                        No supplementary written notes provided for this chapter. Follow along with the video instruction.
                      </p>
                    )}
                  </div>
                </section>

                {/* Resources and Source Links */}
                {((Array.isArray(currentChapter?.sourceLinks) && currentChapter.sourceLinks.length > 0) ||
                  (Array.isArray(course?.sourceLinks) && course.sourceLinks.length > 0)) && (
                  <section 
                    aria-labelledby="chapter-resources-title"
                    className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                      <ExternalLink className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                      <h2 id="chapter-resources-title" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        Technical References &amp; Source Code
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(currentChapter?.sourceLinks?.length ? currentChapter.sourceLinks : course.sourceLinks).map((link, idx) => {
                        let hostname = 'External Resource';
                        try {
                          hostname = new URL(link).hostname;
                        } catch {
                          hostname = link;
                        }

                        return (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 shrink-0 mt-0.5 transition-colors" aria-hidden="true" />
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:underline">
                                Reference {idx + 1}: {hostname}
                              </span>
                              <span className="block text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                                {link}
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column: Playlist Chapter Selector (Sidebar) */}
              <aside 
                aria-label="Playlist chapter navigation" 
                className="lg:col-span-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm sticky top-6"
              >
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Curriculum Index
                    </h2>
                    <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {chapters.length} structured modules
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {Math.round(((activeChapter + 1) / Math.max(chapters.length, 1)) * 100)}% viewed
                  </span>
                </div>

                <div 
                  role="list"
                  tabIndex={0}
                  aria-label="Chapters in this curriculum"
                  className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[calc(100vh-220px)] overflow-y-auto focus:outline-none"
                >
                  {chapters.map((chapter, index) => {
                    const isActive = index === activeChapter;

                    return (
                      <button
                        key={index}
                        type="button"
                        role="listitem"
                        aria-current={isActive ? 'step' : undefined}
                        onClick={() => setActiveChapter(index)}
                        className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors text-xs focus:outline-none focus-visible:bg-neutral-100 dark:focus-visible:bg-neutral-800 ${
                          isActive
                            ? 'bg-neutral-100 dark:bg-neutral-800/80 font-medium border-l-2 border-neutral-900 dark:border-neutral-100'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                        }`}
                      >
                        {/* Index Indicator */}
                        <span 
                          className={`shrink-0 w-6 h-6 rounded flex items-center justify-center font-mono text-[11px] font-semibold border ${
                            isActive
                              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                          }`}
                        >
                          {index + 1}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className={`truncate leading-snug ${
                            isActive 
                              ? 'text-neutral-900 dark:text-neutral-100 font-semibold' 
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}>
                            {chapter.title || `Chapter ${index + 1}`}
                          </p>
                          <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                            Module {index + 1}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default PlayListCourse;