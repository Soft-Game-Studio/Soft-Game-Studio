import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Gamepad2, 
  Monitor, 
  Smartphone, 
  Download, 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import { gameService } from "./gameService";
import logo from "../../Assictes/23.png";

const DownloadButton = ({ icon, label, sub, link, primary = false }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-3.5 px-5 py-3 rounded-md transition-colors text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary
        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white focus:ring-neutral-900 dark:focus:ring-neutral-100"
        : "border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:ring-neutral-900 dark:focus:ring-neutral-100"
    }`}
  >
    <div className="text-base shrink-0">{icon}</div>
    <div className="text-left">
      <span className="block font-mono text-[10px] uppercase opacity-75">{sub}</span>
      <span className="block text-xs font-semibold">{label}</span>
    </div>
  </a>
);

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGame = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await gameService.getGameById(id);
      if (data) {
        setGame(data);
      } else {
        setError("The requested game title could not be found.");
      }
    } catch (err) {
      setError("Unable to load title specifications. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  const formatDate = (dateString) => {
    if (!dateString) return "Release Build";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Release Build";
    }
  };

  // Structured Data JSON-LD
  const structuredData = useMemo(() => {
    if (!game) return null;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "VideoGame",
          "@id": `https://softgamestudios.web.app/game/${id}#game`,
          name: game.gameName || "Interactive Title",
          description: game.description || "2D interactive title engineered by Soft Game Studio.",
          author: {
            "@type": "Organization",
            name: game.developerName || "Soft Game Studio",
            url: "https://softgamestudios.web.app/"
          },
          publisher: {
            "@type": "Organization",
            name: "Soft Game Studio"
          },
          operatingSystem: [
            game.windowsExeLink ? "Windows" : null,
            game.androidApkLink ? "Android" : null
          ].filter(Boolean).join(", ") || "Windows, Android",
          applicationCategory: "GameApplication",
          image: game.bannerImageUrl || undefined,
          url: `https://softgamestudios.web.app/game/${id}`
        }
      ]
    });
  }, [game, id]);

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>
          {game?.gameName 
            ? `${game.gameName} | 2D Game Engineering | Soft Game Studio` 
            : "Game Specification | Soft Game Studio"}
        </title>
        <meta
          name="description"
          content={game?.description || "Explore playable 2D game specifications and download binaries engineered by Soft Game Studio."}
        />
        <link rel="canonical" href={`https://softgamestudios.web.app/game/${id}`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta 
          property="og:title" 
          content={game?.gameName ? `${game.gameName} | Soft Game Studio` : "Game Specification"} 
        />
        <meta 
          property="og:description" 
          content={game?.description || "Playable standalone builds engineered by Soft Game Studio."} 
        />
        <meta property="og:url" content={`https://softgamestudios.web.app/game/${id}`} />
        {game?.bannerImageUrl && <meta property="og:image" content={game.bannerImageUrl} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta 
          name="twitter:title" 
          content={game?.gameName ? `${game.gameName} | Soft Game Studio` : "Game Specification"} 
        />
        <meta 
          name="twitter:description" 
          content={game?.description || "Playable standalone builds engineered by Soft Game Studio."} 
        />
        {game?.bannerImageUrl && <meta name="twitter:image" content={game.bannerImageUrl} />}

        {structuredData && <script type="application/ld+json">{structuredData}</script>}
      </Helmet>

      <main id="main-content" className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <li>
              <Link 
                to="/game" 
                className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>All Games</span>
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="truncate max-w-[200px] sm:max-w-md text-neutral-900 dark:text-neutral-100 font-medium">
              {game?.gameName || "Title Specification"}
            </li>
          </ol>
        </nav>

        {/* Loading Skeleton */}
        {loading && (
          <div aria-busy="true" aria-label="Loading game details" className="space-y-8 animate-pulse">
            <div className="aspect-[16/9] bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
            <div className="space-y-4 max-w-2xl">
              <div className="h-8 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
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
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Title Unavailable</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={fetchGame}
                className="px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Retry
              </button>
              <Link
                to="/game"
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Browse All Titles
              </Link>
            </div>
          </div>
        )}

        {/* Loaded Game View */}
        {!loading && !error && game && (
          <div className="space-y-12">
            {/* Hero Banner Section */}
            <header className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
              {/* 16:9 Banner Image */}
              <div className="relative aspect-[16/9] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                {game.bannerImageUrl ? (
                  <img
                    src={game.bannerImageUrl}
                    alt={game.gameName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <Gamepad2 className="w-16 h-16 opacity-40" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Title & Metadata Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white/20 backdrop-blur-sm text-white">
                      PHASER 3 + WEBGL ENGINE
                    </span>
                    {game.developerName && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono text-neutral-200 bg-black/40 backdrop-blur-sm">
                        {game.developerName}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">
                    {game.gameName}
                  </h1>
                </div>
              </div>

              {/* Description & Download Action Bar */}
              <div className="p-6 sm:p-8 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-neutral-500 dark:text-neutral-400 mb-2">
                      Overview &amp; Gameplay Architecture
                    </h2>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {game.description || "Original 2D game architecture built with optimized sprite pipelines and real-time state management."}
                    </p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        Released: {formatDate(game.createdAt)}
                      </span>
                      {game.developerName && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" aria-hidden="true" />
                          Lead Developer: {game.developerName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Download Binaries */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {game.windowsExeLink && (
                      <DownloadButton
                        icon={<Monitor className="w-4 h-4 text-cyan-500" aria-hidden="true" />}
                        label="Download Windows"
                        sub="Stand-alone (.exe)"
                        link={game.windowsExeLink}
                        primary={true}
                      />
                    )}
                    {game.androidApkLink && (
                      <DownloadButton
                        icon={<Smartphone className="w-4 h-4 text-emerald-500" aria-hidden="true" />}
                        label="Download Android"
                        sub="Direct Package (.apk)"
                        link={game.androidApkLink}
                        primary={!game.windowsExeLink}
                      />
                    )}
                    {game.playStoreLink && (
                      <a
                        href={game.playStoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                        <span>Google Play</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Game Highlights / Features */}
            {Array.isArray(game.gameFeatures) && game.gameFeatures.length > 0 && (
              <section aria-labelledby="features-heading" className="space-y-4">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <h2 id="features-heading" className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                    Key Architecture &amp; Mechanics
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {game.gameFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-3">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                        {f.title || `Feature ${i + 1}`}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {f.description || "Interactive gameplay mechanic implemented with deterministic physics."}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* System Requirements Matrix */}
            {((Array.isArray(game.windowsRequirements) && game.windowsRequirements.length > 0) ||
              (Array.isArray(game.androidRequirements) && game.androidRequirements.length > 0)) && (
              <section aria-labelledby="requirements-heading" className="space-y-4">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <h2 id="requirements-heading" className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                    Target Hardware &amp; OS Requirements
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Windows Requirements */}
                  {Array.isArray(game.windowsRequirements) && game.windowsRequirements.length > 0 && (
                    <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                        <Monitor className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          Windows PC Specification
                        </h3>
                      </div>
                      <ul className="space-y-2.5">
                        {game.windowsRequirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Android Requirements */}
                  {Array.isArray(game.androidRequirements) && game.androidRequirements.length > 0 && (
                    <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                        <Smartphone className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          Android Device Specification
                        </h3>
                      </div>
                      <ul className="space-y-2.5">
                        {game.androidRequirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Studio Engineering Attribution */}
            <section aria-labelledby="studio-heading" className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src={logo}
                  alt="Soft Game Studio Brand"
                  className="w-20 h-20 rounded-md object-contain border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-1"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h2 id="studio-heading" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    Engineered by Soft Game Studio
                  </h2>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                    Soft Game Studio engineers interactive 2D entertainment and WebGL canvas applications with custom delta-time physics loops, responsive controller mappings, and minimal memory footprints.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                    <Link
                      to="/game"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Explore All Titles</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default GamePage;
