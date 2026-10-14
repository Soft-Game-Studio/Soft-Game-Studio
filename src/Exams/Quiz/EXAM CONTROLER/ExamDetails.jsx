import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Helmet } from "react-helmet";
import { motion, useReducedMotion } from "framer-motion";
import parse from "html-react-parser";
import {
  Play,
  Clock,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Code,
  ArrowLeft,
  Layers,
  HelpCircle,
  FileCheck2,
  Lock,
  Headphones,
  Info,
} from "lucide-react";
import { fireDB } from "../../../DataBase/firebaseConfig";
import Layout from "../../../components/layout/Layout";
import ExamPanelNav from "../../Common/ExamPanelNav";

/**
 * Production-Grade Examination Specification & Guidelines Page
 * Soft Game Studio Examination Authority
 */
const OfficialQuizDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let isMounted = true;

    const fetchExam = async () => {
      try {
        const docRef = doc(fireDB, "quizzes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && isMounted) {
          const examData = docSnap.data();
          setExam({
            ...examData,
            id: docSnap.id,
          });
        } else if (isMounted) {
          setExam(null);
        }
      } catch (error) {
        console.error("Error fetching examination details:", error);
        if (isMounted) setExam(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExam();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (!exam) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const startTime = exam.examStart ? new Date(exam.examStart).getTime() : null;
      const endTime = exam.examEnd ? new Date(exam.examEnd).getTime() : null;

      if (!startTime) {
        setTimeLeft(null);
        return;
      }

      if (endTime && now > endTime) {
        setTimeLeft("ENDED");
        clearInterval(interval);
        return;
      }

      if (now >= startTime) {
        setTimeLeft("STARTED");
        return;
      }

      const diff = startTime - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        setTimeLeft(
          `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(
            seconds
          ).padStart(2, "0")}s`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam]);

  const handleOpenQuiz = (examId, openInNewWindow = true) => {
    if (openInNewWindow) {
      window.open(`/Exam/${examId}`, "_blank", "toolbar=no,menubar=no,scrollbars=yes,resizable=yes,status=no");
    } else {
      navigate(`/Exam/${examId}`);
    }
  };

  // Structured Data Schema for Search
  const structuredData = useMemo(() => {
    if (!exam) return null;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Quiz",
      "name": exam.name,
      "about": {
        "@type": "Thing",
        "name": exam.language || "Computer Science",
      },
      "educationalLevel": "Intermediate to Advanced",
      "provider": {
        "@type": "Organization",
        "name": "Soft Game Studio",
        "url": "https://softgamestudios.web.app",
      },
    });
  }, [exam]);

  if (loading) {
    return (
      <Layout>
        <ExamPanelNav activeTab="exams" />
        <div className="flex flex-col justify-center items-center min-h-[75vh] bg-slate-950 gap-4">
          <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-md"></div>
          <p className="text-slate-400 font-medium text-sm">Retrieving examination syllabus...</p>
        </div>
      </Layout>
    );
  }

  if (!exam) {
    return (
      <Layout>
        <ExamPanelNav activeTab="exams" />
        <div className="flex flex-col items-center justify-center min-h-[75vh] bg-slate-950 text-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Examination Record Not Found</h2>
          <p className="text-slate-400 mb-8 max-w-md text-sm leading-relaxed">
            The requested assessment may have concluded, been archived, or had its identifier modified.
          </p>
          <button
            type="button"
            onClick={() => navigate("/Exam")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Examination Catalog</span>
          </button>
        </div>
      </Layout>
    );
  }

  const isLive = timeLeft === "STARTED";
  const isEnded = timeLeft === "ENDED";
  const questionCount = exam.questions?.length || 0;

  return (
    <Layout>
      <Helmet>
        <title>{`${exam.name} | Examination Specifications | Soft Game Studio`}</title>
        <meta
          name="description"
          content={`Review the rules, proctoring protocols, duration, and curriculum for ${exam.name} administered by Soft Game Studio.`}
        />
        <meta
          name="keywords"
          content={`${exam.name}, Soft Game Studio Quiz, ${exam.language} Exam, Coding Competition`}
        />
        <link rel="canonical" href={`https://softgamestudios.web.app/ExamDetails/${exam.id}`} />
        {structuredData && <script type="application/ld+json">{structuredData}</script>}
      </Helmet>

      {/* Unified Examination Panel Header */}
      <ExamPanelNav activeTab="exams" />

      <main className="min-h-screen bg-slate-950 text-slate-100 antialiased pb-20">
        {/* Hero Section */}
        <section className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-12 pb-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Breadcrumb back link */}
            <div className="flex justify-start mb-6">
              <Link
                to="/Exam"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Competitions</span>
              </Link>
            </div>

            {/* Credential Badge */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium mb-4 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Standardized Technical Assessment</span>
            </motion.div>

            {/* Examination Name */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
            >
              {exam.name}
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-base text-slate-400 max-w-xl mx-auto mb-8"
            >
              Assessment Domain:{" "}
              <span className="font-semibold text-emerald-400">{exam.language || "Computer Science"}</span>
            </motion.p>

            {/* Status & CTA Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {isLive ? (
                <button
                  type="button"
                  onClick={() => handleOpenQuiz(exam.id, true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Secure Full-Screen Window</span>
                </button>
              ) : isEnded ? (
                <div className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-slate-500 border border-slate-800 text-xs font-semibold">
                  Examination Concluded
                </div>
              ) : (
                <div className="w-full sm:w-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-sky-400 font-mono text-sm font-semibold border border-slate-800">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>{timeLeft ? `Starts in ${timeLeft}` : "Scheduled Assessment"}</span>
                </div>
              )}

              <a
                href="#specifications"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>Review Syllabus & Guidelines</span>
              </a>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div id="specifications" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Description & Syllabus */}
            <div className="lg:col-span-2 space-y-8">
              {/* Exam Overview Card */}
              <article className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>Syllabus & Curriculum Overview</span>
                </h2>

                <div className="prose dark:prose-invert max-w-none text-slate-300 text-sm leading-relaxed mb-6">
                  {parse(exam.description || "<p>Standardized domain evaluation for software engineering students and practitioners.</p>")}
                </div>

                {isLive && (
                  <div className="pt-6 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOpenQuiz(exam.id)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Assessment</span>
                    </button>
                  </div>
                )}
              </article>

              {/* Proctoring Rules */}
              <article className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Proctoring & Anti-Cheat Governance</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="font-semibold text-white block mb-1">
                      No Tab or Window Switching
                    </span>
                    <span className="text-slate-400">
                      Leaving the assessment tab triggers automated proctor warnings. Repeated infractions result in immediate disqualification.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="font-semibold text-white block mb-1">
                      Restricted Keystroke Operations
                    </span>
                    <span className="text-slate-400">
                      Clipboard cut/copy/paste, printscreen, developer inspection tools, and keyboard shortcuts are disabled during test sessions.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="font-semibold text-white block mb-1">
                      Randomized Question Sequences
                    </span>
                    <span className="text-slate-400">
                      Questions and choice sequences are dynamically permuted per candidate to prevent synchronous collusion.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="font-semibold text-white block mb-1">
                      Passing Grade & Certification
                    </span>
                    <span className="text-slate-400">
                      Achieving 50% or above generates an authenticated certificate with verifiable roll registry metadata.
                    </span>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Col: Quick Specifications Sidebar */}
            <aside className="space-y-6">
              {/* Media Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-3 mb-5">
                  {exam.imageUrl ? (
                    <img
                      src={exam.imageUrl}
                      alt={exam.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Code className="w-12 h-12 text-slate-600" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
                  Specification Snapshot
                </h3>

                <dl className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Assessment ID</dt>
                    <dd className="font-mono text-slate-200">{exam.id.slice(0, 8)}</dd>
                  </div>

                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Subject Domain</dt>
                    <dd className="font-semibold text-emerald-400">{exam.language || "General"}</dd>
                  </div>

                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Question Pool</dt>
                    <dd className="font-semibold text-slate-200">{questionCount} items</dd>
                  </div>

                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Evaluation Type</dt>
                    <dd className="text-slate-200">Multiple Choice Matrix</dd>
                  </div>

                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Issuing Body</dt>
                    <dd className="text-slate-200">Soft Game Studio</dd>
                  </div>
                </dl>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <Link
                    to="/About-Exam"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>General Examination FAQs</span>
                  </Link>
                </div>
              </div>

              {/* Support Callout */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span>Technical Support Desk</span>
                </div>
                <p className="leading-relaxed mb-3">
                  Experiencing authentication anomalies or session connectivity issues during test hours?
                </p>
                <Link
                  to="/ContactUs"
                  className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2"
                >
                  Contact Candidate Administration
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default OfficialQuizDetails;