import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Layers, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { fireDB } from '../../DataBase/firebaseConfig';
import Layout from '../../components/layout/Layout';

const EbookCatalog = () => {
  const [ebooks, setEbooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterCounts, setChapterCounts] = useState({});
  const shouldReduceMotion = useReducedMotion();

  // Fetch chapter counts safely for each ebook
  const fetchChapterCounts = useCallback(async (ebooksData) => {
    try {
      const counts = {};
      const countPromises = ebooksData.map(async (ebook) => {
        try {
          const chaptersRef = collection(fireDB, `Ebooks/${ebook.id}/chapters`);
          const chaptersSnapshot = await getDocs(chaptersRef);
          counts[ebook.id] = chaptersSnapshot.size;
        } catch {
          counts[ebook.id] = 0;
        }
      });
      await Promise.all(countPromises);
      setChapterCounts(counts);
    } catch {
      const defaultCounts = {};
      ebooksData.forEach(ebook => {
        defaultCounts[ebook.id] = 0;
      });
      setChapterCounts(defaultCounts);
    }
  }, []);

  const fetchEbooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ebooksCollection = collection(fireDB, 'Ebooks');
      const ebooksSnapshot = await getDocs(ebooksCollection);
      
      const ebooksData = [];
      ebooksSnapshot.forEach(doc => {
        ebooksData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setEbooks(ebooksData);
      setLoading(false);
      // Fetch chapter counts asynchronously without blocking main render
      fetchChapterCounts(ebooksData);
    } catch (err) {
      setError('Unable to load technical manuals library. Please verify your network connection.');
      setLoading(false);
    }
  }, [fetchChapterCounts]);

  useEffect(() => {
    fetchEbooks();
  }, [fetchEbooks]);

  const filteredEbooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return ebooks;
    return ebooks.filter(ebook => 
      (ebook.title && ebook.title.toLowerCase().includes(query)) ||
      (ebook.description && ebook.description.toLowerCase().includes(query))
    );
  }, [ebooks, searchTerm]);

  // Structured Data JSON-LD
  const structuredData = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://softgamestudios.web.app/E-Books#webpage',
          url: 'https://softgamestudios.web.app/E-Books',
          name: 'Technical Books & Architecture Manuals | Soft Game Studio',
          description: 'Comprehensive technical publications, software architecture guides, and engineering documentation published by Soft Game Studio.',
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://softgamestudios.web.app/#website',
            name: 'Soft Game Studio',
            url: 'https://softgamestudios.web.app/'
          }
        },
        {
          '@type': 'ItemList',
          itemListElement: ebooks.slice(0, 15).map((book, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Book',
              name: book.title || 'Technical Manual',
              description: book.description || 'Engineering publication by Soft Game Studio.',
              url: `https://softgamestudios.web.app/E-Books/${book.id}`,
              author: {
                '@type': 'Organization',
                name: 'Soft Game Studio'
              }
            }
          }))
        }
      ]
    });
  }, [ebooks]);

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>Technical Books &amp; Architecture Manuals | Soft Game Studio</title>
        <meta 
          name="description" 
          content="Access comprehensive engineering publications, game architecture notes, and software manuals authored by Soft Game Studio. Read online or export to PDF." 
        />
        <link rel="canonical" href="https://softgamestudios.web.app/E-Books" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta property="og:title" content="Technical Books &amp; Architecture Manuals | Soft Game Studio" />
        <meta 
          property="og:description" 
          content="Access comprehensive engineering publications, game architecture notes, and software manuals authored by Soft Game Studio." 
        />
        <meta property="og:url" content="https://softgamestudios.web.app/E-Books" />
        <meta 
          property="og:image" 
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" 
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Technical Books &amp; Architecture Manuals | Soft Game Studio" />
        <meta 
          name="twitter:description" 
          content="Access comprehensive engineering publications, game architecture notes, and software manuals authored by Soft Game Studio." 
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
                <BookMarked className="w-3.5 h-3.5" aria-hidden="true" />
                TECHNICAL LIBRARY
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Technical Books &amp; Architecture Manuals
              </h1>
              <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
                In-depth technical guides, engineering notes, and software architectural documentation with full mathematical typesetting.
              </p>
            </div>

            {/* Catalog Counter */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <div className="px-3 py-2 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{ebooks.length}</span> Publications
              </div>
            </div>
          </div>

          {/* Search Controls */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search manuals by title or topic..."
                aria-label="Search manuals by title or topic"
                className="w-full pl-10 pr-4 py-2 text-xs rounded-md bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-colors"
              />
            </div>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="self-start sm:self-auto text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-mono transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </header>

        {/* Loading Skeleton */}
        {loading && (
          <div 
            aria-busy="true" 
            aria-label="Loading library manuals"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3.5 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
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
            className="p-8 text-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 max-w-xl mx-auto my-8"
          >
            <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Library Catalog Unavailable</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
            <button
              type="button"
              onClick={fetchEbooks}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEbooks.length === 0 && (
          <div className="py-16 text-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">No technical publications found</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              {searchTerm 
                ? `No publications matching "${searchTerm}". Try adjusting your keywords or clearing the search query.` 
                : 'No manuals are currently published in the repository.'}
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-4 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Reset Search
              </button>
            )}
          </div>
        )}

        {/* Manuals Grid */}
        {!loading && !error && filteredEbooks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEbooks.map((ebook, index) => {
              const targetUrl = `/E-Books/${ebook.id}`;
              const count = chapterCounts[ebook.id];

              return (
                <motion.article
                  key={ebook.id}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: shouldReduceMotion ? 0.01 : 0.35, 
                    delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.3),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group flex flex-col rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  {/* Book Cover Container */}
                  <div className="relative aspect-[16/10] bg-neutral-100 dark:bg-neutral-800 overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                    {ebook.coverImageURL ? (
                      <img 
                        loading="lazy" 
                        src={ebook.coverImageURL} 
                        alt={ebook.title ? `Cover for ${ebook.title}` : 'Manual cover'} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                        <BookOpen className="w-8 h-8 mb-1.5 opacity-60" aria-hidden="true" />
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Technical Manual
                        </span>
                      </div>
                    )}

                    {/* Chapter Count Badge */}
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/75 text-neutral-200 backdrop-blur-sm">
                        <Layers className="w-2.5 h-2.5" aria-hidden="true" />
                        {typeof count === 'number' ? `${count} Chapters` : 'Reading Guide'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                      <Link 
                        to={targetUrl}
                        className="focus:outline-none focus-visible:underline"
                        aria-label={`Read ${ebook.title || 'Technical Manual'}`}
                      >
                        {ebook.title || 'Untitled Manual'}
                      </Link>
                    </h2>

                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 flex-1 leading-relaxed">
                      {ebook.description || 'Comprehensive technical documentation with structured chapters and code examples.'}
                    </p>

                    {/* Card Meta & Action */}
                    <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                        PDF &amp; Web View
                      </span>

                      <Link
                        to={targetUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                        aria-label={`Open manual for ${ebook.title || 'this eBook'}`}
                      >
                        <span>Read</span>
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

export default EbookCatalog;