import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import parse from 'html-react-parser';
import axios from 'axios';
import { 
  Video, 
  Calendar, 
  Clock, 
  Eye, 
  ThumbsUp, 
  ExternalLink, 
  AlertCircle, 
  ArrowLeft,
  Copy,
  Check,
  FileText,
  BookOpen,
  Info
} from 'lucide-react';
import { fireDB } from '../../DataBase/firebaseConfig';
import VideoPlayer from '../../components/Video Player/Videoplayer';
import Layout from '../../components/layout/Layout';

const SingleCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // YouTube API details state (decoupled from core course render for reliability)
  const [videoDetails, setVideoDetails] = useState(null);
  const [videoDetailsLoading, setVideoDetailsLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GOOGLE_API;

  const fetchCourse = useCallback(async () => {
    if (!id) return;
    setCourseLoading(true);
    setError(null);
    try {
      const docRef = doc(fireDB, 'courses', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const courseData = { id: docSnap.id, ...docSnap.data() };
        setCourse(courseData);
      } else {
        setError('The requested course could not be found.');
      }
    } catch (err) {
      setError('Unable to load course data. Please check your internet connection.');
    } finally {
      setCourseLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Fetch optional YouTube metadata independently
  useEffect(() => {
    const videoId = course?.videoUrl ? String(course.videoUrl).trim() : null;
    if (!videoId || !API_KEY) return;

    let isMounted = true;
    setVideoDetailsLoading(true);

    axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: API_KEY,
      },
    })
    .then((response) => {
      if (isMounted && response.data?.items?.[0]) {
        setVideoDetails(response.data.items[0]);
      }
    })
    .catch(() => {
      // Graceful degradation: silently ignore YouTube API errors so course stays accessible
    })
    .finally(() => {
      if (isMounted) setVideoDetailsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [course?.videoUrl, API_KEY]);

  // Format ISO 8601 duration string (e.g. PT15M33S -> 15m 33s)
  const formatDuration = (isoDuration) => {
    if (!isoDuration) return 'Standard Module';
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'Standard Module';
    const hours = match[1] ? `${match[1]}h ` : '';
    const minutes = match[2] ? `${match[2]}m ` : '';
    const seconds = match[3] ? `${match[3]}s` : '';
    return `${hours}${minutes}${seconds}`.trim() || 'Standard Module';
  };

  // Safe date formatter for Firestore timestamps
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

  // Handle URL share copy
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Structured Data JSON-LD
  const structuredData = useMemo(() => {
    if (!course) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Course',
          '@id': `https://softgamestudios.web.app/SingleCourse/${id}#course`,
          name: course.title || 'Technical Course Module',
          description: course.description || 'Focused technical course by Soft Game Studio.',
          provider: {
            '@type': 'Organization',
            name: 'Soft Game Studio',
            url: 'https://softgamestudios.web.app/'
          },
          url: `https://softgamestudios.web.app/SingleCourse/${id}`
        }
      ]
    });
  }, [course, id]);

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>
          {course?.title 
            ? `${course.title} | Soft Game Studio` 
            : 'Course Module | Soft Game Studio'}
        </title>
        <meta 
          name="description" 
          content={course?.description || 'Focused software engineering video instruction by Soft Game Studio.'} 
        />
        <link rel="canonical" href={`https://softgamestudios.web.app/SingleCourse/${id}`} />

        {/* Open Graph */}
        <meta property="og:type" content="video.other" />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta 
          property="og:title" 
          content={course?.title ? `${course.title} | Soft Game Studio` : 'Course Module'} 
        />
        <meta 
          property="og:description" 
          content={course?.description || 'Focused software engineering video instruction.'} 
        />
        <meta property="og:url" content={`https://softgamestudios.web.app/SingleCourse/${id}`} />
        {course?.thumbnail && <meta property="og:image" content={course.thumbnail} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta 
          name="twitter:title" 
          content={course?.title ? `${course.title} | Soft Game Studio` : 'Course Module'} 
        />
        <meta 
          name="twitter:description" 
          content={course?.description || 'Focused software engineering video instruction.'} 
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
              {course?.title || 'Module'}
            </li>
          </ol>
        </nav>

        {/* Loading Skeleton */}
        {courseLoading && (
          <div aria-busy="true" aria-label="Loading course module" className="space-y-8 animate-pulse">
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
                <div className="h-20 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!courseLoading && error && (
          <div 
            role="alert"
            className="p-8 text-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 max-w-xl mx-auto my-12"
          >
            <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" aria-hidden="true" />
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Module Unavailable</h1>
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

        {/* Main Content View */}
        {!courseLoading && !error && course && (
          <div>
            {/* Header Section */}
            <header className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      <Video className="w-3 h-3 text-emerald-500" aria-hidden="true" />
                      SINGLE MODULE
                    </span>
                    {formattedDate && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        {formattedDate}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {course.title || 'Untitled Module'}
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
                    aria-label="Copy course link to clipboard"
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

            {/* Layout Grid: Video + Notes (Col 8) + Metadata Sidebar (Col 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Primary Content: Video & Notes */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Video Container */}
                <section aria-label="Video Player" className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-black overflow-hidden shadow-sm">
                  {course.videoUrl ? (
                    <VideoPlayer videoId={String(course.videoUrl).trim()} />
                  ) : (
                    <div className="aspect-video flex flex-col items-center justify-center p-8 bg-neutral-900 text-neutral-400 text-center">
                      <BookOpen className="w-10 h-10 mb-2 opacity-50" aria-hidden="true" />
                      <p className="text-sm font-medium text-neutral-300">Video source is not specified</p>
                      <p className="text-xs text-neutral-500 mt-1">Check the technical notes and specifications below.</p>
                    </div>
                  )}
                </section>

                {/* Course Notes Section */}
                <section 
                  aria-labelledby="course-notes-title"
                  className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                    <FileText className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                    <h2 id="course-notes-title" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      Module Notes &amp; Instructions
                    </h2>
                  </div>

                  <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {course.notes ? (
                      <div className="prose prose-neutral dark:prose-invert max-w-none prose-sm leading-relaxed">
                        {parse(course.notes)}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                        No supplementary written notes provided for this module. Follow along with the video instruction.
                      </p>
                    )}
                  </div>
                </section>

                {/* Resources and Source Links */}
                {Array.isArray(course.sourceLinks) && course.sourceLinks.length > 0 && (
                  <section 
                    aria-labelledby="course-resources-title"
                    className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                      <ExternalLink className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                      <h2 id="course-resources-title" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        Technical References &amp; Source Code
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {course.sourceLinks.map((link, idx) => {
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

              {/* Sidebar: Module Details & Video Statistics */}
              <aside 
                aria-label="Module Specifications"
                className="lg:col-span-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm sticky top-6"
              >
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Module Specifications
                  </h2>
                  <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Metadata &amp; Technical Details
                  </p>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  {/* Format */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">Format</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">Single Video</span>
                  </div>

                  {/* Date */}
                  {formattedDate && (
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500 dark:text-neutral-400">Published</span>
                      <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{formattedDate}</span>
                    </div>
                  )}

                  {/* YouTube Data (When Available) */}
                  {videoDetails && (
                    <>
                      {videoDetails.contentDetails?.duration && (
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                          <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            Duration
                          </span>
                          <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                            {formatDuration(videoDetails.contentDetails.duration)}
                          </span>
                        </div>
                      )}

                      {videoDetails.statistics?.viewCount && (
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                          <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            Views
                          </span>
                          <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                            {Number(videoDetails.statistics.viewCount).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {videoDetails.statistics?.likeCount && (
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                          <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                            <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                            Likes
                          </span>
                          <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                            {Number(videoDetails.statistics.likeCount).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* YouTube Details Loading skeleton if pending */}
                  {videoDetailsLoading && (
                    <div className="space-y-2 animate-pulse py-2">
                      <div className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                      <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    </div>
                  )}

                  {/* Studio Tag */}
                  <div className="pt-2">
                    <div className="rounded p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal">
                          Engineered and provided by <strong className="text-neutral-900 dark:text-neutral-200 font-semibold">Soft Game Studio</strong>. Open curriculum for students and developers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Back to Catalog CTA */}
                  <div className="pt-3">
                    <Link
                      to="/OurCourse"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Back to All Courses</span>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default SingleCourse;
