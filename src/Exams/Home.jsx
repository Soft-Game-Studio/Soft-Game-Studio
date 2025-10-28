// src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { FaPlay, FaCode, FaTrophy, FaCrown, FaUsers, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { fireDB } from "../DataBase/firebaseConfig";
import Layout from '../components/layout/Layout';
import { useAuth } from '../AuthProvide';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Image slides for the carousel
  const slides = [
    { id: 1, title: "Weekly Quiz Challenge", description: "Test your knowledge every week!" },
    { id: 2, title: "Compete with Friends", description: "Challenge your friends and climb the leaderboard" },
    { id: 3, title: "Earn Achievements", description: "Unlock badges and show off your expertise" },
  ];

  const [freeQuizzes, setFreeQuizzes] = useState([]);
  const [officialQuizzes, setOfficialQuizzes] = useState([]);
  const [weeklyQuizzes, setWeeklyQuizzes] = useState([]);
  const [timers, setTimers] = useState({});
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');

  // Fetch free quizzes (top 4)
  useEffect(() => {
    const fetchFreeQuizzes = async () => {
      try {
        const q = query(collection(fireDB, "quizzesfree"), limit(4));
        const querySnapshot = await getDocs(q);
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });
        setFreeQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching free quizzes:", error);
      } 
    };
    fetchFreeQuizzes();
  }, []);

  // Fetch official quizzes (top 4)
  useEffect(() => {
    const fetchOfficialQuizzes = async () => {
      try {
        const q = query(collection(fireDB, "quizzes"), limit(4));
        const querySnapshot = await getDocs(q);
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });
        setOfficialQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching official quizzes:", error);
      } 
    };
    fetchOfficialQuizzes();
  }, []);

  // Fetch weekly quizzes (top 4)
  useEffect(() => {
    const fetchWeeklyQuizzes = async () => {
      try {
        const q = query(collection(fireDB, "Dailyquizzes"), limit(4));
        const querySnapshot = await getDocs(q);
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });
        setWeeklyQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching weekly quizzes:", error);
      } 
    };
    fetchWeeklyQuizzes();
  }, []);

  // Timer effect for quizzes
  useEffect(() => {
    const allQuizzes = [...freeQuizzes, ...officialQuizzes, ...weeklyQuizzes];
    const interval = setInterval(() => {
      const updatedTimers = {};
      allQuizzes.forEach((quiz) => {
        if (quiz.examPage) {
          const examTime = new Date(quiz.examPage).getTime();
          const now = new Date().getTime();
          const timeLeft = examTime - now;
    
          if (timeLeft <= 0) {
            updatedTimers[quiz.id] = "STARTED";
          } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            if (days > 0) {
              updatedTimers[quiz.id] = `${days} days `;
            } else {   
              updatedTimers[quiz.id] = `${hours}H ${minutes}M ${seconds}S`; 
            }
          }
        }
      });
      setTimers(updatedTimers);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [freeQuizzes, officialQuizzes, weeklyQuizzes]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total quizzes and questions
        const freeSnapshot = await getDocs(collection(fireDB, "quizzesfree"));
        const officialSnapshot = await getDocs(collection(fireDB, "quizzes"));
        const weeklySnapshot = await getDocs(collection(fireDB, "Dailyquizzes"));
        
        const allQuizzes = [
          ...freeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          ...officialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          ...weeklySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        ];

        const quizCount = allQuizzes.length;
        const questionCount = allQuizzes.reduce((acc, quiz) => {
          return acc + (quiz.questions?.length || 0);
        }, 0);

        setTotalQuizzes(quizCount);
        setTotalQuestions(questionCount);

        // Fetch total users
        const userSnapshot = await getDocs(collection(fireDB, "users"));
        setTotalUser(userSnapshot.size);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleOpenQuiz = (quiz, type) => {
    if ((type === 'official' || type === 'weekly') && !user) {
      navigate('/login');
      return;
    }
    
    navigate(`/SGS-Quiz-${type}/${quiz.id}`);
  };

  const handleSeeAll = (type) => {
    if ((type === 'Official' || type === 'Weekly') && !user) {
      navigate('/login');
      return;
    }
    
    navigate(`/SGS-Quiz-${type}`);
  };

  const handleSeeResults = (type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    navigate(`/${type}-Results`);
  };

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const QuizSection = ({ title, quizzes, type, icon }) => {
    const typeLower = type.toLowerCase();
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6 dark:bg-neutral-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            {icon} <span className="ml-2">{title}</span>
          </h2>
          <div className="flex space-x-2">
            {(typeLower === 'official' || typeLower === 'weekly') && (
              <button 
                onClick={() => handleSeeResults(type)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-1 px-3 rounded-lg flex items-center"
              >
                <FaTrophy className="mr-1" /> Results
              </button>
            )}
            <button 
              onClick={() => handleSeeAll(type)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium py-1 px-3 rounded-lg border border-purple-600 hover:border-purple-800"
            >
              See All
            </button>
          </div>
        </div>
        
        {quizzes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No quizzes available</p>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                className="rounded-lg p-4 flex justify-between items-center border-l-4 border-purple-500 bg-gray-50 dark:bg-neutral-800 dark:border-purple-400"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-white truncate">{quiz.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <FaCode className="mr-1 text-purple-500" /> 
                    <span>{quiz.language || 'General'}</span>
                    <span className="mx-2">•</span>
                    <span>{quiz.questions?.length || 0} questions</span>
                  </div>
                </div>
                
                {timers[quiz.id] === "STARTED" ? 
                  <button 
                    onClick={() => handleOpenQuiz(quiz, typeLower)} 
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors whitespace-nowrap ml-2"
                  >
                    Play
                  </button>
                  :
                  <button 
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm whitespace-nowrap ml-2"
                    disabled
                  >
                    {timers[quiz.id] || "Upcoming"}
                  </button>
                }
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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

  if (!accessGranted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-950">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Enter Passkey to Access Home Page</h2>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              placeholder="Enter Passkey"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handlePasskeySubmit}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-neutral-950 dark:to-purple-900/20 transition-colors duration-300">
    {/* Enhanced Hero Section */}
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          {/* Logo and Branding */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/App%2Fsplash.png?alt=media&token=c839a793-40d5-4cab-b5e1-d2215493de83" 
                  className="w-16 h-16 rounded-lg"
                  alt="SGS Quiz"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            SGS <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-200">QUIZ</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Test your knowledge, challenge friends, and become a trivia master in our interactive learning platform!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => navigate('/DailyQuiz')}
              className="group relative bg-white text-purple-600 font-semibold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3">
                <FaPlay className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Play Weekly Quiz</span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </button>
            
            <button 
              onClick={() => navigate('/SGS-Quiz')}
              className="group border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              Explore All Quizzes
            </button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{totalUser}+</div>
              <div className="text-white/70 text-sm">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{totalQuizzes}+</div>
              <div className="text-white/70 text-sm">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{totalQuestions}+</div>
              <div className="text-white/70 text-sm">Questions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 text-gray-50 dark:text-neutral-950" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>

    {/* Modern Image Slider */}
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative h-80 md:h-96">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800"></div>
                <div className="relative h-full flex items-center justify-center text-center px-8">
                  <div className="max-w-2xl">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {slide.title}
                    </h3>
                    <p className="text-xl text-white/90">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Slider Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            →
          </button>
        </div>
      </div>
    </section>

    {/* Enhanced Quiz Sections */}
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Quiz Categories</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from a variety of quiz types designed to challenge and entertain players of all levels
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Quizzes Card */}
          <div className="group bg-white dark:bg-neutral-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-neutral-800">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  <FaQuestionCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                  Free
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Free Quizzes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Access our collection of free quizzes covering various topics and difficulty levels
              </p>

              <QuizSection 
                title="" 
                quizzes={freeQuizzes} 
                type="Free" 
                icon={null}
              />
            </div>
          </div>

          {/* Official Quizzes Card */}
          {user ? (
            <div className="group bg-white dark:bg-neutral-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-neutral-800">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
                    <FaCrown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-medium rounded-full">
                    Premium
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Official Quizzes
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Premium curated quizzes with expert-level questions and detailed analytics
                </p>

                <QuizSection 
                  title="" 
                  quizzes={officialQuizzes} 
                  type="Official" 
                  icon={null}
                />
              </div>
            </div>
          ) : (
            <div className="group bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <FaCrown className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                      Premium
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Official Quizzes
                  </h3>
                  <p className="text-white/90 mb-6">
                    Unlock premium features and exclusive content by creating an account
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-white text-amber-600 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Sign In to Access
                </button>
              </div>
            </div>
          )}

          {/* Weekly Quizzes Card */}
          {user ? (
            <div className="group bg-white dark:bg-neutral-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-neutral-800">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                    <FaTrophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-full">
                    Weekly
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Weekly Challenges
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Compete in time-limited challenges and climb the global leaderboard
                </p>

                <QuizSection 
                  title="" 
                  quizzes={weeklyQuizzes} 
                  type="Weekly" 
                  icon={null}
                />
              </div>
            </div>
          ) : (
            <div className="group bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <FaTrophy className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                      Weekly
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Weekly Challenges
                  </h3>
                  <p className="text-white/90 mb-6">
                    Join weekly competitions and showcase your skills against players worldwide
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Sign In to Compete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* Enhanced Stats Section */}
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-12 md:py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join Our Growing Community
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Be part of thousands of players who are already enjoying our quiz platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{totalUser}</div>
                  <div className="text-white/80 font-medium">Active Players</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaCrown className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{totalQuizzes}</div>
                  <div className="text-white/80 font-medium">Available Quizzes</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaQuestionCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{totalQuestions}</div>
                  <div className="text-white/80 font-medium">Total Questions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Enhanced CTA Section */}
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your Quiz Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join millions of players worldwide in the ultimate trivia experience. Challenge yourself, learn something new, and have fun!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/SGS-Quiz')}
              className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center space-x-3">
                <span>Explore All Quizzes</span>
                <FaPlay className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            {!user && (
              <button 
                onClick={() => navigate('/register')}
                className="group border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 font-semibold py-4 px-8 rounded-2xl hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-white transition-all duration-300"
              >
                Create Free Account
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  </div>
</Layout>
  );
};

export default HomePage;