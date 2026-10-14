import React, { useState, useEffect, useMemo, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Clock,
  Code,
  Info,
  Play,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Award,
  Trophy,
  ShieldCheck,
  X,
  ChevronRight,
  Filter,
  Check,
  HelpCircle,
} from "lucide-react";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../../components/layout/Layout";
import ExamPanelNav from "../Common/ExamPanelNav";

/**
 * Isolated Countdown and Status Component
 * Tracks individual quiz timer locally to prevent parent-level re-render thrashing.
 */
const ExamStatusTracker = ({ examStart, examEnd }) => {
  const [timerState, setTimerState] = useState(() => calculateStatus(examStart, examEnd));

  function calculateStatus(start, end) {
    if (!start || !end) {
      return { status: "UPCOMING", label: "Scheduled", isLive: false, isEnded: false };
    }

    const now = Date.now();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (now < startTime) {
      const diff = startTime - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const label =
        days > 0
          ? `Starts in ${days}d ${hours}h`
          : `Starts in ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

      return { status: "UPCOMING", label, isLive: false, isEnded: false };
    } else if (now >= startTime && now <= endTime) {
      return { status: "ACTIVE", label: "Live Assessment", isLive: true, isEnded: false };
    } else {
      return { status: "ENDED", label: "Concluded", isLive: false, isEnded: true };
    }
  }

  useEffect(() => {
    // Only set an interval if not concluded or if approaching a transition
    const interval = setInterval(() => {
      setTimerState(calculateStatus(examStart, examEnd));
    }, 1000);

    return () => clearInterval(interval);
  }, [examStart, examEnd]);

  if (timerState.isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        LIVE NOW
      </span>
    );
  }

  if (timerState.isEnded) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
        Concluded
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-sky-400 border border-slate-700">
      <Clock className="w-3.5 h-3.5 text-sky-400" />
      {timerState.label}
    </span>
  );
};

/**
 * Production-Grade Official Quiz & Examination Portal
 * Soft Game Studio Examination Authority
 */
const OfficialQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'live', 'upcoming', 'concluded'
  const [languageFilter, setLanguageFilter] = useState("all");
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Fetch quizzes from Firestore
  useEffect(() => {
    let isMounted = true;

    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "quizzes"));
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });

        if (isMounted) {
          setQuizzes(quizzesData);
        }
      } catch (error) {
        console.error("Error fetching examination catalog:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQuizzes();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute status helper
  const getExamStatus = useCallback((quiz) => {
    if (!quiz.examStart || !quiz.examEnd) return "UPCOMING";
    const now = Date.now();
    const startTime = new Date(quiz.examStart).getTime();
    const endTime = new Date(quiz.examEnd).getTime();

    if (now >= startTime && now <= endTime) return "ACTIVE";
    if (now > endTime) return "ENDED";
    return "UPCOMING";
  }, []);

  // Extract unique languages
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    quizzes.forEach((q) => {
      if (q.language) langs.add(q.language);
    });
    return ["all", ...Array.from(langs)];
  }, [quizzes]);

  // Aggregate stats
  const catalogStats = useMemo(() => {
    let liveCount = 0;
    let upcomingCount = 0;
    let totalQuestions = 0;

    quizzes.forEach((quiz) => {
      const status = getExamStatus(quiz);
      if (status === "ACTIVE") liveCount += 1;
      if (status === "UPCOMING") upcomingCount += 1;
      totalQuestions += quiz.questions?.length || 0;
    });

    return {
      totalExams: quizzes.length,
      liveCount,
      upcomingCount,
      totalQuestions,
    };
  }, [quizzes, getExamStatus]);

  // Filtered examinations
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      // Search matching
      const queryText = search.trim().toLowerCase();
      const nameMatch = quiz.name?.toLowerCase().includes(queryText);
      const langMatch = quiz.language?.toLowerCase().includes(queryText);
      const matchesSearch = !queryText || nameMatch || langMatch;

      // Status matching
      const currentStatus = getExamStatus(quiz);
      let matchesStatus = true;
      if (statusFilter === "live") matchesStatus = currentStatus === "ACTIVE";
      if (statusFilter === "upcoming") matchesStatus = currentStatus === "UPCOMING";
      if (statusFilter === "concluded") matchesStatus = currentStatus === "ENDED";

      // Language matching
      const matchesLanguage =
        languageFilter === "all" || quiz.language?.toLowerCase() === languageFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesLanguage;
    });
  }, [quizzes, search, statusFilter, languageFilter, getExamStatus]);

  // Structured Data (JSON-LD) for SEO
  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/Exam#webpage",
          "url": "https://softgamestudios.web.app/Exam",
          "name": "Official Programming Examination Portal | Soft Game Studio",
          "description":
            "Browse, schedule, and take proctored computer science and software development competitions administered by Soft Game Studio.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://softgamestudios.web.app/#website",
            "name": "Soft Game Studio",
            "url": "https://softgamestudios.web.app",
          },
        },
        {
          "@type": "ItemList",
          "name": "Soft Game Studio Official Competitions",
          "itemListElement": quizzes.slice(0, 10).map((quiz, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Quiz",
              "name": quiz.name,
              "educationalLevel": "Intermediate to Advanced",
              "about": {
                "@type": "Thing",
                "name": quiz.language || "Computer Programming",
              },
            },
          })),
        },
      ],
    });
  }, [quizzes]);

  return (
    <Layout>
      <Helmet>
        <title>Official Examination & Assessment Portal | Soft Game Studio</title>
        <meta
          name="description"
          content="Access live timed programming competitions, technical assessments, and proctored coding exams. Earn verifiable credentials from Soft Game Studio."
        />
        <meta
          name="keywords"
          content="Soft Game Studio Quiz, SGS Exam, Programming Competitions, Coding Exam, Developer Assessment, Online Proctored Quiz"
        />
        <link rel="canonical" href="https://softgamestudios.web.app/Exam" />
        <meta property="og:title" content="Official Examination & Assessment Portal | Soft Game Studio" />
        <meta
          property="og:description"
          content="Participate in live timed coding competitions, take technical assessments, and earn verifiable certifications."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      {/* Unified Examination Panel Header Navigation */}
      <ExamPanelNav activeTab="exams" />

      <main className="min-h-screen bg-slate-950 text-slate-100 antialiased pb-20">
        {/* Hero Section */}
        <section className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-12 pb-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Tagline */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium mb-5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Proctored Assessments & Verifiable Credentials</span>
            </motion.div>

            {/* Primary Headline */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
            >
              Official Examination & Evaluation Portal
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Test your engineering knowledge in timed, proctored developer competitions. Questions are
              randomized every session, and verified passing scores earn official digital credentials.
            </motion.p>

            {/* Quick Metrics Bar */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-left"
            >
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider block">
                  Active Live
                </span>
                <span className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  {catalogStats.liveCount}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider block">
                  Upcoming
                </span>
                <span className="text-xl font-bold text-sky-400 mt-0.5 block">
                  {catalogStats.upcomingCount}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider block">
                  Total Assessments
                </span>
                <span className="text-xl font-bold text-slate-200 mt-0.5 block">
                  {catalogStats.totalExams}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider block">
                  Question Bank
                </span>
                <span className="text-xl font-bold text-slate-200 mt-0.5 block">
                  {catalogStats.totalQuestions}+
                </span>
              </div>
            </motion.div>

            {/* Quick Action Navigation CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/Result"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>View Winner Leaderboards</span>
              </Link>
              <Link
                to="/Result/Certificates"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Verify Your Certificate</span>
              </Link>
              <Link
                to="/About-Exam"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>Anti-Cheat Guidelines</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Catalog and Filters Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Controls Bar: Search + Status Tabs + Language Selection */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-8 border-b border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search assessments by name or language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                aria-label="Search examinations"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Controls Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Segmented Buttons */}
              <div
                role="radiogroup"
                aria-label="Filter by exam status"
                className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs"
              >
                {[
                  { id: "all", label: "All" },
                  { id: "live", label: "Live Now" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "concluded", label: "Concluded" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="radio"
                    aria-checked={statusFilter === tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      statusFilter === tab.id
                        ? "bg-slate-800 text-emerald-400 font-semibold shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Language Dropdown Filter */}
              {availableLanguages.length > 2 && (
                <div className="flex items-center gap-1.5">
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
                    aria-label="Filter by language"
                  >
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang === "all" ? "All Domains" : lang}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary and Active Count */}
          <div className="flex items-center justify-between py-4 text-xs text-slate-400">
            <span>
              Showing{" "}
              <strong className="text-slate-200">{filteredQuizzes.length}</strong> of{" "}
              <strong className="text-slate-200">{quizzes.length}</strong> registered assessments
            </span>
            {(search || statusFilter !== "all" || languageFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setLanguageFilter("all");
                }}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-300">
                Loading competitive examination schedules...
              </p>
              <p className="text-xs text-slate-500 mt-1">Connecting to Soft Game Studio cloud database</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center max-w-md mx-auto rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-slate-500" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">No Matching Examinations Found</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {search || statusFilter !== "all" || languageFilter !== "all"
                  ? "No competitions matched your current filter criteria. Try adjusting or clearing your filters."
                  : "There are currently no active competitions scheduled. New examinations are published weekly."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setLanguageFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => {
                const status = getExamStatus(quiz);
                const isActive = status === "ACTIVE";
                const isEnded = status === "ENDED";
                const questionCount = quiz.questions?.length || 0;

                return (
                  <article
                    key={quiz.id}
                    className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between overflow-hidden transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-black/60"
                  >
                    <div>
                      {/* Top Status Accent Border */}
                      <div
                        className={`h-1 w-full ${
                          isActive
                            ? "bg-emerald-500"
                            : isEnded
                            ? "bg-slate-700"
                            : "bg-sky-500"
                        }`}
                      />

                      {/* Card Media Preview */}
                      <div className="p-5 pb-3">
                        <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center">
                          {quiz.imageUrl ? (
                            <img
                              src={quiz.imageUrl}
                              alt={`Official cover for ${quiz.name} examination`}
                              loading="lazy"
                              className="h-full w-full object-contain p-4 group-hover:scale-102 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                              <Code className="w-10 h-10 text-slate-500" />
                              <span className="text-xs font-mono">SGS Examination</span>
                            </div>
                          )}

                          {/* Floating Status Badge */}
                          <div className="absolute top-2.5 right-2.5">
                            <ExamStatusTracker
                              examStart={quiz.examStart}
                              examEnd={quiz.examEnd}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="px-5 py-2">
                        {/* Domain Tag */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                          <Code className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{quiz.language || "General Computer Science"}</span>
                        </div>

                        {/* Exam Title */}
                        <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                          {quiz.name}
                        </h2>

                        {/* Exam Specifications */}
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-slate-500" />
                            {questionCount} Questions
                          </span>
                          <span className="text-slate-700">•</span>
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                            Anti-Cheat Monitored
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-5 pt-4 border-t border-slate-800/80 space-y-2 mt-4 bg-slate-950/40">
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              `/Exam/${quiz.id}`,
                              "_blank",
                              "toolbar=no,menubar=no,scrollbars=yes,resizable=yes,status=no"
                            )
                          }
                          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl py-2.5 text-xs transition-all shadow-md hover:shadow-emerald-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Launch Secure Assessment</span>
                        </button>
                      ) : isEnded ? (
                        <button
                          type="button"
                          disabled
                          className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-500 font-medium rounded-xl py-2.5 text-xs cursor-not-allowed border border-slate-700/60"
                        >
                          Assessment Concluded
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(`/ExamDetails/${quiz.id}`)}
                          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium rounded-xl py-2.5 text-xs border border-slate-700 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>View Schedule & Countdown</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => navigate(`/ExamDetails/${quiz.id}`)}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium rounded-xl py-2.5 text-xs border border-slate-800 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        <span>Exam Rules & Syllabus</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Informational Guidance Section: Optimizes for Google AI Overviews and Candidate Understanding */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-slate-800">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Examination Governance
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Assessment Standards & Candidate Integrity
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Soft Game Studio administers standardized evaluations designed to validate real-world
              software engineering competency. Review the operational protocols governing all active
              sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Automated Proctoring Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exam sessions enforce full-screen integrity checks, background tab monitoring, and keystroke
                restrictions. Unapproved tab switches trigger immediate disqualification to preserve meritocracy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sky-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Randomized Question Matrices</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every candidate receives a distinct, randomized permutation of questions and option sequences
                generated dynamically from verified domain question pools.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Tamper-Proof Digital Credentials</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Candidates scoring 50% or above earn cryptographic certificates with unique roll identifiers
                verifiable on public resumes, LinkedIn credentials, and the central registry.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default OfficialQuizList;