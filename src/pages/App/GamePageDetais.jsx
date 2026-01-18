import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Layout from '../../components/layout/Layout';
import { 
  FaDownload, 
  FaWindows, 
  FaAndroid, 
  FaGooglePlay, 
  FaGamepad, 
  FaUsers, 
  FaTrophy, 
  FaStar,
  FaSpinner 
} from "react-icons/fa";
import { gameService } from './gameService';

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      const gameData = await gameService.getGameById(id);
      setGame(gameData);
      setError(null);
    } catch (err) {
      setError("Failed to load game data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
        </div>
      </Layout>
    );
  }

  if (error || !game) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">Game not found</h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </div>
    </Layout>
    );
  }

  const {
    gameName,
    description,
    bannerImageUrl,
    windowsExeLink,
    androidApkLink,
    playStoreLink,
    gameFeatures = [],
    upcomingLevels = [],
    developerName,
    windowsRequirements = [],
    androidRequirements = []
  } = game;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-black overflow-hidden">
        <Helmet>
          <html lang="en" />
          <title>{gameName} - Download Free Game | Soft Game Studio</title>
          <meta
            name="description"
            content={description}
          />
          <meta
            property="og:title"
            content={gameName}
          />
          <meta
            property="og:description"
            content={description}
          />
          {bannerImageUrl && <meta property="og:image" content={bannerImageUrl} />}
        </Helmet>

        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full bg-orange-200 dark:bg-orange-900/20 blur-3xl opacity-40 animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 md:w-80 md:h-80 rounded-full bg-red-200 dark:bg-red-900/20 blur-3xl opacity-30 animate-pulse-slow delay-1000"></div>
        </div>

        {/* Main Content */}
        <section className="min-h-screen relative z-10 text-gray-900 dark:text-gray-200 px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8 md:mb-16">
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {gameName}
              </motion.h1>

              <motion.p
                className="max-w-2xl mx-auto text-xl text-gray-700 dark:text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Game Banner Image */}
                {bannerImageUrl && (
                  <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 p-1 rounded-2xl shadow-2xl mb-8 max-w-4xl w-full">
                    <div className="bg-black rounded-xl w-full h-full md:h-full mx-auto overflow-hidden relative">
                      <img 
                        src={bannerImageUrl} 
                        alt={gameName}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Download Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
                  {/* Windows Download */}
                  {windowsExeLink && (
                    <motion.a
                      href={windowsExeLink}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center"
                    >
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <FaWindows className="text-3xl" />
                        <div className="text-left">
                          <div className="text-sm opacity-80">FOR</div>
                          <div className="text-2xl font-bold">Windows</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaDownload />
                        <span>Download Installer</span>
                      </div>
                    </motion.a>
                  )}

                  {/* Android Download */}
                  {androidApkLink && (
                    <motion.a
                      href={androidApkLink}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center"
                    >
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <FaAndroid className="text-3xl" />
                        <div className="text-left">
                          <div className="text-sm opacity-80">FOR</div>
                          <div className="text-2xl font-bold">Android</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaDownload />
                        <span>Download APK</span>
                      </div>
                    </motion.a>
                  )}
                </div>

                {/* Play Store Link */}
                {playStoreLink && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8"
                  >
                    <a 
                      href={playStoreLink} 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 rounded-xl shadow-lg max-w-md flex items-center justify-center gap-3"
                    >
                      <FaGooglePlay className="text-2xl" />
                      <div>
                        <div className="font-bold">Available on Play Store</div>
                        <div className="text-sm">Official release with updates & cloud save</div>
                      </div>
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Game Features Section */}
            {gameFeatures.length > 0 && (
              <motion.div
                className="mb-16 md:mb-24"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-center mb-12"
                  variants={itemVariants}
                >
                  Game Features
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {gameFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-orange-200 dark:border-gray-700 h-full flex flex-col"
                      variants={itemVariants}
                      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                    >
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-2xl">{feature.icon || "⭐"}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 flex-grow">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Coming Soon Levels */}
            {upcomingLevels.length > 0 && (
              <motion.div
                className="mb-16 md:mb-24"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 text-white">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold">New Levels Coming Soon!</h2>
                      <p className="text-gray-300 mt-2">Exciting new environments and challenges</p>
                    </div>
                    <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold animate-pulse">
                      COMING SOON
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {upcomingLevels.map((level, index) => (
                      <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-900 w-full h-32 rounded-lg mb-4 flex items-center justify-center">
                          <span className="text-4xl">🎯</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{level.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{level.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 font-bold">{level.status}</span>
                          <FaStar className="text-yellow-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Developer Card */}
            {developerName && (
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-bold mb-4">Developed By Soft Game Studio</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <FaUsers className="text-orange-500 text-xl" />
                          <span className="text-lg">Professional Game Development Studio</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <FaGamepad className="text-red-500 text-xl" />
                          <span className="text-lg">Game: <strong>{gameName}</strong></span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <FaTrophy className="text-yellow-500 text-xl" />
                          <span className="text-lg">Developer: <strong>{developerName}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* System Requirements */}
            {(windowsRequirements.length > 0 || androidRequirements.length > 0) && (
              <motion.div
                className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-center mb-8">System Requirements</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {windowsRequirements.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FaWindows className="text-blue-500" />
                        Windows Requirements
                      </h3>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        {windowsRequirements.map((req, index) => (
                          <li key={index}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {androidRequirements.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FaAndroid className="text-green-500" />
                        Android Requirements
                      </h3>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        {androidRequirements.map((req, index) => (
                          <li key={index}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Final CTA */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">Ready to Play?</h2>
              <p className="max-w-2xl mx-auto text-lg mb-10 text-gray-700 dark:text-gray-300">
                Join thousands of players already enjoying {gameName}! Download now and start your adventure.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                {windowsExeLink && (
                  <a href={windowsExeLink}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      <FaWindows className="text-xl" />
                      <div>
                        <div className="text-sm">DOWNLOAD FOR</div>
                        <div className="text-xl font-bold">Windows</div>
                      </div>
                    </motion.button>
                  </a>
                )}
                
                {androidApkLink && (
                  <a href={androidApkLink}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-800 text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      <FaAndroid className="text-xl" />
                      <div>
                        <div className="text-sm">DOWNLOAD FOR</div>
                        <div className="text-xl font-bold">Android</div>
                      </div>
                    </motion.button>
                  </a>
                )}
              </div>
              
              {playStoreLink && (
                <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
                  *Also available on Play Store
                </p>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};
export default GamePage;