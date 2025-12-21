// src/pages/EbookCatalog.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { FaSearch, FaBook, FaSpinner, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fireDB } from '../../DataBase/firebaseConfig';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';

const EbookCatalog = () => {
  const [ebooks, setEbooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chapterCounts, setChapterCounts] = useState({});
  const headerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch chapter counts for each ebook
  const fetchChapterCounts = useCallback(async (ebooksData) => {
    try {
      const counts = {};
      
      const countPromises = ebooksData.map(async (ebook) => {
        const chaptersRef = collection(fireDB, `Ebooks/${ebook.id}/chapters`);
        const chaptersSnapshot = await getDocs(chaptersRef);
        counts[ebook.id] = chaptersSnapshot.size;
      });
      
      await Promise.all(countPromises);
      setChapterCounts(counts);
    } catch (err) {
      console.error('Error fetching chapter counts:', err);
      // Set default counts to 0 if fetching fails
      const defaultCounts = {};
      ebooksData.forEach(ebook => {
        defaultCounts[ebook.id] = 0;
      });
      setChapterCounts(defaultCounts);
    }
  }, []);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        setLoading(true);
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
        await fetchChapterCounts(ebooksData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ebooks:', err);
        setError('Failed to load ebooks. Please try again later.');
        setLoading(false);
      }
    };

    fetchEbooks();

    // Scroll listener for parallax and scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Parallax effect for header
      if (headerRef.current) {
        const scrollY = window.scrollY;
        headerRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchChapterCounts]);

  const filteredEbooks = ebooks.filter(ebook => 
    ebook.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // FIX: Ensure chapters open centered in the viewport
  const navigateToEbook = (ebookId) => {
    // Scroll to center before navigating
    const windowHeight = window.innerHeight;
    const scrollTarget = Math.max(0, window.scrollY + (windowHeight / 4));
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    
    // Navigate after slight delay to allow scroll animation
    setTimeout(() => {
      navigate(`/E-Books/${ebookId}`);
    }, 300);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.parentElement.innerHTML = '<div class="bg-purple-100 border-2 border-dashed border-purple-300 dark:border-neutral-700 rounded-xl w-full h-full flex items-center justify-center dark:bg-neutral-800"><FaBook class="h-12 w-12 text-purple-400 dark:text-purple-500"/></div>';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100 dark:bg-neutral-950 transition-colors duration-500">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300">Loading eBooks...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center bg-purple-100 dark:bg-neutral-950 p-4 transition-colors duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md dark:bg-red-900/30 dark:border-red-700 dark:text-red-200"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <p className="font-bold">Error loading eBooks</p>
          <p className="mt-2">{error}</p>
        </motion.div>
        <motion.button 
          onClick={() => window.location.reload()} 
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors dark:bg-purple-500 dark:hover:bg-purple-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Layout>
      <Helmet>
        <title>E-Books | Soft Game Studio</title>
        <meta 
          name="description" 
          content="Explore a wide range of free and affordable E-Books. Soft Game Studio offers Short Notes E books with pdf format" 
        />
        <meta 
          name="keywords" 
          content="Free E-Books, Affordable E-Books, Ebooks PDF, Full Detailed E-Book, languages E-Book, Student learning, Developer E-Books, Soft Game Studio E-books, Soft Game Studio" 
        />
        <meta name="author" content="Soft Game Studio" />
        <meta property="og:title" content="E-Books | Soft Game Studio" />
        <meta 
          property="og:description" 
          content="Free E-Books, Affordable E-Books, Ebooks PDF, Full Detailed E-Book, languages E-Book, Student learning, Developer E-Books, Soft Game Studio E-books, Soft Game Studio" 
        />
        <meta property="og:url" content="https://softgamestudios.web.app/E-Books" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 transition-colors duration-500 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Parallax Header */}
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-xl">
            <div 
              ref={headerRef}
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80')",
                willChange: 'transform'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-purple-600/30 dark:from-neutral-950/90 dark:to-neutral-950/50" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Digital Library
              </motion.h1>
              <motion.p 
                className="text-xl text-purple-100 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Explore our collection of eBooks on various topics. Learn something new every day!
              </motion.p>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div 
            className="relative mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Search eBooks by title or description..."
              className="w-full p-4 pl-12 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-lg bg-white text-gray-800 dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-200 dark:focus:ring-purple-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          {/* eBook Grid */}
          {filteredEbooks.length === 0 ? (
            <motion.div 
              className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaBook className="h-16 w-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No eBooks found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or check back later for new additions.</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredEbooks.map(ebook => (
                <motion.div 
                  key={ebook.id}
                  variants={item}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col">
                    <div className="h-56 overflow-hidden relative">
                      {ebook.coverImageURL ? (
                        <img loading="lazy" 
                          src={ebook.coverImageURL} 
                          alt={ebook.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="bg-purple-100 border-2 border-dashed border-purple-300 dark:border-neutral-700 rounded-xl w-full h-full flex items-center justify-center dark:bg-neutral-800">
                          <FaBook className="h-12 w-12 text-purple-400 dark:text-purple-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{ebook.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                        {ebook.description || 'No description available'}
                      </p>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-purple-100 dark:border-neutral-800">
                        <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                          {chapterCounts[ebook.id] || 0} chapters
                        </span>
                        <button 
                          onClick={() => navigateToEbook(ebook.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center dark:bg-purple-500 dark:hover:bg-purple-600"
                        >
                          Read Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <motion.button
            className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg z-50 dark:bg-purple-500"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </div>
    </Layout>
  );
};

export default EbookCatalog;