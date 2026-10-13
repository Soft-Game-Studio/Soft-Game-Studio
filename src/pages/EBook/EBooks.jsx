// src/pages/EBook/EBooks.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { 
  BookOpen, 
  Download, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  FileText, 
  Layers, 
  AlertCircle, 
  BookMarked,
  Share2,
  Check,
  FileDown
} from 'lucide-react';
import { fireDB } from '../../DataBase/firebaseConfig';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import RenderContent from '../../components/RenderContent';

import katex from "katex";
import "katex/dist/katex.min.css";

const renderMathToHTML = (content) => {
  if (!content) return '';
  return content.replace(/\$\$(.*?)\$\$/g, (_, formula) => {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: true,
    });
  });
};

const EbookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const shouldReduceMotion = useReducedMotion();
  const contentRefs = useRef([]);
  const parallaxRef = useRef(null);
  const chapterRefs = useRef([]);

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch ebook details
        const ebookRef = doc(fireDB, 'Ebooks', id);
        const ebookDoc = await getDoc(ebookRef);
        
        if (!ebookDoc.exists()) {
          throw new Error('Publication not found in library.');
        }
        
        setEbook(ebookDoc.data());
        
        // Fetch chapters
        const chaptersCollection = collection(fireDB, `Ebooks/${id}/chapters`);
        const chaptersSnapshot = await getDocs(chaptersCollection);
        
        const chaptersData = [];
        chaptersSnapshot.forEach(docSnap => {
          chaptersData.push({
            id: docSnap.id,
            ...docSnap.data()
          });
        });
        
        // Sort chapters by chapter number
        chaptersData.sort((a, b) => (Number(a.chapterNo) || 0) - (Number(b.chapterNo) || 0));
        setChapters(chaptersData);
        
        // Initialize refs
        contentRefs.current = chaptersData.map(() => React.createRef());
        chapterRefs.current = chaptersData.map(() => React.createRef());
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ebook:', err);
        setError('Failed to load publication details. Please verify your connection.');
        setLoading(false);
      }
    };

    fetchEbook();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollPosition = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.25}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToExpandedChapter = (chapterId) => {
    const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    if (chapterIndex !== -1 && chapterRefs.current[chapterIndex]) {
      const element = chapterRefs.current[chapterIndex];
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - (window.innerHeight / 2) + (element.clientHeight / 2);
      
      window.scrollTo({
        top: offsetPosition,
        behavior: shouldReduceMotion ? 'auto' : 'smooth'
      });
    }
  };

  const toggleChapter = (chapterId) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
      setTimeout(() => scrollToExpandedChapter(chapterId), 50);
    }
  };

  const downloadAsPDF = async (chapter, index) => {
    setPdfGenerating(true);
    setCurrentChapter(chapter);
    
    try {
      const tempDiv = document.createElement('div');
      tempDiv.className = 'prose max-w-none bg-white p-10 rounded-xl';
      tempDiv.innerHTML = renderMathToHTML(chapter.content);
      document.body.appendChild(tempDiv);
      
      const opt = {
        margin: 20,
        filename: `${(chapter.title || 'Chapter').replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          backgroundColor: '#FFFFFF'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(tempDiv).save();
      document.body.removeChild(tempDiv);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const downloadAllChaptersAsPDF = async () => {
    if (chapters.length === 0) return;
    setPdfGenerating(true);
    
    try {
      const zip = new JSZip();
      
      for (const [index, chapter] of chapters.entries()) {
        const tempDiv = document.createElement('div');
        tempDiv.className = 'prose max-w-none bg-white p-10 rounded-xl';
        tempDiv.innerHTML = renderMathToHTML(chapter.content);
        document.body.appendChild(tempDiv);
        
        const pdfBlob = await html2pdf().set({
          margin: 20,
          filename: `${(chapter.title || `Chapter_${index + 1}`).replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#FFFFFF'
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        }).from(tempDiv).outputPdf('blob');
        
        document.body.removeChild(tempDiv);
        zip.file(`${chapter.chapterNo || index + 1}_${(chapter.title || 'Chapter').replace(/\s+/g, '_')}.pdf`, pdfBlob);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${(ebook?.title || 'Ebook').replace(/\s+/g, '_')}_Chapters.zip`);
    } catch (err) {
      console.error('Error downloading all chapters as PDF:', err);
      alert('Failed to download all chapters. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ebook?.title ? `${ebook.title} | Soft Game Studio` : 'Technical Publication',
          text: `Explore "${ebook?.title || 'this technical e-book'}" published by Soft Game Studio.`,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Share cancelled or declined
      }
    }
    
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Clipboard fallback
    }
  };

  // Structured Data Schema for SEO & Answer Engines
  const structuredData = useMemo(() => {
    if (!ebook) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Book',
          '@id': `https://softgamestudios.web.app/E-Books/${id}#book`,
          'name': ebook.title || 'Technical Publication',
          'description': ebook.description || `Read and download technical publication chapters and notes published by Soft Game Studio.`,
          'url': `https://softgamestudios.web.app/E-Books/${id}`,
          'publisher': {
            '@type': 'Organization',
            'name': 'Soft Game Studio',
            'url': 'https://softgamestudios.web.app'
          },
          'inLanguage': 'en',
          ...(ebook.coverImageURL ? { 'image': ebook.coverImageURL } : {}),
          'numberOfPages': chapters.length,
          'hasPart': chapters.map(ch => ({
            '@type': 'Chapter',
            'position': ch.chapterNo,
            'name': ch.title
          }))
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `https://softgamestudios.web.app/E-Books/${id}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://softgamestudios.web.app/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'E-Books',
              'item': 'https://softgamestudios.web.app/E-Books'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': ebook.title || 'Publication',
              'item': `https://softgamestudios.web.app/E-Books/${id}`
            }
          ]
        }
      ]
    });
  }, [ebook, chapters, id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-neutral-200/80 dark:bg-neutral-800/80 flex items-center justify-center border border-neutral-300 dark:border-neutral-700/60 shadow-xs">
              <Loader2 className="w-6 h-6 text-neutral-800 dark:text-neutral-200 animate-spin" />
            </div>
            <div>
              <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Loading Technical Publication
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Retrieving chapters and documentation from Soft Game Studio
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
          <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4 border border-red-200 dark:border-red-900/50">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Publication Unavailable
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/E-Books')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Library
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const pageTitle = ebook?.title 
    ? `${ebook.title} | Technical Publication | Soft Game Studio` 
    : 'Technical Publication | Soft Game Studio';
  const pageDescription = ebook?.description 
    ? ebook.description.slice(0, 155) 
    : `Read and download complete modules of ${ebook?.title || 'technical manual'} in PDF format from Soft Game Studio.`;
  const canonicalUrl = `https://softgamestudios.web.app/E-Books/${id}`;

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Soft Game Studio, Technical Publications, Developer E-Books, Programming Guides, PDF Chapters, Engineering Manuals" />
        <meta name="author" content="Soft Game Studio" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph Meta */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Soft Game Studio" />
        {ebook?.coverImageURL && (
          <meta property="og:image" content={ebook.coverImageURL} />
        )}

        {/* Twitter Card Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {ebook?.coverImageURL && (
          <meta name="twitter:image" content={ebook.coverImageURL} />
        )}

        {/* Structured Data JSON-LD */}
        {structuredData && (
          <script type="application/ld+json">
            {structuredData}
          </script>
        )}
      </Helmet>

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-neutral-900">
        
        {/* ── Hero / Editorial Book Banner ──────────────────────────── */}
        <header className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden">
          {/* Subtle Ambient Background */}
          {ebook?.coverImageURL && (
            <div 
              ref={parallaxRef}
              className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10 blur-2xl scale-110"
              style={{
                backgroundImage: `url(${ebook.coverImageURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              aria-hidden="true"
            />
          )}

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <Link 
                  to="/" 
                  className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Home
                </Link>
                <span>/</span>
                <Link 
                  to="/E-Books" 
                  className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Library
                </Link>
                <span>/</span>
                <span className="text-neutral-900 dark:text-neutral-200 truncate max-w-[180px] sm:max-w-xs font-medium">
                  {ebook?.title || 'Publication'}
                </span>
              </nav>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                aria-label="Share this publication"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Book Details Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Metadata & CTAs */}
              <div className="md:col-span-8 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  <span>Technical Publication</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                  {ebook?.title || 'Technical Publication'}
                </h1>

                {ebook?.description ? (
                  <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                    {ebook.description}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
                    Modular technical guide and engineering documentation authored by Soft Game Studio. Read online or export chapters as clean PDF documents.
                  </p>
                )}

                {/* Specs / Meta Badges */}
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                    <Layers className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{chapters.length}</span>
                    <span>{chapters.length === 1 ? 'Chapter' : 'Chapters'}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                    <span>PDF Export Available</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                    <BookMarked className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Soft Game Studio</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={downloadAllChaptersAsPDF}
                    disabled={pdfGenerating || chapters.length === 0}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    {pdfGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Archive...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        <span>Download All Chapters (ZIP)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/E-Books')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Library Catalog</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Book Cover Presentation */}
              <div className="md:col-span-4 flex justify-center md:justify-end">
                <div className="relative group w-48 sm:w-56 aspect-[3/4] rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md bg-neutral-100 dark:bg-neutral-800">
                  {ebook?.coverImageURL ? (
                    <img
                      src={ebook.coverImageURL}
                      alt={ebook?.title ? `${ebook.title} book cover` : 'Publication cover'}
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                      fetchpriority="high"
                    />
                  ) : (
                    <div className="w-full h-full p-6 flex flex-col justify-between bg-neutral-900 text-white">
                      <div className="space-y-2">
                        <BookOpen className="w-8 h-8 text-neutral-400" />
                        <span className="block text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                          SGS Publication
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold line-clamp-3 leading-snug">
                          {ebook?.title || 'Technical Manual'}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-2 font-mono">
                          {chapters.length} Modules
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Left Spine visual accent */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none"
                    aria-hidden="true" 
                  />
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* ── Chapters Table of Contents & Content ─────────────────── */}
        <section 
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
          aria-labelledby="chapters-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 
                id="chapters-heading"
                className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
              >
                Table of Contents
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Select any module below to read or export as a formatted PDF.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                {chapters.length} {chapters.length === 1 ? 'Module' : 'Modules'} Available
              </span>
            </div>
          </div>

          {chapters.length === 0 ? (
            <div className="py-20 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-8">
              <BookOpen className="w-10 h-10 mx-auto text-neutral-400 dark:text-neutral-600 mb-3" />
              <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                No Chapters Published Yet
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Content for this publication is currently being finalized. Please check back shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter, index) => {
                const isExpanded = expandedChapter === chapter.id;
                const formattedNum = String(chapter.chapterNo || index + 1).padStart(2, '0');

                return (
                  <article
                    key={chapter.id}
                    ref={el => { chapterRefs.current[index] = el; }}
                    className={`rounded-xl border transition-colors bg-white dark:bg-neutral-900 overflow-hidden ${
                      isExpanded 
                        ? 'border-neutral-400 dark:border-neutral-700 shadow-sm' 
                        : 'border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    {/* Chapter Header / Toggle Row */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-controls={`chapter-content-${chapter.id}`}
                      onClick={() => toggleChapter(chapter.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleChapter(chapter.id);
                        }
                      }}
                      className="flex items-center gap-4 p-4 sm:p-5 cursor-pointer select-none transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400"
                    >
                      {/* Chapter Number Badge */}
                      <span className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                        {formattedNum}
                      </span>

                      {/* Chapter Title */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {chapter.title || `Chapter ${formattedNum}`}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          Module {formattedNum} &middot; Soft Game Studio
                        </p>
                      </div>

                      {/* Direct PDF Export Action (visible on hover/active) */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadAsPDF(chapter, index);
                          }}
                          disabled={pdfGenerating}
                          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                          title="Export this module to PDF"
                          aria-label={`Export ${chapter.title || 'chapter'} to PDF`}
                        >
                          {pdfGenerating && currentChapter?.id === chapter.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Exporting...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 text-neutral-500" />
                              <span>PDF</span>
                            </>
                          )}
                        </button>

                        <div 
                          className="shrink-0 p-1 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform"
                          aria-hidden="true"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chapter Expanded Body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={`chapter-content-${chapter.id}`}
                          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="border-t border-neutral-200 dark:border-neutral-800"
                        >
                          {/* Module Header Bar */}
                          <div className="flex items-center justify-between px-5 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                              Reading Mode &middot; Module {formattedNum}
                            </span>

                            <button
                              type="button"
                              onClick={() => downloadAsPDF(chapter, index)}
                              disabled={pdfGenerating}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                            >
                              {pdfGenerating && currentChapter?.id === chapter.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Generating...</span>
                                </>
                              ) : (
                                <>
                                  <FileDown className="w-3.5 h-3.5" />
                                  <span>Export Chapter PDF</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Content Area */}
                          <div className="p-6 sm:p-10 bg-white dark:bg-neutral-900">
                            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-neutral-900 dark:prose-a:text-neutral-100 prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-neutral-800">
                              <RenderContent content={chapter.content} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Status Toast for PDF Generation ───────────────────────── */}
        <AnimatePresence>
          {pdfGenerating && (
            <div 
              role="status" 
              aria-live="polite"
              className="fixed bottom-6 right-6 z-50 pointer-events-none"
            >
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="flex items-center gap-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-3 rounded-xl shadow-xl border border-neutral-800 dark:border-neutral-200 pointer-events-auto max-w-sm"
              >
                <Loader2 className="w-4 h-4 animate-spin text-neutral-300 dark:text-neutral-700 shrink-0" />
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold">Generating PDF Document</p>
                  <p className="text-[11px] opacity-75 truncate mt-0.5">
                    {currentChapter ? currentChapter.title : 'Packaging publication files...'}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </Layout>
  );
};

export default EbookReader;
