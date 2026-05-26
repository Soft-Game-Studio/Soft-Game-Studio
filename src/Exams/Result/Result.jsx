import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import Layout from "../../components/layout/Layout";
import { FaTrophy, FaMedal, FaCrown, FaFilter } from "react-icons/fa";
import { fireDB } from "../../DataBase/firebaseConfig";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const fetchResults = async () => {
    try {
      const q = query(collection(fireDB, "results"), where("display", "==", true));
      const snapshot = await getDocs(q);
      setResults(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  const filteredResults = selectedLanguage === "all"
    ? results
    : results.filter(r => r.language === selectedLanguage);

  const getResultLanguages = () => {
    const languages = [...new Set(results.map(r => r.language))];
    return ["all", ...languages].filter(Boolean);
  };

  const RANK_GRADIENT = [
    "from-yellow-400 to-amber-400",
    "from-gray-300 to-gray-400",
    "from-amber-600 to-amber-700",
  ];
  const RANK_LABELS = ["🥇 1st", "🥈 2nd", "🥉 3rd"];
  const RANK_BADGE_BG = [
    "bg-yellow-400",
    "bg-gray-300 dark:bg-gray-400",
    "bg-amber-600",
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-purple-600 dark:text-purple-400 font-medium">Loading results...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
        {/* Hero */}
        <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-20 w-72 h-72 bg-yellow-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur">
              <FaTrophy className="w-10 h-10 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Competition Results</h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              Congratulations to all participants! Here are the top performers across all SGS quiz competitions.
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {getResultLanguages().length > 1 && (
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
                <FaFilter className="w-3.5 h-3.5" /> Filter:
              </div>
              <div className="flex flex-wrap gap-2">
                {getResultLanguages().map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selectedLanguage === lang
                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                        : "bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-neutral-700 hover:border-purple-400 dark:hover:border-purple-500"
                    }`}
                  >
                    {lang === "all" ? "All Languages" : lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {filteredResults.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-16 text-center border border-gray-100 dark:border-neutral-800">
              <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTrophy className="text-5xl text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Results Coming Soon</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                The competition results are being finalized by our judging panel. Please check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-neutral-800"
                >
                  {/* Card header */}
                  <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{result.examName}</h2>
                        <p className="text-purple-200 text-sm mt-1">{result.language} · Competition</p>
                      </div>
                      <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-semibold">
                        <FaMedal /> {result.winners.length} Winners
                      </span>
                    </div>
                  </div>

                  {/* Top 3 */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                      {result.winners.slice(0, 3).map((winner, index) => (
                        <div key={winner.id || index} className={`bg-gradient-to-br ${RANK_GRADIENT[index] || "from-purple-500 to-indigo-500"} p-0.5 rounded-2xl shadow-lg`}>
                          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 h-full text-center">
                            <div className={`w-14 h-14 ${RANK_BADGE_BG[index] || "bg-purple-500"} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow`}>
                              {index + 1}
                            </div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                              {RANK_LABELS[index] || `Top ${index + 1}`}
                            </p>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{winner.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Roll: {winner.rollNumber}</p>
                            <div className="mt-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl px-4 py-2">
                              <p className="text-purple-700 dark:text-purple-300 font-bold text-lg">Score: {winner.score}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 4th+ */}
                    {result.winners.length > 3 && (
                      <>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FaCrown className="text-purple-400 w-3.5 h-3.5" /> Other Top Performers
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {result.winners.slice(3).map((winner, index) => (
                            <div
                              key={winner.id || index}
                              className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-neutral-700"
                            >
                              <span className="w-8 h-8 min-w-[2rem] bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 4}
                              </span>
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-white text-sm">{winner.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Roll: {winner.rollNumber} · Score: {winner.score}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;