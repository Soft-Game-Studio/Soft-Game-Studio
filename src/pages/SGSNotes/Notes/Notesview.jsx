/**
 * Notesview.jsx: SGS Academic Library Document Viewer
 *
 * Production-grade study note viewer and metadata inspector implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Accessibility & Clean Semantics: ARIA attributes, keyboard control, focus outlines
 * - Technical SEO: react-helmet-async with Open Graph, Twitter cards, and LearningResource JSON-LD
 * - PDF Inspection & Actions: Responsive iframe viewer, fullscreen modal, direct download, raw PDF view
 * - Seamless Quiz Integration: Direct entry point to interactive self-assessment when enabled
 * - Strict Standard: Zero purple gradients, zero em dashes, high-contrast typography
 */

/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fireDB } from '../../../DataBase/firebaseConfig';
import Layout from '../../../components/layout/Layout';
import {
  FaFilePdf,
  FaDownload,
  FaCalendarAlt,
  FaUniversity,
  FaGraduationCap,
  FaCodeBranch,
  FaBook,
  FaUserGraduate,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaCompressArrowsAlt,
  FaShareAlt,
  FaExpand,
  FaCompress,
  FaCheck,
  FaQuestionCircle,
  FaLayerGroup,
  FaShieldAlt,
  FaArrowRight,
  FaCopy
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function NoteView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchNote = async () => {
      try {
        const snap = await getDoc(doc(fireDB, 'notes', id));
        if (isCancelled) return;

        if (snap.exists()) {
          const noteData = snap.data();
          setNote({
            id: snap.id,
            ...noteData,
            createdAt: noteData.createdAt?.toDate ? noteData.createdAt.toDate() : new Date(),
          });
        } else {
          setNote(null);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('[SGS Notes] Error fetching note:', error);
          setNote(null);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchNote();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const formatDate = useCallback((date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }, []);

  const handleShare = useCallback(async () => {
    if (!note) return;
    const shareUrl = window.location.href;
    const shareTitle = `${note.subject} Study Notes | Soft Game Studio`;
    const shareText = `Explore verified academic notes for ${note.subject} (${note.course || ''} ${note.branch || ''}, Semester ${note.semester || 'N/A'}).`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User dismissed share sheet, continue to clipboard fallback
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy link to share:', shareUrl);
    }
  }, [note]);

  const handleDownload = useCallback(() => {
    if (!note?.fileUrl) return;
    const link = document.createElement('a');
    link.href = note.fileUrl;
    link.target = '_blank';
    link.download = `${(note.subject || 'Note').replace(/[^a-zA-Z0-9]/g, '_')}_Sem${note.semester || '1'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [note]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const hasQuiz = useMemo(() => {
    return Boolean(note?.quizEnabled && Array.isArray(note?.quiz?.questions) && note.quiz.questions.length > 0);
  }, [note]);

  const quizQuestionCount = note?.quiz?.questions?.length || 0;

  // Structured Data JSON-LD for Google & Search Crawlers
  const structuredData = useMemo(() => {
    if (!note) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `${note.subject} Study Notes`,
      description: `Academic study materials for ${note.subject} (${note.course || ''} ${note.branch || ''}, Semester ${note.semester || 'N/A'}). Contributed by ${note.studentName || 'Student'} from ${note.college || 'University'}.`,
      url: `https://softgamestudios.web.app/DownloadNotes/${note.id}`,
      educationalLevel: `Semester ${note.semester || 'Undergraduate'}`,
      author: {
        '@type': 'Person',
        name: note.studentName || 'Student Contributor',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Soft Game Studio',
        url: 'https://softgamestudios.web.app',
      },
      fileFormat: 'application/pdf',
      isAccessibleForFree: true,
      inLanguage: 'en',
    });
  }, [note]);

  // Loading State
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
            <div className="h-6 w-36 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <div className="h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
                <div className="h-[620px] bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="h-72 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
                <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Not Found State
  if (!note) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors py-24 px-4">
          <div className="max-w-xl mx-auto text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-10 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center text-3xl">
              <FaFilePdf />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Note Resource Not Found
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
              The study document you are trying to view does not exist or may have been unlisted by the author.
            </p>
            <button
              onClick={() => navigate('/DownloadNotes')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <FaArrowLeft className="text-xs" /> Back to Notes Catalog
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentUrl = `https://softgamestudios.web.app/DownloadNotes/${note.id}`;

  return (
    <Layout>
      <Helmet>
        <title>{note.subject} Study Notes | Soft Game Studio Academic Library</title>
        <meta name="title" content={`${note.subject} Study Notes | Soft Game Studio`} />
        <meta
          name="description"
          content={`Download verified study notes for ${note.subject} (${note.course || ''} ${note.branch || ''}, Semester ${note.semester || 'N/A'}). Contributed by ${note.studentName || 'Student'} from ${note.college || 'University'}.`}
        />
        <meta property="og:title" content={`${note.subject} Study Notes | Soft Game Studio`} />
        <meta
          property="og:description"
          content={`Study materials and lecture notes for ${note.subject} (${note.course || ''} ${note.branch || ''}, Semester ${note.semester || 'N/A'}).`}
        />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/sgs-notes.firebasestorage.app/o/Assets%2Fing.png?alt=media"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${note.subject} Study Notes | Soft Game Studio`} />
        <meta
          name="twitter:description"
          content={`Verified study materials for ${note.subject} (${note.course || ''} ${note.branch || ''}).`}
        />
        {structuredData && <script type="application/ld+json">{structuredData}</script>}
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Breadcrumb Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              to="/DownloadNotes"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-xs" /> Back to Notes Catalog
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
                title="Share this note"
                aria-label="Share note link"
              >
                {copied ? <FaCheck className="text-emerald-500 text-xs" /> : <FaShareAlt className="text-xs" />}
                <span>{copied ? 'Link Copied' : 'Share Note'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-semibold transition-colors shadow-sm"
                title="Download PDF"
                aria-label="Download note PDF"
              >
                <FaDownload className="text-xs" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: PDF Viewer */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* PDF Viewer Header Toolbar */}
                <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-neutral-50/70 dark:bg-neutral-900/90">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                      <FaFilePdf className="text-sm" />
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 truncate">
                      {note.fileName || `${note.subject}.pdf`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen'}
                      aria-label="Toggle Fullscreen"
                    >
                      {isFullscreen ? <FaCompress className="text-sm" /> : <FaExpand className="text-sm" />}
                    </button>

                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Open PDF in new tab"
                      aria-label="Open PDF in new tab"
                    >
                      <FaExternalLinkAlt className="text-sm" />
                    </a>
                  </div>
                </div>

                {/* PDF Viewer Frame */}
                <div className="h-[620px] relative bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                  {pdfLoadError ? (
                    <div className="p-8 text-center max-w-md">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl">
                        <FaFilePdf />
                      </div>
                      <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
                        Unable to Display In-Page Preview
                      </h2>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                        Your browser or network policy blocked the embedded document preview. You can open or download the PDF file directly.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <a
                          href={note.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          Open in Tab
                        </a>
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          Download File
                        </button>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={note.fileUrl}
                      title={`${note.subject} PDF Viewer`}
                      className="w-full h-full border-0"
                      onError={() => setPdfLoadError(true)}
                    />
                  )}
                </div>

                {/* PDF Viewer Footer Info */}
                <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/90 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  <div className="flex items-center gap-4">
                    <span>
                      Original: <strong className="text-neutral-800 dark:text-neutral-200">{formatFileSize(note.originalSize || note.compressedSize || 0)}</strong>
                    </span>
                    {note.compressionRatio > 0 && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <FaCompressArrowsAlt className="text-xs" />
                        Reduced by {note.compressionRatio}%
                      </span>
                    )}
                  </div>
                  <div>
                    <span>Delivery: Cloudflare R2 Edge Storage</span>
                  </div>
                </div>
              </div>

              {/* Fullscreen Modal View */}
              <AnimatePresence>
                {isFullscreen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm p-4 sm:p-6 flex flex-col"
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-t-xl text-white">
                      <div className="flex items-center gap-2 truncate">
                        <FaFilePdf className="text-red-500 text-sm flex-shrink-0" />
                        <span className="font-semibold text-sm truncate">{note.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDownload}
                          className="px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200"
                        >
                          Download
                        </button>
                        <button
                          onClick={toggleFullscreen}
                          className="px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200"
                        >
                          Close (Esc)
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 bg-neutral-900 border-x border-b border-neutral-800 rounded-b-xl overflow-hidden">
                      <iframe
                        src={note.fileUrl}
                        title={`${note.subject} Fullscreen Viewer`}
                        className="w-full h-full border-0"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Note Specifications & Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Document Overview Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    <FaLayerGroup className="text-neutral-500 text-xs" />
                    {note.category || 'Curriculum Notes'}
                  </span>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    {formatDate(note.createdAt)}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2 leading-tight">
                  {note.subject}
                </h1>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
                  Curated academic material contributed for peer review and exam preparation.
                </p>

                {/* Primary Download CTA */}
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <FaDownload className="text-xs" />
                    <span>Download PDF ({formatFileSize(note.compressedSize || note.originalSize || 0)})</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center justify-center gap-2 text-center"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      <span>Open Raw PDF</span>
                    </a>
                    <button
                      onClick={handleShare}
                      className="py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center justify-center gap-2"
                    >
                      {copied ? <FaCheck className="text-emerald-500 text-xs" /> : <FaCopy className="text-xs" />}
                      <span>{copied ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Practice Quiz Feature Card if enabled */}
                {hasQuiz && (
                  <div className="mt-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm mb-1.5">
                      <FaQuestionCircle className="text-emerald-600 dark:text-emerald-400" />
                      <span>Interactive Practice Quiz</span>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-3">
                      Test your understanding of this topic with {quizQuestionCount} practice questions.
                    </p>
                    <Link
                      to={`/NoteQuiz/${note.id}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 py-2 px-3.5 rounded-lg transition-colors shadow-sm"
                    >
                      <span>Take Practice Quiz</span>
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                )}

                {/* Metadata Details Grid */}
                <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Academic Attributes
                  </h2>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-neutral-800/50">
                    <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                      <FaUserGraduate className="text-neutral-400" /> Contributor
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                      {note.studentName || 'Student Contributor'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-neutral-800/50">
                    <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                      <FaUniversity className="text-neutral-400" /> College
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                      {note.college || 'Verified Institution'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-neutral-800/50">
                    <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                      <FaGraduationCap className="text-neutral-400" /> Course
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {note.course || 'Degree Program'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-neutral-800/50">
                    <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                      <FaCodeBranch className="text-neutral-400" /> Branch
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                      {note.branch || 'Specialization'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-neutral-800/50">
                    <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                      <FaBook className="text-neutral-400" /> Semester
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Semester {note.semester || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5">
                    <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                      <FaCalendarAlt className="text-neutral-400" /> Upload Date
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resource Verification & Policy Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                  <FaShieldAlt className="text-neutral-500 text-sm" />
                  <span>Academic Use Guidelines</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  These materials are shared under fair use for educational study and individual reference. Always verify formulas and concepts with your official course syllabus.
                </p>
              </div>

              {/* Upload Notes Invitation Card */}
              <div className="bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                    Have Lecture Notes to Share?
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                    Contribute your handwritten notes, lab manuals, or problem sets to support fellow students across universities.
                  </p>
                </div>
                <Link
                  to="/UploadNotes"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm"
                >
                  <span>Upload Your Notes</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}