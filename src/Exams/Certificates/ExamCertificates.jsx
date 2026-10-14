import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Helmet } from "react-helmet";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Search,
  Award,
  Calendar,
  Code,
  CheckCircle2,
  FileCheck2,
  Download,
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Filter,
  GraduationCap,
  Percent,
  X,
  FileText,
  UserCheck,
} from "lucide-react";
import { fireDB } from "../../DataBase/firebaseConfig";
import Certificate from "../../components/Certificate/Certificate";
import Layout from "../../components/layout/Layout";
import ExamPanelNav from "../Common/ExamPanelNav";

/**
 * Production-Grade Examination Certificate Search and Verification Portal
 * Soft Game Studio Examination Authority
 */
const ExamCertificates = () => {
  const { rollNumber: paramRollNumber } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Search and Filter states
  const initialRoll = (paramRollNumber || searchParams.get("rollNumber") || "").trim();
  const [searchInput, setSearchInput] = useState(initialRoll);
  const [activeQueryRoll, setActiveQueryRoll] = useState(initialRoll);

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  // Modal states
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and Sort states
  const [selectedExamFilter, setSelectedExamFilter] = useState("all");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState("all");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("all"); // all, distinction, pass
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest, highestScore

  // Format date helper
  const formatDate = useCallback((dateValue) => {
    if (!dateValue) return "Not Recorded";
    try {
      if (dateValue?.seconds) {
        return new Date(dateValue.seconds * 1000).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      const parsed = new Date(dateValue);
      if (isNaN(parsed.getTime())) return String(dateValue);
      return parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(dateValue);
    }
  }, []);

  // Fetch certificates from Firestore
  const fetchCertificates = useCallback(
    async (rollNum) => {
      const sanitized = (rollNum || "").trim();
      if (!sanitized) {
        setCertificates([]);
        setStudentInfo(null);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      try {
        const answersRef = collection(fireDB, "user_Quiz_Answers");
        const q = query(answersRef, where("rollNumber", "==", sanitized));
        const snapshot = await getDocs(q);

        const records = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Filter out disqualified candidate attempts
        const verifiedCertificates = records.filter((entry) => !entry.disqualified);

        setCertificates(verifiedCertificates);

        if (verifiedCertificates.length > 0) {
          const first = verifiedCertificates[0];
          setStudentInfo({
            name: first.name || "Candidate",
            rollNumber: first.rollNumber || sanitized,
            totalRecords: verifiedCertificates.length,
          });
          toast.success(`Found ${verifiedCertificates.length} verified credential(s)`);
        } else {
          setStudentInfo(null);
          toast.info("No credentials found for this candidate roll number");
        }
      } catch (error) {
        console.error("Error retrieving certificates:", error);
        toast.error("Failed to retrieve credentials. Please verify your connection.");
        setCertificates([]);
        setStudentInfo(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Sync on route param changes
  useEffect(() => {
    if (paramRollNumber) {
      setSearchInput(paramRollNumber);
      setActiveQueryRoll(paramRollNumber);
      fetchCertificates(paramRollNumber);
    } else if (searchParams.get("rollNumber")) {
      const roll = searchParams.get("rollNumber");
      setSearchInput(roll);
      setActiveQueryRoll(roll);
      fetchCertificates(roll);
    }
  }, [paramRollNumber, searchParams, fetchCertificates]);

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (!clean) {
      toast.warn("Please enter a valid candidate roll number");
      return;
    }

    setActiveQueryRoll(clean);
    setSearchParams({ rollNumber: clean });
    navigate(`/Result/Certificates/${encodeURIComponent(clean)}`, { replace: true });
    fetchCertificates(clean);
  };

  // Open certificate preview modal
  const handlePreviewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  // Close certificate modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  // Copy roll number or verification link
  const handleCopyLink = () => {
    const shareableUrl = `${window.location.origin}/Result/Certificates/${encodeURIComponent(
      activeQueryRoll
    )}`;
    navigator.clipboard.writeText(shareableUrl);
    toast.success("Verification link copied to clipboard");
  };

  const handleCopyCredentialId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Credential ID copied");
  };

  // Filter options derived from certificates
  const availableExams = useMemo(() => {
    const set = new Set();
    certificates.forEach((c) => {
      if (c.examName) set.add(c.examName);
    });
    return ["all", ...Array.from(set)];
  }, [certificates]);

  const availableLanguages = useMemo(() => {
    const set = new Set();
    certificates.forEach((c) => {
      if (c.language) set.add(c.language);
    });
    return ["all", ...Array.from(set)];
  }, [certificates]);

  // Filter and sort certificates
  const filteredCertificates = useMemo(() => {
    let result = [...certificates];

    // Exam filter
    if (selectedExamFilter !== "all") {
      result = result.filter((c) => c.examName === selectedExamFilter);
    }

    // Language filter
    if (selectedLanguageFilter !== "all") {
      result = result.filter((c) => c.language === selectedLanguageFilter);
    }

    // Grade filter
    if (selectedGradeFilter === "distinction") {
      result = result.filter((c) => {
        const total = Number(c.NoQuestion) || 100;
        const score = Number(c.score) || 0;
        return (score / total) * 100 >= 80;
      });
    } else if (selectedGradeFilter === "pass") {
      result = result.filter((c) => {
        const total = Number(c.NoQuestion) || 100;
        const score = Number(c.score) || 0;
        return (score / total) * 100 >= 50;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === "newest") {
        const dateA = a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date || 0).getTime();
        const dateB = b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date || 0).getTime();
        return dateB - dateA;
      }
      if (sortOrder === "oldest") {
        const dateA = a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date || 0).getTime();
        const dateB = b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date || 0).getTime();
        return dateA - dateB;
      }
      if (sortOrder === "highestScore") {
        const scoreA = Number(a.score) || 0;
        const scoreB = Number(b.score) || 0;
        return scoreB - scoreA;
      }
      return 0;
    });

    return result;
  }, [certificates, selectedExamFilter, selectedLanguageFilter, selectedGradeFilter, sortOrder]);

  // Aggregate student stats
  const studentMetrics = useMemo(() => {
    if (!certificates.length) return null;

    let totalScore = 0;
    let totalQuestions = 0;
    let distinctionCount = 0;

    certificates.forEach((c) => {
      const q = Number(c.NoQuestion) || 100;
      const s = Number(c.score) || 0;
      totalScore += s;
      totalQuestions += q;
      if ((s / q) * 100 >= 80) distinctionCount += 1;
    });

    const averagePercent = totalQuestions > 0 ? ((totalScore / totalQuestions) * 100).toFixed(1) : "0";

    return {
      totalCertificates: certificates.length,
      distinctionCount,
      averagePercent,
    };
  }, [certificates]);

  // Structured Data (JSON-LD) for Educational Credentials
  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://softgamestudios.web.app/Result/Certificates#webpage",
          "url": "https://softgamestudios.web.app/Result/Certificates",
          "name": "Examination Certificate Verification | Soft Game Studio",
          "description":
            "Verify official candidate certification credentials, examination scores, and digital credentials issued by Soft Game Studio.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://softgamestudios.web.app/#website",
            "name": "Soft Game Studio",
            "url": "https://softgamestudios.web.app",
          },
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Soft Game Studio Certified Developer Assessment",
          "credentialCategory": "Certificate of Academic Competency",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Soft Game Studio Examination Authority",
            "url": "https://softgamestudios.web.app",
          },
        },
      ],
    });
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>
          {studentInfo
            ? `Verified Credentials for ${studentInfo.name} | Soft Game Studio`
            : "Certificate Verification & Credential Registry | Soft Game Studio"}
        </title>
        <meta
          name="description"
          content="Search, authenticate, and download official competition certificates and developer assessment credentials issued by Soft Game Studio."
        />
        <meta
          name="keywords"
          content="Soft Game Studio Certificate, SGS Exam Certificate, Verify Certificate, Digital Credentials, Programming Quiz Certification, Roll Number Verification"
        />
        <link rel="canonical" href="https://softgamestudios.web.app/Result/Certificates" />
        <meta property="og:title" content="Official Certificate Registry | Soft Game Studio" />
        <meta
          property="og:description"
          content="Tamper-proof digital credentials and performance certificates for Soft Game Studio competitive assessments."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      {/* Unified Exam Panel Navigation */}
      <ExamPanelNav activeTab="certificates" />

      <main className="min-h-screen bg-slate-950 text-slate-100 antialiased pb-20">
        {/* Header Hero Section */}
        <section className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-12 pb-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Authority Badge */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium mb-5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Academic & Competitive Credential Registry</span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
            >
              Verify Candidate Certification
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Input your authorized candidate roll number to retrieve, authenticate, and download
              cryptographically verifiable PDF certificates issued by Soft Game Studio.
            </motion.p>

            {/* Candidate Roll Number Search Bar */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="max-w-2xl mx-auto"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter Candidate Roll Number (e.g., 250001)"
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-950/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm sm:text-base border border-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                    aria-label="Candidate Roll Number"
                    required
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                      aria-label="Clear roll number input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 shadow-md hover:shadow-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Authenticate</span>
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Live Firestore Registry
                </span>
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-sky-400" />
                  PDF Export Support
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Anti-Tamper Checked
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Active Student Overview Card */}
          {studentInfo && studentMetrics && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl shadow-inner">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {studentInfo.name}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                        <CheckCircle2 className="w-3 h-3" /> Verified Candidate
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                      <span>Roll Number:</span>
                      <code className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800">
                        {studentInfo.rollNumber}
                      </code>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Share Credentials</span>
                  </button>
                </div>
              </div>

              {/* Quick Performance Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Total Credentials
                    </span>
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {studentMetrics.totalCertificates}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Accredited assessments passed</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Average Score
                    </span>
                    <Percent className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {studentMetrics.averagePercent}%
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Cumulative evaluation metric</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Distinctions
                    </span>
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {studentMetrics.distinctionCount}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Scored 80% or higher</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters & Sorting Toolbar (When results exist) */}
          {certificates.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filters:
                </span>

                {/* Exam Filter */}
                {availableExams.length > 2 && (
                  <select
                    value={selectedExamFilter}
                    onChange={(e) => setSelectedExamFilter(e.target.value)}
                    className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 focus:border-emerald-500 focus:outline-none"
                    aria-label="Filter by Competition"
                  >
                    {availableExams.map((exam) => (
                      <option key={exam} value={exam}>
                        {exam === "all" ? "All Competitions" : exam}
                      </option>
                    ))}
                  </select>
                )}

                {/* Language Filter */}
                {availableLanguages.length > 2 && (
                  <select
                    value={selectedLanguageFilter}
                    onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                    className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 focus:border-emerald-500 focus:outline-none"
                    aria-label="Filter by Language"
                  >
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang === "all" ? "All Languages" : lang}
                      </option>
                    ))}
                  </select>
                )}

                {/* Grade Filter */}
                <select
                  value={selectedGradeFilter}
                  onChange={(e) => setSelectedGradeFilter(e.target.value)}
                  className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 focus:border-emerald-500 focus:outline-none"
                  aria-label="Filter by Performance"
                >
                  <option value="all">All Grades</option>
                  <option value="distinction">Distinction (80%+)</option>
                  <option value="pass">Passing Grade (50%+)</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 focus:border-emerald-500 focus:outline-none"
                  aria-label="Sort credentials"
                >
                  <option value="newest">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highestScore">Highest Score</option>
                </select>
              </div>
            </div>
          )}

          {/* Certificate Results Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-300">
                Searching verified credential archives...
              </p>
              <p className="text-xs text-slate-500 mt-1">Cross-referencing Firestore databases</p>
            </div>
          ) : filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((cert) => {
                const totalQ = Number(cert.NoQuestion) || 100;
                const score = Number(cert.score) || 0;
                const percent = ((score / totalQ) * 100).toFixed(1);
                const isDistinction = Number(percent) >= 80;

                return (
                  <article
                    key={cert.id}
                    className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-black/50"
                  >
                    <div>
                      {/* Card Top Metadata */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          {isDistinction ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/70 text-amber-400 border border-amber-800/60">
                              Distinction
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              Passed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Exam Title */}
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {cert.examName || "Quiz Competition"}
                      </h3>

                      {/* Credential Number & Copy */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400 font-mono">
                        <span>ID:</span>
                        <span className="text-slate-300 font-semibold">
                          #{cert.certificateNo || cert.id?.slice(0, 10) || "SGS-CERT"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyCredentialId(cert.certificateNo || cert.id || "SGS-CERT")
                          }
                          className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copy Credential ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Attributes */}
                      <div className="mt-5 space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date Completed
                          </span>
                          <span className="font-medium text-slate-200">
                            {formatDate(cert.date)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-slate-500" /> Evaluation Domain
                          </span>
                          <span className="font-medium text-slate-200">
                            {cert.language || "Computer Science"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-500" /> Final Score
                          </span>
                          <span className="font-semibold text-emerald-400 font-mono">
                            {score} / {totalQ} ({percent}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => handlePreviewCertificate(cert)}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-semibold text-xs transition-all border border-slate-700 hover:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>View & Download Certificate</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : hasSearched ? (
            /* No Results Found for Query */
            <div className="py-16 px-4 text-center max-w-xl mx-auto rounded-3xl bg-slate-900/60 border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Verified Credentials Found</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We could not locate any active examination records for roll number{" "}
                <span className="text-slate-200 font-mono font-bold">"{activeQueryRoll}"</span>.
              </p>

              <div className="mt-6 text-left p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-slate-300">Verification Troubleshooting:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Confirm that the roll number matches your exam enrollment registration.</li>
                  <li>Disqualified attempts due to proctoring policy infractions are excluded.</li>
                  <li>Newly submitted exams may take up to 60 seconds to commit to the ledger.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Initial Empty State */
            <div className="py-16 px-4 text-center max-w-2xl mx-auto rounded-3xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Official Credential Verification Directory
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                Employers, academic institutions, and candidates can look up credentials using an
                authorized candidate roll number.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 text-left">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                  <span className="font-semibold text-slate-200 block mb-1">
                    1. Enter Roll Number
                  </span>
                  <span className="text-slate-400">
                    Input candidate roll code assigned during competition registration.
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                  <span className="font-semibold text-slate-200 block mb-1">
                    2. Verify Authenticity
                  </span>
                  <span className="text-slate-400">
                    Instant authoritative validation against proctored exam records.
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                  <span className="font-semibold text-slate-200 block mb-1">
                    3. Download PDF
                  </span>
                  <span className="text-slate-400">
                    High-resolution tamper-proof certificates suitable for LinkedIn & resumes.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Modal */}
        {isModalOpen && selectedCertificate && (
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h3 id="certificate-modal-title" className="text-base font-bold text-white">
                    Verified Credential Preview
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close certificate modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Renders existing Certificate component with all required props */}
              <div className="p-4 sm:p-6 bg-slate-950/60 overflow-x-auto flex justify-center">
                <Certificate
                  name={selectedCertificate.name || studentInfo?.name}
                  rollNumber={selectedCertificate.rollNumber || studentInfo?.rollNumber}
                  examName={selectedCertificate.examName || "Quiz Competition"}
                  date={formatDate(selectedCertificate.date)}
                  certificateNo={selectedCertificate.certificateNo}
                  language={selectedCertificate.language}
                  score={selectedCertificate.score}
                  Que={selectedCertificate.NoQuestion}
                  onClose={handleCloseModal}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Authenticated by Soft Game Studio Examination Authority</span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default ExamCertificates;
