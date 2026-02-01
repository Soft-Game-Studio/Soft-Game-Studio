import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Layout from '../../components/layout/Layout';
import { 
  FaWindows, 
  FaAndroid, 
  FaGooglePlay, 
  FaSearch, 
  FaFilter,
  FaGamepad,
  FaCalendarAlt,
  FaDownload,
  FaFire,
  FaStar,
  FaSort,
  FaTimes
} from 'react-icons/fa';
import { gameService } from './gameService';

const GamesListPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const gamesData = await gameService.getAllGames();
      setGames(gamesData);
      setError(null);
    } catch (err) {
      setError("Failed to load games. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = [...games];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(game => 
        game.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.developerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(game => {
        if (selectedPlatform === 'windows') return game.windowsExeLink;
        if (selectedPlatform === 'android') return game.androidApkLink;
        if (selectedPlatform === 'playstore') return game.playStoreLink;
        return true;
      });
    }

    // Sort games
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return a.gameName.localeCompare(b.gameName);
        case 'name-desc':
          return b.gameName.localeCompare(a.gameName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [games, searchTerm, selectedPlatform, sortBy]);

  const getPlatformIcons = (game) => {
    const icons = [];
    if (game.windowsExeLink) icons.push({ icon: <FaWindows />, color: 'text-blue-500', label: 'Windows' });
    if (game.androidApkLink) icons.push({ icon: <FaAndroid />, color: 'text-green-500', label: 'Android' });
    if (game.playStoreLink) icons.push({ icon: <FaGooglePlay />, color: 'text-yellow-500', label: 'Play Store' });
    return icons;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform('all');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading games...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <Helmet>
          <html lang="en" />
          <title>Game Library | Soft Game Studio</title>
          <meta
            name="description"
            content="Browse our collection of games. Download free games for Windows and Android."
          />
          <meta
            property="og:title"
            content="Game Library - Soft Game Studio"
          />
          <meta
            property="og:description"
            content="Discover amazing games for all platforms. Free downloads available."
          />
        </Helmet>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 py-16 md:py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Game Library
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
            >
              Discover amazing games crafted with passion
            </motion.p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{games.length}</div>
                <div className="text-white/80">Total Games</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white">
                  {games.filter(g => g.windowsExeLink).length}
                </div>
                <div className="text-white/80">Windows Games</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white">
                  {games.filter(g => g.androidApkLink).length}
                </div>
                <div className="text-white/80">Android Games</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white">Free</div>
                <div className="text-white/80">All Games</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-6">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search games by name, description, or developer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Platform Filter */}
              <div className="md:col-span-3">
                <div className="relative">
                  <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Platforms</option>
                    <option value="windows">Windows Only</option>
                    <option value="android">Android Only</option>
                    <option value="playstore">Play Store</option>
                  </select>
                </div>
              </div>

              {/* Sort By */}
              <div className="md:col-span-3">
                <div className="relative">
                  <FaSort className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || selectedPlatform !== 'all' || sortBy !== 'newest') && (
                <div className="md:col-span-12 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500"
                  >
                    <FaTimes />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {selectedPlatform !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                  Platform: {selectedPlatform}
                  <button onClick={() => setSelectedPlatform('all')}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {sortBy !== 'newest' && (
                <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                  Sort: {sortBy}
                  <button onClick={() => setSortBy('newest')}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center mb-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={fetchGames}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Games ({filteredGames.length})
            </h2>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Showing {filteredGames.length} of {games.length} games
            </div>
          </div>

          {/* Games Grid */}
          {filteredGames.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No games found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <Link to={`/game/${game.id}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                      {/* Game Banner */}
                      <div className="relative h-48 overflow-hidden">
                        {game.bannerImageUrl ? (
                          <img
                            src={game.bannerImageUrl}
                            alt={game.gameName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                            <FaGamepad className="text-4xl text-gray-500 dark:text-gray-600" />
                          </div>
                        )}
                        
                        {/* Platform Badges */}
                        <div className="absolute top-3 right-3 flex gap-1">
                          {getPlatformIcons(game).map((platform, idx) => (
                            <div
                              key={idx}
                              className={`bg-white/90 dark:bg-gray-900/90 p-2 rounded-full ${platform.color} backdrop-blur-sm`}
                              title={platform.label}
                            >
                              {platform.icon}
                            </div>
                          ))}
                        </div>

                        {/* New Badge */}
                        {new Date(game.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <FaFire /> NEW
                          </div>
                        )}
                      </div>

                      {/* Game Info */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                            {game.gameName}
                          </h3>
                          {game.playStoreLink && (
                            <FaStar className="text-yellow-500" />
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {game.description}
                        </p>

                        {/* Developer & Date */}
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {game.developerName && (
                            <div className="flex items-center gap-1">
                              <FaGamepad className="text-xs" />
                              <span>{game.developerName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            <span>{formatDate(game.createdAt)}</span>
                          </div>
                        </div>

                        {/* Features Preview */}
                        {game.gameFeatures && game.gameFeatures.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {game.gameFeatures.slice(0, 3).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-lg text-xs"
                                >
                                  {feature.title}
                                </span>
                              ))}
                              {game.gameFeatures.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs">
                                  +{game.gameFeatures.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {game.windowsExeLink && (
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FaWindows className="text-blue-500" />
                              </div>
                            )}
                            {game.androidApkLink && (
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <FaAndroid className="text-green-500" />
                              </div>
                            )}
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                            <FaDownload />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Featured Games Section */}
          {games.length > 3 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Games</h2>
                  <p className="text-gray-600 dark:text-gray-400">Our most popular downloads</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  TOP PICKS
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {games.slice(0, 3).map((game, index) => (
                  <motion.div
                    key={`featured-${game.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/game/${game.id}`}>
                      <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
                        <div className="relative h-64 overflow-hidden">
                          {game.bannerImageUrl ? (
                            <img
                              src={game.bannerImageUrl}
                              alt={game.gameName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                              <FaGamepad className="text-6xl text-gray-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-2xl font-bold text-white mb-2">{game.gameName}</h3>
                            <p className="text-gray-300 text-sm line-clamp-2">{game.description}</p>
                          </div>
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                            #{index + 1} Trending
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Play?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                Download any of our games for free and start your gaming adventure today!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => setSelectedPlatform("windows")} className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-8 rounded-xl hover:opacity-90">
                  <FaWindows />
                  Browse Windows Games
                </button>
                <button onClick={() => setSelectedPlatform("android")} className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-8 rounded-xl hover:opacity-90">
                  <FaAndroid />
                  Browse Android Games
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GamesListPage;