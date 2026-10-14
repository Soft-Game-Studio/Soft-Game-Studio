import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Gamepad2,
  Search,
  Calendar,
  Download,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Monitor,
  Smartphone,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { gameService } from './GameService';

const GamesListPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all'); // 'all' | 'windows' | 'android' | 'playstore'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name-asc' | 'name-desc'
  const [error, setError] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const gamesData = await gameService.getAllGames();
      setGames(gamesData);
    } catch (err) {
      setError("Unable to load game titles. Please verify your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = [...games];

    // Search filter
    const query = searchTerm.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(game =>
        (game.gameName && game.gameName.toLowerCase().includes(query)) ||
        (game.description && game.description.toLowerCase().includes(query)) ||
        (game.developerName && game.developerName.toLowerCase().includes(query))
      );
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(game => {
        if (selectedPlatform === 'windows') return Boolean(game.windowsExeLink);
        if (selectedPlatform === 'android') return Boolean(game.androidApkLink);
        if (selectedPlatform === 'playstore') return Boolean(game.playStoreLink);
        return true;
      });
    }

    // Sort games
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'name-asc':
          return (a.gameName || '').localeCompare(b.gameName || '');
        case 'name-desc':
          return (b.gameName || '').localeCompare(a.gameName || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [games, searchTerm, selectedPlatform, sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Release Build';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Release Build';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform('all');
    setSortBy('newest');
  };

  // Structured Data JSON-LD
  const structuredData = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://softgamestudios.web.app/Game#webpage',
          url: 'https://softgamestudios.web.app/Game',
          name: 'Game Engineering & Interactive Titles | Soft Game Studio',
          description: 'Explore and download interactive 2D games, physics engines, and playable titles developed by Soft Game Studio for Windows PC and Android.',
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://softgamestudios.web.app/#website',
            name: 'Soft Game Studio',
            url: 'https://softgamestudios.web.app/'
          }
        },
        {
          '@type': 'ItemList',
          itemListElement: games.slice(0, 12).map((game, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'VideoGame',
              name: game.gameName || 'Interactive Title',
              description: game.description || '2D video game developed by Soft Game Studio.',
              author: {
                '@type': 'Organization',
                name: game.developerName || 'Soft Game Studio'
              },
              operatingSystem: [
                game.windowsExeLink ? 'Windows' : null,
                game.androidApkLink ? 'Android' : null
              ].filter(Boolean).join(', ') || 'Windows, Android',
              url: `https://softgamestudios.web.app/Game/${game.id}`
            }
          }))
        }
      ]
    });
  }, [games]);

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>Game Engineering &amp; Interactive Titles | Soft Game Studio</title>
        <meta
          name="description"
          content="Explore and download original 2D titles, real-time physics engines, and playable desktop/mobile builds engineered by Soft Game Studio."
        />
        <link rel="canonical" href="https://softgamestudios.web.app/Game" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta property="og:title" content="Game Engineering &amp; Interactive Titles | Soft Game Studio" />
        <meta
          property="og:description"
          content="Explore and download original 2D titles and interactive game builds engineered by Soft Game Studio."
        />
        <meta property="og:url" content="https://softgamestudios.web.app/Game" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Game Engineering &amp; Interactive Titles | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Original 2D titles and playable desktop/mobile builds engineered by Soft Game Studio."
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
                <Gamepad2 className="w-3.5 h-3.5" aria-hidden="true" />
                GAME ENGINEERING
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Interactive Titles &amp; 2D Engines
              </h1>
              <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
                Playable standalone builds, physics prototypes, and interactive experiences developed with Phaser 3, WebGL, and custom game loops.
              </p>
            </div>

            {/* Quick Catalog Stats */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <div className="px-3 py-2 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{games.length}</span> Published Titles
              </div>
            </div>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Platform Segmented Filter */}
            <div
              role="radiogroup"
              aria-label="Filter games by platform"
              className="inline-flex p-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-x-auto"
            >
              <button
                type="button"
                role="radio"
                aria-checked={selectedPlatform === 'all'}
                onClick={() => setSelectedPlatform('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${selectedPlatform === 'all'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
              >
                All Platforms ({games.length})
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={selectedPlatform === 'windows'}
                onClick={() => setSelectedPlatform('windows')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${selectedPlatform === 'windows'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
              >
                <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                Windows PC
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={selectedPlatform === 'android'}
                onClick={() => setSelectedPlatform('android')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${selectedPlatform === 'android'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                Android APK
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={selectedPlatform === 'playstore'}
                onClick={() => setSelectedPlatform('playstore')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${selectedPlatform === 'playstore'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                Play Store
              </button>
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search titles..."
                  aria-label="Search game titles"
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-colors"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort titles"
                className="px-3 py-1.5 text-xs rounded-md bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Title: A to Z</option>
                <option value="name-desc">Title: Z to A</option>
              </select>
            </div>
          </div>
        </header>

        {/* Loading Skeleton State */}
        {loading && (
          <div
            aria-busy="true"
            aria-label="Loading interactive titles"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3.5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-7 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
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
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Library Unavailable</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
            <button
              type="button"
              onClick={fetchGames}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredGames.length === 0 && (
          <div className="py-16 text-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
            <Gamepad2 className="w-10 h-10 text-neutral-400 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">No game titles found</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              {searchTerm
                ? `No titles matching "${searchTerm}". Try resetting search or platform filters.`
                : 'No games currently published under this category.'}
            </p>
            {(searchTerm || selectedPlatform !== 'all') && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}

        {/* Game Cards Grid */}
        {!loading && !error && filteredGames.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, index) => {
              const targetUrl = `/Game/${game.id}`;

              return (
                <motion.article
                  key={game.id}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.35,
                    delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.3),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group flex flex-col rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  {/* Banner Aspect Container */}
                  <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                    {game.bannerImageUrl ? (
                      <img
                        loading="lazy"
                        src={game.bannerImageUrl}
                        alt={game.gameName ? `Banner for ${game.gameName}` : 'Game banner'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                        <Gamepad2 className="w-8 h-8 mb-1.5 opacity-60" aria-hidden="true" />
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Interactive Build
                        </span>
                      </div>
                    )}

                    {/* Platform Tag Indicators */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {game.windowsExeLink && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-neutral-900/85 text-white dark:bg-neutral-950/90 dark:text-neutral-200 backdrop-blur-sm border border-neutral-700/50 flex items-center gap-1"
                          title="Windows Executable Available"
                        >
                          <Monitor className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                          WIN
                        </span>
                      )}
                      {game.androidApkLink && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-neutral-900/85 text-white dark:bg-neutral-950/90 dark:text-neutral-200 backdrop-blur-sm border border-neutral-700/50 flex items-center gap-1"
                          title="Android APK Available"
                        >
                          <Smartphone className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                          APK
                        </span>
                      )}
                      {game.playStoreLink && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-neutral-900/85 text-white dark:bg-neutral-950/90 dark:text-neutral-200 backdrop-blur-sm border border-neutral-700/50 flex items-center gap-1"
                          title="Google Play Store Link"
                        >
                          <ExternalLink className="w-3 h-3 text-amber-400" aria-hidden="true" />
                          PLAY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                      <Link
                        to={targetUrl}
                        className="focus:outline-none focus-visible:underline"
                        aria-label={`View specifications for ${game.gameName || 'Game'}`}
                      >
                        {game.gameName || 'Untitled Project'}
                      </Link>
                    </h2>

                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 flex-1 leading-relaxed">
                      {game.description || 'Original 2D interactive title engineered by Soft Game Studio.'}
                    </p>

                    {/* Features Preview Tags */}
                    {Array.isArray(game.gameFeatures) && game.gameFeatures.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {game.gameFeatures.slice(0, 2).map((feat, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 truncate max-w-[130px]"
                          >
                            {feat.title || 'Feature'}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Footer: Metadata & Primary Action */}
                    <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{formatDate(game.createdAt)}</span>
                      </div>

                      <Link
                        to={targetUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                        aria-label={`Open details for ${game.gameName || 'this game'}`}
                      >
                        <span>Details</span>
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

export default GamesListPage;