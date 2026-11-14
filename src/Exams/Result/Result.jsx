import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Helmet } from "react-helmet";
import {
  Trophy,
  Medal,
  Crown,
  Filter,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award,
} from "lucide-react";
import { fireDB } from "../../DataBase/firebaseConfig";
import LayoutExam from "../../components/layout/LayoutEaxm";

/**
 * Production-Grade Competition Results & Leaderboard
 * Soft Game Studio Examination Authority
 */
const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filtered by domain & search query (matching exam name, candidate name, or roll number)
  const filteredResults = useMemo(() => {
    let list = results;
    if (selectedLanguage !== "all") {
      list = list.filter((r) => r.language === selectedLanguage);
    }

    const queryClean = searchQuery.trim().toLowerCase();
    if (queryClean) {
      list = list
        .map((res) => {
          const matchExam =
            (res.examName && res.examName.toLowerCase().includes(queryClean)) ||
            (res.language && res.language.toLowerCase().includes(queryClean));

          if (matchExam) return res;

          // Filter winners within this exam
          const matchingWinners = (res.winners || []).filter(
            (w) =>
              (w.name && w.name.toLowerCase().includes(queryClean)) ||
              (w.rollNumber && String(w.rollNumber).toLowerCase().includes(queryClean))
          );

          if (matchingWinners.length > 0) {
            return { ...res, winners: matchingWinners };
          }

          return null;
        })
        .filter(Boolean);
    }

    return list;
  }, [results, selectedLanguage, searchQuery]);

  const resultLanguages = useMemo(() => {
    const languages = [...new Set(results.map((r) => r.language))];
    return ["all", ...languages].filter(Boolean);
  }, [results]);

  const totalCertifiedCount = useMemo(() => {
    return results.reduce((acc, curr) => acc + (curr.winners?.length || 0), 0);
  }, [results]);

  const RANK_BADGE_BG = [
    "bg-amber-400 text-neutral-950",
    "bg-neutral-300 text-neutral-950",
    "bg-amber-700 text-white",
  ];

  const RANK_LABELS = ["1st Place Champion", "2nd Place Runner-Up", "3rd Place Honor"];

  return (
    <LayoutExam>
      <Helmet>
        <title>Competition Results & Leaderboards | Soft Game Studio</title>
        <meta
          name="description"
          content="Official merit leaderboard and verified winners for Soft Game Studio competitive programming examinations, technical quizzes, and hackathons."
        />
        <meta
          name="keywords"
          content="Soft Game Studio Results, SGS Leaderboard, Coding Quiz Winners, Exam Merit List, Google Skill Verification"
        />
        <link rel="canonical" href="https://softgamestudios.web.app/Result" />
      </Helmet>

     
     
      <main className="min-h-screen bg-neutral-950 text-neutral-100 antialiased pb-20">
        {/* Header Hero Section */}
        <section className="relative border-b border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 pt-12 pb-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Trophy className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 & Proctoring Verified</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Official Competition Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Merit-authenticated rankings for Soft Game Studio competitive programming examinations.
              Search candidate roll numbers to inspect cryptographic performance credentials.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="block text-[11px] font-mono text-neutral-400 uppercase">Authenticated Winners</span>
                <span className="text-lg font-bold text-white font-mono">{totalCertifiedCount}+</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="block text-[11px] font-mono text-neutral-400 uppercase">Tracked Tracks</span>
                <span className="text-lg font-bold text-white font-mono">{results.length} Tracks</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="block text-[11px] font-mono text-neutral-400 uppercase">Proctoring Status</span>
                <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 100% Anti-Cheat
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {/* Controls Bar: Search & Domain Filters */}
          <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate name or roll number..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            {resultLanguages.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold uppercase tracking-wider shrink-0">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" /> Domain:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {resultLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedLanguage === lang
                          ? "bg-neutral-800 text-emerald-400 border border-neutral-700 font-semibold shadow-xs"
                          : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-neutral-200 hover:border-neutral-700"
                        }`}
                    >
                      {lang === "all" ? "All Tracks" : lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results State */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-neutral-300">
                Fetching certified competition results...
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800 p-16 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-neutral-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No Matching Records Found</h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
                No verified competition rankings match your current search or domain filter. Try resetting your search query or check back as official scores finalize.
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                >
                  Reset Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {filteredResults.map((result) => (
                <article
                  key={result.id}
                  className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl"
                >
                  {/* Card Header */}
                  <div className="bg-neutral-950 border-b border-neutral-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {result.language || "Technical"}
                        </span>
                        <span className="text-xs text-neutral-500">•</span>
                        <span className="text-xs text-neutral-400">Soft Game Studio Authority</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">{result.examName}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold">
                        <Medal className="w-4 h-4 text-emerald-400" />
                        <span>{result.winners?.length || 0} Authenticated Winners</span>
                      </span>
                    </div>
                  </div>

                  {/* Top 3 Podium Cards */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                      {result.winners?.slice(0, 3).map((winner, index) => (
                        <div
                          key={winner.id || winner.rollNumber || index}
                          className="rounded-2xl bg-neutral-950 border border-neutral-800 p-6 text-center flex flex-col justify-between hover:border-neutral-700 transition-colors shadow-sm"
                        >
                          <div>
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3 shadow-md ${RANK_BADGE_BG[index] || "bg-neutral-800 text-white"
                                }`}
                            >
                              {index + 1}
                            </div>
                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                              {RANK_LABELS[index] || `Top ${index + 1}`}
                            </span>
                            <h3 className="text-base font-bold text-white">{winner.name}</h3>
                            <p className="text-xs text-neutral-400 font-mono mt-0.5">
                              Roll: {winner.rollNumber}
                            </p>
                          </div>

                          <div className="mt-5 pt-4 border-t border-neutral-800/80 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Final Score</span>
                              <span className="text-base font-bold text-emerald-400 font-mono">
                                {winner.score} pts
                              </span>
                            </div>

                            {winner.rollNumber && (
                              <Link
                                to={`/Result/Certificates/${winner.rollNumber}`}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-neutral-200 hover:text-emerald-400 transition-colors"
                              >
                                <Award className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Verify Certificate</span>
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Top Performers List (4th+) */}
                    {result.winners && result.winners.length > 3 && (
                      <div className="border-t border-neutral-800 pt-6">
                        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-400" /> Honorable Mentions (Ranks 4+)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {result.winners.slice(3).map((winner, index) => (
                            <div
                              key={winner.id || winner.rollNumber || index}
                              className="flex items-center justify-between gap-3 bg-neutral-950/80 rounded-xl px-4 py-3 border border-neutral-800 hover:border-neutral-700 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                                  {index + 4}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-white text-xs truncate">{winner.name}</p>
                                  <p className="text-[11px] text-neutral-400 font-mono truncate">
                                    Roll: {winner.rollNumber} • {winner.score} pts
                                  </p>
                                </div>
                              </div>

                              {winner.rollNumber && (
                                <Link
                                  to={`/Result/Certificates/${winner.rollNumber}`}
                                  title="Verify Certificate"
                                  className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors shrink-0"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                </Link>
                              )}
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
    </LayoutExam>
  );
};

export default ResultsPage;