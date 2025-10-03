import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaLock, FaPlay, FaCode, FaClock,  FaInfoCircle  } from "react-icons/fa";
import { useAuth } from "./../AuthProvide.jsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireDB } from "../DataBase/firebaseConfig";
import Layout from "../components/layout/Layout.jsx";

const QuizList = () => {
  const [activeTab, setActiveTab] = useState("free");
  const [freeQuizzes, setFreeQuizzes] = useState([]);
  const [officialQuizzes, setOfficialQuizzes] = useState([]);
  const [weeklyQuizzes, setWeeklyQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is logged in
  const isLoggedIn = !!user?.email;

  // Fetch quizzes based on type
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        // Fetch free quizzes
        const freeQuery = query(collection(fireDB, "quizzesfree"));
        const freeSnapshot = await getDocs(freeQuery);
        const freeData = freeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFreeQuizzes(freeData);

        // Fetch official quizzes
        const officialQuery = query(collection(fireDB, "quizzes"));
        const officialSnapshot = await getDocs(officialQuery);
        const officialData = officialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOfficialQuizzes(officialData);

        // Fetch weekly quizzes
        const weeklyQuery = query(collection(fireDB, "Dailyquizzes"));
        const weeklySnapshot = await getDocs(weeklyQuery);
        const weeklyData = weeklySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWeeklyQuizzes(weeklyData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
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

  const handleOpenQuiz = (quiz, type) => {
    if ((type === 'official' || type === 'weekly') && !isLoggedIn) {
      navigate('/login');
      return;
    }
    
    navigate(`/SGS-Quiz-${type}/${quiz.id}`);
  };


  const handleDetailsQuiz = (quiz, type) => {
    if ((type === 'official' || type === 'weekly') && !isLoggedIn) {
      navigate('/login');
      return;
    }

    navigate(`/SGS-Details-${type}/${quiz.id}`);
  };

  const handleSeeResults = (type) => {
    navigate(`/SGS-Quiz-${type}-Result`);
  };

  const QuizCard = ({ quiz, type }) => {
    const typeLower = type.toLowerCase();
    const isLocked = (typeLower === 'official' || typeLower === 'weekly') && !isLoggedIn;
    
    return (
   <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500 dark:bg-neutral-800 transition-all duration-300 hover:shadow-lg">
  {/* Image on top */}
  <div className="flex justify-center">
    <img
      src={quiz.imageUrl}
      alt={quiz.name}
      className="h-40 sm:h-48 w-full object-contain object-center rounded-lg mb-4"
    />
  </div>

  {/* Content */}
  <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-2">
    {quiz.name}
  </h3>

  <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300 flex-wrap">
    <FaCode className="mr-1 text-purple-500" />
    <span>{quiz.language || "General"}</span>
    <span className="mx-2">•</span>
    <span>{quiz.questions?.length || 0} questions</span>
  </div>

  {quiz.description && (
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
      {quiz.description}
    </p>
  )}

  {/* Actions */}
  <div className="flex flex-wrap items-center gap-3 mt-4">
    {isLocked ? (
      <div className="flex flex-col items-center">
        <FaLock className="text-amber-500 text-xl" />
        <span className="text-xs text-amber-500 mt-1">Login Required</span>
      </div>
    ) : timers[quiz.id] === "STARTED" ? (
      <button
        onClick={() => handleOpenQuiz(quiz, typeLower)}
        className="flex items-center bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors"
      >
        <FaPlay className="mr-1" /> Play
      </button>
    ) : (
      <div className="flex flex-col items-center">
        <FaClock className="text-gray-500 text-xl" />
        <span className="text-xs text-gray-500 mt-1 whitespace-nowrap">
          {timers[quiz.id] || "Upcoming"}
        </span>
      </div>
    )}

    {/* Details Button */}
    <button
      onClick={() => handleDetailsQuiz(quiz, typeLower)}
      className="flex items-center bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors"
    >
      <FaInfoCircle className="mr-1" /> Details
    </button>
  </div>
</div>


    );
  };

  const TabContent = ({ type, quizzes }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if ((type === 'official' || type === 'weekly') && !isLoggedIn) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-neutral-800">
          <FaLock className="text-5xl text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Authentication Required</h2>
          <p className="text-gray-600 mb-6 dark:text-gray-300">
            You need to be logged in to access {type} quizzes.
          </p>
          <button
            onClick={() => navigate('/Login')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Go to Login Page
          </button>
        </div>
      );
    }

    if (quizzes.length === 0) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-neutral-800">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">No Quizzes Available</h2>
          <p className="text-gray-600 dark:text-gray-300">
            There are no {type} quizzes available at the moment.
          </p>
        </div>
      );
    }

    return (
      <div>
        {(type === 'official' || type === 'weekly') && isLoggedIn && (
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => handleSeeResults(type)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg flex items-center"
            >
              <FaTrophy className="mr-2" /> {type} Results
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} type={type} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout> <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">Available Quizzes</h1>
        <p className="text-gray-600 mb-8 dark:text-gray-300">Test your knowledge with our various quiz categories</p>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            className={`py-3 px-6 font-medium text-sm flex items-center ${
              activeTab === "free" 
                ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("free")}
          >
            <FaPlay className="mr-2" /> Free Quizzes
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm flex items-center ${
              activeTab === "official" 
                ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("official")}
          >
            <FaLock className="mr-2" /> Official Quizzes
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm flex items-center ${
              activeTab === "weekly" 
                ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("weekly")}
          >
            <FaTrophy className="mr-2" /> Weekly Quizzes
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow dark:bg-neutral-800">
          {activeTab === "free" && <TabContent type="free" quizzes={freeQuizzes} />}
          {activeTab === "official" && <TabContent type="official" quizzes={officialQuizzes} />}
          {activeTab === "weekly" && <TabContent type="weekly" quizzes={weeklyQuizzes} />}
        </div>
      </div>
    </div>
    </Layout>
   
  );
};

export default QuizList;