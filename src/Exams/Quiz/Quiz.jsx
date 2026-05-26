import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaClock, FaCode, FaInfoCircle, FaSearch } from "react-icons/fa";

const OfficialQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = {};
      quizzes.forEach((quiz) => {
        if (quiz.examStart && quiz.examEnd) {
          const startTime = new Date(quiz.examStart).getTime();
          const endTime = new Date(quiz.examEnd).getTime();
          const now = Date.now();

          if (now < startTime) {
            const diff = startTime - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            updatedTimers[quiz.id] = {
              status: "UPCOMING",
              text: days > 0 ? `Starts in ${days}d ${hours}h` : `Starts in ${hours}H ${minutes}M ${seconds}S`,
            };
          } else if (now >= startTime && now <= endTime) {
            updatedTimers[quiz.id] = { status: "ACTIVE", text: "LIVE" };
          } else {
            updatedTimers[quiz.id] = { status: "ENDED", text: "Exam Ended" };
          }
        } else {
          updatedTimers[quiz.id] = { status: "UPCOMING", text: "Upcoming" };
        }
      });
      setTimers(updatedTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [quizzes]);

  const filtered = quizzes.filter(q =>
    q.name?.toLowerCase().includes(search.toLowerCase()) ||
    q.language?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-neutral-950">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500 border-t-transparent"></div>
            <p className="text-purple-600 dark:text-purple-400 font-medium">Loading exams...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-white/90 text-sm font-medium mb-4">
              🏆 Official Competition Exams
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">SGS Quiz Exams</h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-8">
              Test your skills in live, timed competitions. Questions and options are randomized every session.
            </p>
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or language..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/90 dark:bg-neutral-800/90 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/20 backdrop-blur"
              />
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">No Exams Found</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {search ? "Try a different search term." : "No exams available right now. Check back later!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((quiz) => {
                const quizTimer = timers[quiz.id] || { status: "UPCOMING", text: "Upcoming" };
                const isActive = quizTimer.status === "ACTIVE";
                const isEnded = quizTimer.status === "ENDED";

                return (
                  <div
                    key={quiz.id}
                    className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col"
                  >
                    {/* Status ribbon */}
                    <div className={`h-1.5 w-full ${isActive ? "bg-gradient-to-r from-green-400 to-emerald-500" : isEnded ? "bg-gray-300 dark:bg-neutral-700" : "bg-gradient-to-r from-purple-500 to-indigo-500"}`}></div>

                    {/* Image */}
                    <div className="px-5 pt-5">
                      <div className="relative h-44 bg-gray-50 dark:bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center">
                        <img
                          src={quiz.imageUrl}
                          alt={quiz.name}
                          className="h-full w-full object-contain"
                        />
                        {/* Live badge */}
                        {isActive && (
                          <span className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            LIVE
                          </span>
                        )}
                        {isEnded && (
                          <span className="absolute top-2 right-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Ended
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider mb-1">
                        <FaCode className="w-3 h-3" /> {quiz.language || "General"}
                      </div>
                      <h2 className="text-base font-bold text-gray-800 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {quiz.name}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {quiz.questions?.length || 0} questions · Randomized order
                      </p>

                      {/* Timer */}
                      <div className="mt-auto space-y-2">
                        {isActive ? (
                          <button
                            onClick={() => navigate(`/SGS-Quiz-Official/${quiz.id}`)}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl py-2.5 text-sm shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <FaPlay className="w-3 h-3" /> Start Exam
                          </button>
                        ) : isEnded ? (
                          <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 font-medium rounded-xl py-2.5 text-sm cursor-not-allowed"
                          >
                            Exam Closed
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-mono text-sm font-semibold rounded-xl py-2.5 border border-purple-200 dark:border-purple-800">
                            <FaClock className="w-3 h-3" /> {quizTimer.text}
                          </div>
                        )}

                        <button
                          onClick={() => navigate(`/SGS-Details-Official/${quiz.id}`)}
                          className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl py-2.5 text-sm border border-gray-200 dark:border-neutral-700 transition-colors"
                        >
                          <FaInfoCircle className="w-3 h-3 text-purple-500" /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OfficialQuizList;