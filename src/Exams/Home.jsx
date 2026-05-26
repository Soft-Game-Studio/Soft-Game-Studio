import React, { useState, useEffect } from 'react';
import { FaPlay, FaCode, FaTrophy, FaCrown, FaUsers, FaQuestionCircle, FaClock, FaLock, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../DataBase/firebaseConfig";
import Layout from '../components/layout/Layout';
import { useAuth } from '../AuthProvide';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Carousel slides
  const slides = [
    { id: 1, title: "Official Competitions", description: "Participate in live timed coding challenges and earn certificates." },
    { id: 2, title: "Global Leaderboard", description: "Track your rank and compare performance against peer developers." },
    { id: 3, title: "Verifiable Certifications", description: "Unlock secure certificates of completion automatically sent to you." },
  ];

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const [totalUser, setTotalUser] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'upcoming', 'completed'

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "quizzes"));
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Timer and Status Calculations
  useEffect(() => {
    if (quizzes.length === 0) return;

    const interval = setInterval(() => {
      const updatedTimers = {};
      const now = Date.now();

      quizzes.forEach((quiz) => {
        const startTime = quiz.examStart ? new Date(quiz.examStart).getTime() : null;
        const endTime   = quiz.examEnd   ? new Date(quiz.examEnd).getTime()   : null;

        if (!startTime || !endTime) {
          updatedTimers[quiz.id] = { status: "UPCOMING", text: "Upcoming" };
          return;
        }

        if (now > endTime) {
          updatedTimers[quiz.id] = { status: "ENDED", text: "Exam Ended" };
          return;
        }

        if (now >= startTime) {
          updatedTimers[quiz.id] = { status: "STARTED", text: "LIVE" };
          return;
        }

        const diff = startTime - now;
        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          updatedTimers[quiz.id] = { status: "UPCOMING", text: `Starts in ${days}d ${hours}h` };
        } else {
          updatedTimers[quiz.id] = { status: "UPCOMING", text: `${hours}H ${minutes}M ${seconds}S` };
        }
      });

      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizzes]);

  // Fetch total users
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const userSnapshot = await getDocs(collection(fireDB, "users"));
        setTotalUser(userSnapshot.size);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    fetchUserCount();
  }, []);

  const handleOpenQuiz = (quiz) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/SGS-Quiz-Official/${quiz.id}`);
  };

  const handleDetailsQuiz = (quiz) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/SGS-Details-Official/${quiz.id}`);
  };

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePasskeySubmit = () => {
    if (passkeyInput === 'sgs0612') {
      setAccessGranted(true);
    } else {
      alert('Incorrect Passkey. Please try again.');
      setPasskeyInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePasskeySubmit();
    }
  };

  // Filter quizzes into their tabs
  const getCategorizedQuizzes = () => {
    return quizzes.filter((quiz) => {
      const state = timers[quiz.id]?.status || "UPCOMING";
      if (activeTab === 'live') return state === "STARTED";
      if (activeTab === 'upcoming') return state === "UPCOMING";
      return state === "ENDED";
    });
  };

  if (!accessGranted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[85vh] bg-gradient-to-br from-slate-50 to-purple-50 dark:from-neutral-950 dark:to-purple-950/20 px-4 transition-colors duration-300">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-8 rounded-3xl shadow-glow border border-purple-100 dark:border-neutral-800 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FaLock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold mb-3 text-gray-800 dark:text-white">Secure Portal</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your authorized passkey to unlock the SGS Quiz Panel</p>
            
            <input
              type="password"
              className="w-full p-4 border border-purple-200 dark:border-neutral-700 rounded-2xl mb-4 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/60 dark:bg-neutral-800/60 dark:text-white transition-all text-lg placeholder-gray-400 dark:placeholder-gray-600 font-mono tracking-widest"
              placeholder="••••••••"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePasskeySubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-2xl hover:shadow-lg transition-all"
            >
              Verify Passkey
            </motion.button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const categorizedList = getCategorizedQuizzes();

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        
        {/* Dynamic Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-800 dark:from-purple-950 dark:via-indigo-950 dark:to-neutral-950 py-20 lg:py-28 px-4 text-center">
          {/* Animated Background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-pulse delay-700"></div>
          </div>

          <div className="relative max-w-5xl mx-auto flex flex-col items-center">
            {/* Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mb-6"
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-glow border border-white/20">
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/App%2Fsplash.png?alt=media&token=c839a793-40d5-4cab-b5e1-d2215493de83" 
                  className="w-16 h-16 rounded-2xl" 
                  alt="SGS Logo" 
                />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4"
            >
              SGS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-200 to-amber-200">EXAMS</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-purple-100 max-w-2xl mb-10 leading-relaxed font-light"
            >
              Take part in official, anti-cheat coding quizzes, secure verified certifications, and level up your software skills.
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <button 
                onClick={() => navigate('/SGS-Quiz-Official')}
                className="bg-white hover:bg-slate-100 text-purple-700 font-semibold py-3.5 px-8 rounded-2xl shadow-lg transition-all transform hover:scale-[1.03]"
              >
                Explore Live Exams
              </button>
              <button 
                onClick={() => navigate('/Official-Results')}
                className="bg-purple-600/30 hover:bg-purple-600/40 text-white font-semibold py-3.5 px-8 rounded-2xl border border-white/20 backdrop-blur transition-all"
              >
                View Leaderboard
              </button>
            </motion.div>
          </div>
        </section>

        {/* Info Slider Section */}
        <section className="py-12 px-4 max-w-5xl mx-auto -mt-10 relative z-10">
          <div className="bg-white dark:bg-neutral-900 border border-purple-50 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="relative h-60 flex items-center justify-center px-8 text-center bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-900/60">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-xl"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2">
                    {slides[currentSlide].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-purple-600 w-6' : 'bg-purple-300 dark:bg-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Tabs & Competition Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Competition Quizzes</h2>
            <p className="text-gray-500 dark:text-gray-400">Select status tab below to browse official coding quizzes</p>
          </div>

          {/* Custom Navigation Tabs */}
          <div className="flex justify-center mb-8 bg-purple-50/50 dark:bg-neutral-900/60 p-1.5 rounded-2xl max-w-md mx-auto border border-purple-100/30 dark:border-neutral-800/40">
            {[
              { id: 'live', label: 'Live Now', count: quizzes.filter(q => timers[q.id]?.status === 'STARTED').length },
              { id: 'upcoming', label: 'Upcoming', count: quizzes.filter(q => timers[q.id]?.status === 'UPCOMING').length },
              { id: 'completed', label: 'Completed', count: quizzes.filter(q => timers[q.id]?.status === 'ENDED').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-neutral-800 text-purple-700 dark:text-gray-300'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* List display */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="text-purple-600 dark:text-purple-400 font-medium">Loading competition exams...</p>
            </div>
          ) : categorizedList.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-purple-100/10 dark:border-neutral-800/40 rounded-3xl p-16 text-center shadow-sm">
              <div className="text-5xl mb-4 text-purple-300">📅</div>
              <h3 className="text-xl font-bold mb-1">No Quizzes Available</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">There are no quizzes currently active in this category. Check other tabs or look back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorizedList.map((quiz) => {
                const quizTimer = timers[quiz.id] || { status: 'UPCOMING', text: 'Loading...' };
                const isStarted = quizTimer.status === 'STARTED';
                const isEnded = quizTimer.status === 'ENDED';

                return (
                  <motion.div
                    key={quiz.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white dark:bg-neutral-900 border border-purple-50/50 dark:border-neutral-800 rounded-3xl shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    {/* Status accent bar */}
                    <div className={`h-1.5 w-full ${isStarted ? 'bg-gradient-to-r from-emerald-400 to-green-500' : isEnded ? 'bg-gray-300 dark:bg-neutral-800' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}></div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      {/* Cover container */}
                      <div className="relative h-44 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl overflow-hidden flex items-center justify-center mb-4">
                        <img 
                          src={quiz.imageUrl || "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400"} 
                          className="max-h-full max-w-full object-contain" 
                          alt={quiz.name} 
                        />
                        {isStarted && (
                          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>LIVE
                          </span>
                        )}
                        {isEnded && (
                          <span className="absolute top-3 right-3 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200/20">
                            Ended
                          </span>
                        )}
                      </div>

                      {/* Header details */}
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase mb-1.5">
                        <FaCode className="w-3 h-3" /> {quiz.language || "Programming"}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                        {quiz.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                        {quiz.questions?.length || 0} questions · Fischer-Yates Shuffled
                      </p>

                      {/* Footer actions */}
                      <div className="mt-auto space-y-2">
                        {isStarted ? (
                          <button
                            onClick={() => handleOpenQuiz(quiz)}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md transition-all"
                          >
                            <FaPlay className="w-3 h-3" /> Enter Exam
                          </button>
                        ) : isEnded ? (
                          <div className="w-full flex items-center justify-center bg-slate-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed">
                            Registration Closed
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 py-2.5 rounded-xl text-sm font-mono font-semibold border border-purple-100 dark:border-purple-900/30">
                            <FaClock className="w-3 h-3 text-purple-500" /> {quizTimer.text}
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleDetailsQuiz(quiz)}
                          className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-neutral-800/40 hover:bg-slate-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-neutral-800 transition-all font-medium"
                        >
                          <FaCalendarAlt className="w-3.5 h-3.5 text-purple-500" /> Details & Schedule
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Global Statistics Section */}
        <section className="py-16 px-4 bg-gradient-to-tr from-purple-900 to-indigo-950 text-white text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Join a Global Developer Pool</h2>
            <p className="text-purple-200 mb-12 max-w-xl mx-auto text-sm md:text-base font-light">Test your proficiency against software engineers from around the world.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-lg">
                <FaUsers className="w-10 h-10 text-purple-300 mx-auto mb-4" />
                <h3 className="text-4xl font-black mb-1">{totalUser}</h3>
                <p className="text-xs text-purple-200 uppercase tracking-widest font-bold">Active Competitors</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-lg">
                <FaTrophy className="w-10 h-10 text-amber-300 mx-auto mb-4" />
                <h3 className="text-4xl font-black mb-1">{quizzes.length}</h3>
                <p className="text-xs text-purple-200 uppercase tracking-widest font-bold">Total Hosted Exams</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default HomePage;