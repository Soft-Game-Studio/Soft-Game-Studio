import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaLock, FaPlay, FaCode, FaClock, FaInfoCircle, FaSearch } from "react-icons/fa";
import { useAuth } from "./../AuthProvide.jsx";
import { collection, getDocs, query } from "firebase/firestore";
import { fireDB } from "../DataBase/firebaseConfig";
import Layout from "../components/layout/Layout.jsx";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user?.email;

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(fireDB, "quizzes")));
        setQuizzes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      quizzes.forEach((quiz) => {
        if (quiz.examStart && quiz.examEnd) {
          const start = new Date(quiz.examStart).getTime();
          const end = new Date(quiz.examEnd).getTime();
          const now = Date.now();
          if (now < start) {
            const diff = start - now;
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            updated[quiz.id] = { status: "UPCOMING", text: d > 0 ? `Starts in ${d}d ${h}h` : `Starts in ${h}H ${m}M ${s}S` };
          } else if (now >= start && now <= end) {
            updated[quiz.id] = { status: "ACTIVE", text: "LIVE" };
          } else {
            updated[quiz.id] = { status: "ENDED", text: "Exam Ended" };
          }
        } else {
          updated[quiz.id] = { status: "ENDED", text: "No Schedule" };
        }
      });
      setTimers(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [quizzes]);

  const handleOpenQuiz = (quiz) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    navigate(`/SGS-Quiz-Official/${quiz.id}`);
  };

  const handleDetailsQuiz = (quiz) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    navigate(`/SGS-Details-Official/${quiz.id}`);
  };

  const filtered = quizzes.filter(q =>
    q.name?.toLowerCase().includes(search.toLowerCase()) ||
    q.language?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-950 gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-purple-600 dark:text-purple-400 font-medium">Loading competition exams...</p>
        </div>
      </Layout>
    );
  }

  const QuizCard = ({ quiz }) => {
    const isLocked = !isLoggedIn;
    const quizTimer = timers[quiz.id] || { status: "ENDED", text: "Ended" };
    const isActive = quizTimer.status === "ACTIVE";
    const isEnded = quizTimer.status === "ENDED";

    return (
      <div className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col">
        <div className={`h-1.5 w-full ${isActive ? "bg-gradient-to-r from-green-400 to-emerald-500" : isEnded ? "bg-gray-200 dark:bg-neutral-700" : "bg-gradient-to-r from-purple-500 to-indigo-500"}`}></div>

        <div className="p-5">
          <div className="relative h-44 bg-gray-50 dark:bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center mb-4">
            <img src={quiz.imageUrl} alt={quiz.name} className="h-full w-full object-contain" />
            {isActive && (
              <span className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>LIVE
              </span>
            )}
            {isEnded && (
              <span className="absolute top-2 right-2 bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full">Ended</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider mb-1">
            <FaCode className="w-3 h-3" /> {quiz.language || "General"}
          </div>
          <h3 className="font-bold text-gray-800 dark:text-white line-clamp-2 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {quiz.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {quiz.questions?.length || 0} questions · Shuffled every session
          </p>

          <div className="space-y-2">
            {isLocked ? (
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 py-2.5 px-4 rounded-xl text-sm font-medium"
              >
                <FaLock className="w-3 h-3" /> Login to Access
              </button>
            ) : isActive ? (
              <button
                onClick={() => handleOpenQuiz(quiz)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <FaPlay className="w-3 h-3" /> Start Exam
              </button>
            ) : isEnded ? (
              <div className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 py-2.5 px-4 rounded-xl text-sm font-medium cursor-not-allowed">
                Exam Closed
              </div>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 py-2.5 px-4 rounded-xl text-sm font-mono font-semibold">
                <FaClock className="w-3 h-3" /> {quizTimer.text}
              </div>
            )}
            <button
              onClick={() => handleDetailsQuiz(quiz)}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-xl text-sm border border-gray-200 dark:border-neutral-700 transition-colors"
            >
              <FaInfoCircle className="w-3 h-3 text-purple-500" /> View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
        {/* Hero */}
        <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-white/90 text-sm font-medium mb-4">
              🏆 Official Competition Exams
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">SGS Competition Quizzes</h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-8">
              Compete in live, timed exams with anti-cheat shuffling. Every session is unique.
            </p>
            <div className="relative max-w-md mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/90 dark:bg-neutral-800/90 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/20 backdrop-blur"
              />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="max-w-6xl mx-auto px-4 pt-8 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} exam{filtered.length !== 1 ? "s" : ""} found</p>
          {isLoggedIn && (
            <button
              onClick={() => navigate("/Official-Results")}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow transition-colors"
            >
              <FaTrophy className="w-3.5 h-3.5" /> Results
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">No Exams Found</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {search ? "Try a different search." : "No competition quizzes available right now."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuizList;