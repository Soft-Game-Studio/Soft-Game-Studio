import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import ExamPanelNav from "../../Common/ExamPanelNav";
import { fireDB } from "../../../DataBase/firebaseConfig";
import { getUserData } from "../../../Modules/UserData";
import { useAuth } from "../../../AuthProvide";
import {
  Lock,
  AlertTriangle,
  Code,
  CheckCircle2,
  Award,
  Calendar,
  Clock,
  Maximize2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  XCircle,
  Eye,
  FileText,
} from "lucide-react";

/**
 * Proctor Security Keystroke & Mouse Event Blocker Hook
 * Disables context menus, copy/paste, text selection, and modifier keys.
 */
const useExamKeyLock = (enableLock = true, onDisqualify) => {
  useEffect(() => {
    if (!enableLock) return;

    const handleKeyDown = (e) => {
      // Block standard modifier shortcuts: Ctrl, Alt, Meta (Windows/Cmd)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        const modifiers = [];
        if (e.ctrlKey) modifiers.push("Ctrl");
        if (e.altKey) modifiers.push("Alt");
        if (e.metaKey) modifiers.push("Cmd/Win");
        modifiers.push(e.key);
        e.preventDefault();
        e.stopPropagation();
        onDisqualify(`Restricted modifier key combination pressed: ${modifiers.join("+")}`);
        return;
      }

      // Block inspection, refresh, function, and navigation keys
      const blockedKeys = [
        "Tab",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Escape",
        "PrintScreen",
        "Insert",
        "Delete",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "ContextMenu",
      ];

      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        onDisqualify(`Restricted function/system key detected: ${e.key}`);
        return;
      }
    };

    const handlePrevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handlePrevent, true);
    document.addEventListener("copy", handlePrevent, true);
    document.addEventListener("cut", handlePrevent, true);
    document.addEventListener("paste", handlePrevent, true);
    document.addEventListener("dragstart", handlePrevent, true);
    document.addEventListener("drop", handlePrevent, true);
    document.addEventListener("selectstart", handlePrevent, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handlePrevent, true);
      document.removeEventListener("copy", handlePrevent, true);
      document.removeEventListener("cut", handlePrevent, true);
      document.removeEventListener("paste", handlePrevent, true);
      document.removeEventListener("dragstart", handlePrevent, true);
      document.removeEventListener("drop", handlePrevent, true);
      document.removeEventListener("selectstart", handlePrevent, true);
    };
  }, [enableLock, onDisqualify]);
};

/**
 * Compact Credential Preview Card for Step 2
 */
const CertificateBadgeCard = ({ name, rollNumber, examName, date, language, score, Que }) => {
  const progress = Que > 0 ? (score / Que) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 text-center font-sans relative overflow-hidden transition-all shadow-2xl">
      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
        <Award className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
        Official Certificate of Competency
      </h2>
      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
        Soft Game Studio Examination Authority
      </p>

      <div className="bg-black/90 border border-neutral-800 rounded-2xl p-6 text-left text-xs sm:text-sm space-y-2.5 mb-6">
        <div className="flex justify-between border-b border-neutral-900 pb-2">
          <span className="text-neutral-500">Candidate Name:</span>
          <span className="font-bold text-white">{name}</span>
        </div>
        <div className="flex justify-between border-b border-neutral-900 pb-2">
          <span className="text-neutral-500">Candidate Roll:</span>
          <span className="font-mono font-bold text-emerald-400">{rollNumber}</span>
        </div>
        <div className="flex justify-between border-b border-neutral-900 pb-2">
          <span className="text-neutral-500">Assessment:</span>
          <span className="font-semibold text-white">{examName}</span>
        </div>
        <div className="flex justify-between border-b border-neutral-900 pb-2">
          <span className="text-neutral-500">Domain / Language:</span>
          <span className="text-neutral-200">{language}</span>
        </div>
        <div className="flex justify-between border-b border-neutral-900 pb-2">
          <span className="text-neutral-500">Date Authenticated:</span>
          <span className="text-neutral-200">{date}</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-neutral-500">Final Score:</span>
          <span className="font-bold text-emerald-400 font-mono text-base">
            {score} / {Que} ({Math.round(progress)}%)
          </span>
        </div>
      </div>

      <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden border border-neutral-800 mb-6">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[11px] text-neutral-500 uppercase tracking-widest">
        Official Ledger Record • Cryptographically Verifiable
      </p>
    </div>
  );
};

/**
 * Production-Grade Examination Terminal
 * Features:
 * - Professional High-Contrast Pure Black Theme
 * - Full Screen Lockdown & Window Resize Disqualification
 * - Keystroke, ContextMenu, Text Selection, and Copy/Paste Blocking
 * - Active Monitored Question Console
 */
const OfficialQuizExam = () => {
  const { id: quizId } = useParams();
  const [date, setDate] = useState("");
  const [step, setStep] = useState(0); // 0 = Rules/Ready, 1 = Active Exam Terminal, 2 = Results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState("");
  const [filteredUser, setFilteredUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [userList, setUserList] = useState([]);
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [Que, setQue] = useState(0);
  const [isExamWindowValid, setIsExamWindowValid] = useState(true);
  const [examWindowText, setExamWindowText] = useState("");
  const [cooldown, setCooldown] = useState(false);

  // Baseline dimensions for resize monitoring
  const baselineDimensions = useRef({ width: 0, height: 0 });

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getUserData();
      setUserList(allUsers);
    };
    fetchData();
  }, []);

  // Filter current authenticated candidate
  useEffect(() => {
    if (!user || !userList.length) return;

    const matchedUser = userList.find(
      (u) => u.email?.toLowerCase() === user.email?.toLowerCase()
    );
    setFilteredUser(matchedUser || {});
    setLoading(false);
  }, [userList, user]);

  // Set date
  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-GB"));
  }, []);

  // Handle disqualification
  const handleDisqualification = useCallback(
    async (reason = "Cheating violation detected") => {
      if (!filteredUser?.uid || !quizData || isDisqualified) return;

      setDisqualificationReason(reason);
      setIsDisqualified(true);

      try {
        await addDoc(collection(fireDB, "user_Quiz_Answers"), {
          quizId,
          uid: filteredUser.uid,
          email: filteredUser.email,
          name: filteredUser.name || "Candidate",
          rollNumber: filteredUser.rollNumber || "N/A",
          language: quizData.language || "Computer Science",
          timestamp: new Date(),
          disqualified: true,
          reason: reason,
        });
        toast.error(`Exam Terminated: ${reason}`);
      } catch (err) {
        console.error("Disqualification sync error:", err);
      }
    },
    [filteredUser, quizData, quizId, isDisqualified]
  );

  // Bind security keystroke lock during Step 1 (active test)
  useExamKeyLock(step === 1 && !isAlreadySubmitted && !isDisqualified, handleDisqualification);

  // Window Resize, Fullscreen, Blur & Tab Visibility Watchdog
  useEffect(() => {
    if (step !== 1 || isAlreadySubmitted || isDisqualified) return;

    // Set baseline dimensions
    baselineDimensions.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // 1. Detect Window Resizing (Split-screen, restore down, DevTools dock opening)
    const handleWindowResize = () => {
      if (step !== 1 || isAlreadySubmitted || isDisqualified) return;

      const currentW = window.innerWidth;
      const currentH = window.innerHeight;
      const deltaW = Math.abs(currentW - baselineDimensions.current.width);
      const deltaH = Math.abs(currentH - baselineDimensions.current.height);

      if (deltaW > 25 || deltaH > 25) {
        handleDisqualification("Window resize or split-screen detected during examination");
      }
    };

    // 2. Detect Full-Screen Exit
    const handleFullscreenChange = () => {
      if (step !== 1 || isAlreadySubmitted || isDisqualified) return;

      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        handleDisqualification("Full-screen mode terminated during examination session");
      }
    };

    // 3. Detect Window Blur / Focus Loss (User clicked into another app or window)
    const handleWindowBlur = () => {
      if (step !== 1 || isAlreadySubmitted || isDisqualified) return;
      handleDisqualification("Browser window lost focus or switched application");
    };

    // 4. Detect Tab Switch / Minimize
    const handleVisibilityChange = () => {
      if (document.hidden && step === 1 && !isAlreadySubmitted && !isDisqualified) {
        handleDisqualification("Switched browser tab or minimized examination window");
      }
    };

    window.addEventListener("resize", handleWindowResize);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenExit);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [step, isAlreadySubmitted, isDisqualified, handleDisqualification]);

  // Prevent back navigation or page unload
  useEffect(() => {
    const handlePopState = () => {
      if (step === 1 && !isAlreadySubmitted && !isDisqualified) {
        handleSubmit();
      }
    };

    const handleBeforeUnload = (e) => {
      if (step === 1 && !isAlreadySubmitted && !isDisqualified) {
        e.preventDefault();
        handleSubmit();
        e.returnValue = "";
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step, isAlreadySubmitted, isDisqualified]);

  // Fetch quiz & shuffle questions/options
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        toast.error("Exam identifier is missing.");
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(fireDB, "quizzes", quizId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const rawData = docSnap.data();
          if (rawData && rawData.questions && Array.isArray(rawData.questions)) {
            // Shuffle options per question
            const shuffledQuestions = rawData.questions.map((q) => {
              if (!q.options || !q.correctAnswer) return q;

              const correctOptionValue = q.options[q.correctAnswer];
              const optionEntries = Object.entries(q.options).filter(
                ([_, val]) => val !== undefined && val !== null && val !== ""
              );

              const shuffledEntries = [...optionEntries].sort(() => Math.random() - 0.5);
              const newOptions = {};
              let newCorrectAnswer = q.correctAnswer;

              shuffledEntries.forEach(([_, val], index) => {
                const keys = ["a", "b", "c", "d"];
                const newKey = keys[index];
                if (newKey) {
                  newOptions[newKey] = val;
                  if (val === correctOptionValue) {
                    newCorrectAnswer = newKey;
                  }
                }
              });

              return {
                ...q,
                options: newOptions,
                correctAnswer: newCorrectAnswer,
              };
            });

            // Shuffle questions overall
            const fullyShuffled = [...shuffledQuestions].sort(() => Math.random() - 0.5);

            setQuizData({
              ...rawData,
              questions: fullyShuffled,
            });
          } else {
            setQuizData(rawData);
          }
        } else {
          toast.error("Quiz exam not found.");
        }
      } catch (err) {
        console.error("Quiz fetch error:", err);
        toast.error("Failed to fetch exam database.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Window schedule checker
  useEffect(() => {
    if (!quizData) return;

    const checkWindow = () => {
      const now = Date.now();
      const startTime = quizData.examStart ? new Date(quizData.examStart).getTime() : null;
      const endTime = quizData.examEnd ? new Date(quizData.examEnd).getTime() : null;

      if (!startTime || !endTime) {
        setIsExamWindowValid(true);
        return;
      }

      if (now < startTime) {
        setIsExamWindowValid(false);
        const diff = startTime - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setExamWindowText(`Assessment scheduled. Starts in ${h}h ${m}m ${s}s`);
      } else if (now > endTime) {
        setIsExamWindowValid(false);
        setExamWindowText("Assessment window has expired.");
      } else {
        setIsExamWindowValid(true);
      }
    };

    checkWindow();
    const timer = setInterval(checkWindow, 1000);
    return () => clearInterval(timer);
  }, [quizData]);

  // Verify prior submission or disqualification
  useEffect(() => {
    const checkSubmission = async () => {
      if (!filteredUser?.uid || !quizData) return;
      try {
        const q = query(
          collection(fireDB, "user_Quiz_Answers"),
          where("uid", "==", filteredUser.uid),
          where("quizId", "==", quizId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsAlreadySubmitted(true);
          const docData = querySnapshot.docs[0].data();
          if (docData?.disqualified) {
            setIsDisqualified(true);
            setDisqualificationReason(docData.reason || "Disqualified for exam regulations breach");
          }
          setScore(docData.score || 0);
          setQue(docData.NoQuestion || 0);
        }
      } catch (err) {
        console.error("Check submission error:", err);
      }
    };
    checkSubmission();
  }, [filteredUser, quizData, quizId]);

  // Launch Fullscreen and transition to Step 1
  const handleStartExam = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request error:", err);
    }

    baselineDimensions.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    setStep(1);
  };

  const handleRadioChange = (index, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const handleNext = () => {
    if (!quizData) return;
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const generateCertificateNo = async () => {
    const currentYearShort = new Date().getFullYear().toString().slice(-2);
    const prefix = `Result/Certificates${currentYearShort}`;
    const counterRef = doc(fireDB, "CirtificateNo", `roll_numbers_${currentYearShort}`);

    try {
      let rollNumber;
      await runTransaction(fireDB, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const lastNumber = counterDoc.exists() ? counterDoc.data().lastNumber : 0;
        const newNumber = lastNumber + 1;

        transaction.set(counterRef, { lastNumber: newNumber }, { merge: true });
        rollNumber = `${prefix}${String(newNumber).padStart(4, "0")}`;
      });
      return rollNumber;
    } catch (error) {
      console.error("Certificate generation error:", error);
      return `${prefix}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    }
  };

  const handleSubmit = async () => {
    if (isAlreadySubmitted || isDisqualified || cooldown) return;

    if (!filteredUser?.uid) {
      toast.error("User authentication details missing.");
      return;
    }

    if (!quizData || !quizData.questions) {
      toast.error("Examination data unavailable.");
      return;
    }

    setCooldown(true);

    let correctCount = 0;
    quizData.questions.forEach((q, index) => {
      const selected = selectedAnswers[index];
      if (selected && selected === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const NoQuestion = quizData.questions.length;
    const certificateNo = await generateCertificateNo();
    const formattedDate = new Date().toLocaleDateString("en-GB");

    try {
      await addDoc(collection(fireDB, "user_Quiz_Answers"), {
        quizId,
        uid: filteredUser.uid,
        email: filteredUser.email,
        name: filteredUser.name,
        rollNumber: filteredUser.rollNumber,
        examName: quizData.name,
        language: quizData.language,
        score: correctCount,
        selectedAnswers,
        timestamp: new Date(),
        certificateNo,
        date: formattedDate,
        NoQuestion,
      });

      setIsAlreadySubmitted(true);
      setScore(correctCount);
      setQue(NoQuestion);
      toast.success("Examination submitted and authenticated successfully!");

      // Exit fullscreen mode upon completion
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      setStep(2);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Submission failed. Please contact administrator.");
    } finally {
      setCooldown(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white gap-4">
        <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest">
          Initiating Secure Assessment Session...
        </p>
      </div>
    );
  }

  // 2. Disqualified State (Absolute Screen Lockdown)
  if (isDisqualified) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="max-w-xl w-full bg-[#0a0a0a] border border-red-900/60 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-red-950/40 border border-red-500/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-red-950/60 text-red-400 border border-red-800/80 mb-3 tracking-widest">
            Security Infraction Detected
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Examination Terminated: Disqualified
          </h1>

          <p className="text-sm text-neutral-400 leading-relaxed mb-6">
            In strict compliance with Soft Game Studio Anti-Cheat Proctoring Governance, this session has
            been terminated and permanently logged as disqualified.
          </p>

          <div className="p-4 rounded-xl bg-black border border-neutral-800 text-left text-xs font-mono space-y-2 mb-8">
            <div className="flex justify-between border-b border-neutral-900 pb-1.5">
              <span className="text-neutral-500">Candidate:</span>
              <span className="text-neutral-200">{filteredUser?.name || "Candidate"}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5">
              <span className="text-neutral-500">Roll Number:</span>
              <span className="text-emerald-400 font-bold">{filteredUser?.rollNumber || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5">
              <span className="text-neutral-500">Assessment:</span>
              <span className="text-neutral-200">{quizData?.name || "Exam"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Policy Trigger:</span>
              <span className="text-red-400 font-semibold">{disqualificationReason || "Infraction"}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/"
              className="flex-1 py-3 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-800 transition-colors"
            >
              Return to Home
            </a>
            <a
              href="/ContactUs"
              className="flex-1 py-3 px-6 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-900 transition-colors"
            >
              Contact Administration
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. User Authentication Required
  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[85vh] bg-black text-white gap-4 p-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-neutral-400 text-sm max-w-sm text-center mb-4">
            You must be logged into an authenticated candidate account to launch proctored examinations.
          </p>
          <a
            href="/login"
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
          >
            Candidate Login
          </a>
        </div>
      </Layout>
    );
  }

  // 4. STEP 0: Instructions & Full Screen Launch Console
  if (step === 0) {
    return (
      <Layout>
        <ExamPanelNav activeTab="exams" />
        <main className="min-h-screen bg-black text-neutral-100 antialiased py-12 px-4 sm:px-6 lg:px-8 select-none">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
              {/* Header Title */}
              <div className="text-center mb-8 pb-6 border-b border-neutral-800">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-900 border border-neutral-800 text-emerald-400 mb-3 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Proctored Examination Console
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {quizData?.name}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-mono">
                  Candidate: <strong className="text-white">{filteredUser?.name || user.email}</strong> •
                  Roll Number:{" "}
                  <strong className="text-emerald-400">{filteredUser?.rollNumber || "Assigned"}</strong>
                </p>
              </div>

              {/* Already Completed Notice */}
              {isAlreadySubmitted ? (
                <div className="space-y-6 text-center">
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> You have already completed this assessment.
                  </div>
                  <CertificateBadgeCard
                    name={filteredUser.name}
                    rollNumber={filteredUser.rollNumber}
                    examName={quizData.name}
                    date={date}
                    language={quizData.language}
                    score={score}
                    Que={Que}
                  />
                  <div className="pt-4 flex justify-center gap-4">
                    <Link
                      to={`/Result/Certificates/${encodeURIComponent(filteredUser.rollNumber)}`}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                    >
                      View in Certificate Registry
                    </Link>
                  </div>
                </div>
              ) : (
                /* Protocol Checklist */
                <div className="space-y-8">
                  {/* Strict Window Resize / Fullscreen Warning Alert */}
                  <div className="p-5 rounded-2xl bg-red-950/30 border border-red-900/60 text-red-300 text-xs sm:text-sm flex items-start gap-3.5">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-200 uppercase tracking-wider">
                        Mandatory Full Screen & Anti-Cheat Policy
                      </h4>
                      <p className="mt-1 leading-relaxed text-red-300/90 text-xs">
                        This examination requires an uncompromised full-screen terminal. <strong>Resizing the browser window, splitting screens, exiting full-screen mode, switching applications, or opening developer tools will cause immediate, irreversible disqualification.</strong>
                      </p>
                    </div>
                  </div>

                  {/* Rules Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-black border border-neutral-800/80">
                      <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <Maximize2 className="w-4 h-4 text-emerald-400" />
                        <span>Locked Full Screen</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        The test covers 100% of the display. Exiting full-screen aborts the session.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-neutral-800/80">
                      <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span>System Keystroke Locks</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        Tab, Function keys (F1–F12), PrintScreen, and modifier shortcuts (Ctrl/Alt/Cmd) are strictly disabled.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-neutral-800/80">
                      <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Window Resize Watchdog</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        Any screen dimension change or developer console docking triggers automated invalidation.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-neutral-800/80">
                      <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <Award className="w-4 h-4 text-sky-400" />
                        <span>Immediate Credentialing</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        Passing candidates receive official cryptographic credentials instantly upon submission.
                      </p>
                    </div>
                  </div>

                  {/* Launch Action */}
                  <div className="pt-6 border-t border-neutral-800 flex flex-col items-center gap-3">
                    {isExamWindowValid ? (
                      <button
                        type="button"
                        onClick={handleStartExam}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-emerald-950/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>Enter Full Screen & Start Examination</span>
                      </button>
                    ) : (
                      <div className="text-center p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                        {examWindowText || "Assessment window is currently closed."}
                      </div>
                    )}

                    <span className="text-[11px] text-neutral-500 font-mono">
                      By launching, you consent to automated screen monitoring and integrity rules.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  // 5. STEP 1: Fully Proctored Full-Screen Examination Console (Covering 100% Screen, Pure Black)
  if (step === 1 && quizData && quizData.questions) {
    const q = quizData.questions[currentQuestion];
    const questionNumber = currentQuestion + 1;
    const totalQuestions = quizData.questions.length;
    const progressPercent = ((questionNumber / totalQuestions) * 100).toFixed(0);

    return (
      <div className="fixed inset-0 w-screen h-screen bg-black text-white flex flex-col justify-between overflow-hidden select-none z-[9999] font-sans">
        {/* Top Proctor Monitored Bar */}
        <header className="h-16 px-6 bg-[#080808] border-b border-neutral-850 flex items-center justify-between flex-shrink-0">
          {/* Left Brand & Exam Info */}
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-xs">
              SGS
            </span>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white tracking-wide block truncate max-w-xs">
                {quizData.name}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">PROCTORED TERMINAL</span>
            </div>
          </div>

          {/* Center Proctor Security Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950 border border-neutral-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider hidden md:inline">
              SECURE FULL-SCREEN ENVIRONMENT • MONITORED
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider md:hidden">
              MONITORED
            </span>
          </div>

          {/* Right Candidate Roll & Progress */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 block uppercase font-mono">Candidate Roll</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {filteredUser?.rollNumber || "AUTHENTICATED"}
              </span>
            </div>
          </div>
        </header>

        {/* Center Question Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex justify-center items-center">
          <div className="max-w-4xl w-full bg-[#0a0a0a] border border-neutral-850 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between">
            {/* Question Progress Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                  QUESTION {String(questionNumber).padStart(2, "0")} OF {String(totalQuestions).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Question Body */}
            <div className="space-y-6">
              <h2 className="text-lg sm:text-2xl font-semibold text-white leading-relaxed">
                {q?.question}
              </h2>

              {/* Code Snippet Box (If present) */}
              {q?.code && (
                <div className="rounded-2xl bg-black border border-neutral-800 overflow-hidden">
                  <div className="px-4 py-2 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-emerald-400" />
                      <span>snippet.{quizData.language?.toLowerCase() || "code"}</span>
                    </span>
                    <span className="text-[10px] text-neutral-500">READ-ONLY BUFFER</span>
                  </div>
                  <pre className="p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {q.code}
                  </pre>
                </div>
              )}

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                {q?.options ? (
                  Object.entries(q.options).map(([key, value]) => {
                    const isSelected = selectedAnswers[currentQuestion] === key;
                    const letter = key.toUpperCase();

                    return (
                      <label
                        key={key}
                        className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer border transition-all ${
                          isSelected
                            ? "bg-emerald-950/30 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40"
                            : "bg-[#111111] border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono flex-shrink-0 transition-colors ${
                            isSelected
                              ? "bg-emerald-500 text-black font-extrabold shadow"
                              : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                          }`}
                        >
                          {letter}
                        </div>

                        <div className="flex-1 pt-0.5 text-sm sm:text-base leading-snug">
                          {value}
                        </div>

                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={key}
                          checked={isSelected}
                          onChange={() => handleRadioChange(currentQuestion, key)}
                          className="sr-only"
                        />
                      </label>
                    );
                  })
                ) : (
                  <p className="text-neutral-500 text-xs">No options specified for this question entry.</p>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Dock Navigation */}
        <footer className="h-20 px-6 bg-[#080808] border-t border-neutral-850 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold transition-colors ${
              currentQuestion === 0
                ? "bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-850"
                : "bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Quick Questions Navigation Pills */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
            {quizData.questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = idx === currentQuestion;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-7 h-7 rounded-lg font-mono text-[11px] font-bold transition-all ${
                    isCurrent
                      ? "bg-emerald-500 text-black ring-2 ring-emerald-400"
                      : isAnswered
                      ? "bg-neutral-800 text-emerald-400 border border-emerald-900"
                      : "bg-neutral-950 text-neutral-600 border border-neutral-850 hover:text-neutral-400"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
          >
            <span>{currentQuestion === totalQuestions - 1 ? "Submit Assessment" : "Next Question"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
    );
  }

  // 6. STEP 2: Assessment Complete & Digital Credentialing
  return (
    <Layout>
      <ExamPanelNav activeTab="exams" />
      <main className="min-h-screen bg-black text-white antialiased py-12 px-4 sm:px-6 lg:px-8 select-none">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Assessment Completed Successfully
            </h1>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
              Your responses have been validated and recorded. Review your performance scorecard below.
            </p>

            <CertificateBadgeCard
              name={filteredUser.name}
              rollNumber={filteredUser.rollNumber}
              examName={quizData?.name}
              date={date}
              language={quizData?.language}
              score={score}
              Que={Que}
            />

            <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/Result/Certificates/${encodeURIComponent(filteredUser.rollNumber)}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>Verify in Certificate Registry</span>
              </Link>

              <Link
                to="/Result"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold text-xs border border-neutral-800 transition-colors"
              >
                <span>Check Competition Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default OfficialQuizExam;