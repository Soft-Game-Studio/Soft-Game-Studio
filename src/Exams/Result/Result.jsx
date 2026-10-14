import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Helmet } from "react-helmet";
import { Trophy, Medal, Crown, Filter, Award, CheckCircle2, Layers } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { fireDB } from "../../DataBase/firebaseConfig";
import ExamPanelNav from "../Common/ExamPanelNav";

/**
 * Production-Grade Competition Results & Leaderboard
 * Soft Game Studio Examination Authority
 */
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

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = useMemo(() => {
    return selectedLanguage === "all"
      ? results
      : results.filter((r) => r.language === selectedLanguage);
  }, [results, selectedLanguage]);

  const resultLanguages = useMemo(() => {
    const languages = [...new Set(results.map((r) => r.language))];
    return ["all", ...languages].filter(Boolean);
  }, [results]);

  const RANK_BADGE_BG = [
    "bg-amber-400 text-slate-950",
    "bg-slate-300 text-slate-950",
    "bg-amber-700 text-white",
  ];

  const RANK_LABELS = ["1st Place Champion", "2nd Place Runner-Up", "3rd Place Honor"];

  return (
    <Layout>
      <Helmet>
        <title>Competition Results & Leaderboards | Soft Game Studio</title>
        <meta
          name="description"
          content="Official merit leaderboard and verified winners for Soft Game Studio competitive programming examinations and quizzes."
        />
        <meta
          name="keywords"
          content="Soft Game Studio Results, SGS Leaderboard, Coding Quiz Winners, Exam Merit List"
        />
        <link rel="canonical" href="https://softgamestudios.web.app/Result" />
      </Helmet>

      {/* Unified Exam Panel Navigation */}
      <ExamPanelNav activeTab="results" />

      <main className="min-h-screen bg-slate-950 text-slate-100 antialiased pb-20">
        {/* Header Hero Section */}
        <section className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-12 pb-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Official Competition Results
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Congratulations to all candidates. Top scoring participants across verified competitive
              assessments are authenticated and featured below.
            </p>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Filter Bar */}
          {resultLanguages.length > 1 && (
            <div className="flex items-center gap-3 mb-8 flex-wrap p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filter Domain:
              </div>
              <div className="flex flex-wrap gap-2">
                {resultLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedLanguage === lang
                        ? "bg-slate-800 text-emerald-400 border border-slate-700 font-semibold shadow-xs"
                        : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    {lang === "all" ? "All Domains" : lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results State */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-300">
                Fetching certified competition results...
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-16 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-slate-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Results Finalization in Progress</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                Official scores are currently being validated by our proctoring review board. Authenticated
                leaderboards will publish automatically upon completion.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredResults.map((result) => (
                <article
                  key={result.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl"
                >
                  {/* Card Header */}
                  <div className="bg-slate-950 border-b border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">{result.examName}</h2>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span className="text-emerald-400 font-semibold">{result.language}</span>
                        <span>•</span>
                        <span>Official SGS Competition</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                      <Medal className="w-4 h-4 text-emerald-400" />
                      <span>{result.winners?.length || 0} Authenticated Winners</span>
                    </span>
                  </div>

                  {/* Top 3 Podium Cards */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                      {result.winners?.slice(0, 3).map((winner, index) => (
                        <div
                          key={winner.id || index}
                          className="rounded-2xl bg-slate-950 border border-slate-800 p-6 text-center flex flex-col justify-between"
                        >
                          <div>
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3 shadow-md ${
                                RANK_BADGE_BG[index] || "bg-slate-800 text-white"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              {RANK_LABELS[index] || `Top ${index + 1}`}
                            </span>
                            <h3 className="text-base font-bold text-white">{winner.name}</h3>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              Roll: {winner.rollNumber}
                            </p>
                          </div>

                          <div className="mt-5 pt-4 border-t border-slate-800/80">
                            <span className="text-xs text-slate-400 block mb-0.5">Final Score</span>
                            <span className="text-lg font-bold text-emerald-400 font-mono">
                              {winner.score} pts
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Top Performers List (4th+) */}
                    {result.winners && result.winners.length > 3 && (
                      <div className="border-t border-slate-800 pt-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-400" /> Honorable Mentions (Ranks 4+)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {result.winners.slice(3).map((winner, index) => (
                            <div
                              key={winner.id || index}
                              className="flex items-center gap-3 bg-slate-950/80 rounded-xl px-4 py-3 border border-slate-800"
                            >
                              <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 rounded-full flex items-center justify-center text-xs font-bold font-mono">
                                {index + 4}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-white text-xs truncate">{winner.name}</p>
                                <p className="text-[11px] text-slate-400 font-mono truncate">
                                  Roll: {winner.rollNumber} • {winner.score} pts
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ResultsPage;