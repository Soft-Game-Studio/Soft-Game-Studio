import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  runTransaction
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import { fireDB } from "../../../DataBase/firebaseConfig";
import { getUserData } from "../../../Modules/UserData";
import { useAuth } from "../../../AuthProvide";
import { FaLock, FaExclamationTriangle, FaCode, FaCheckCircle, FaAward, FaCalendarAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

const Certificate = ({ name, rollNumber, examName, date, language, score, Que }) => {
  const progress = Que > 0 ? (score / Que) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-neutral-900 border-4 border-double border-purple-500 rounded-3xl shadow-glow p-8 text-center font-sans relative overflow-hidden transition-all duration-300">
      {/* Background Watermark/Badges */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 dark:bg-purple-950/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 dark:bg-indigo-950/20 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Header */}
      <div className="mb-6 relative z-10">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow">
          <FaAward className="w-8 h-8 text-purple-650 dark:text-purple-400" />
        </div>
        <h1 className="text-3xl font-black text-purple-900 dark:text-white tracking-tight">
          Certificate of Achievement
        </h1>
        <p className="text-purple-600 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mt-1">
          SGS Quiz Certification Panel
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-purple-50/50 dark:bg-neutral-800/60 border border-purple-100/20 rounded-2xl p-6 mb-6 shadow-inner text-left relative z-10">
        <div className="space-y-2 text-sm sm:text-base">
          <p className="text-gray-700 dark:text-gray-200">
            Candidate Name: <span className="font-bold text-purple-900 dark:text-purple-400">{name}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            Registration Roll: <span className="font-mono font-bold">{rollNumber}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            Exam Cleared: <span className="font-bold text-gray-900 dark:text-white">{examName}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            Environment: <span className="font-semibold">{language}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            Issue Date: <span className="font-semibold">{date}</span>
          </p>
          <div className="pt-2 border-t border-purple-100 dark:border-neutral-800 mt-2 flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 text-xs">Performance Grade</span>
            <span className="font-black text-purple-850 dark:text-purple-300">{score} / {Que} ({Math.round(progress)}%)</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="w-full bg-purple-100 dark:bg-neutral-800 rounded-full h-3.5 overflow-hidden border border-purple-200/10">
          <div
            className="bg-gradient-to-r from-purple-600 to-indigo-650 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-purple-50 dark:bg-neutral-800/40 rounded-xl p-3 border border-purple-100/10 mb-4 text-xs text-purple-800 dark:text-purple-300">
        This document acts as an official record of online examination. A verifiable digital copy is dispatched via email.
      </div>

      <div className="text-[10px] uppercase text-gray-400 dark:text-gray-500 tracking-widest mt-4">
        SGS Code Labs | Secure Exam Authority
      </div>
    </div>
  );
};

// Exam keystroke & focus blocker hook
const useExamKeyLock = (enableLock = true, onDisqualify) => {
  const attemptCount = useRef(0);

  useEffect(() => {
    if (!enableLock) return;

    const handleCheatingAttempt = (keyCombination = '') => {
      attemptCount.current += 1;
      
      if (attemptCount.current < 3) {
        toast.warning(
          `Warning ${attemptCount.current}/3: Keystroke ${keyCombination} is blocked to ensure exam integrity.`,
          { autoClose: 3000 }
        );
      } else if (attemptCount.current === 3) {
        toast.error(
          `Final Warning! Any further window switch or modifier keystroke will invalidate this attempt.`,
          { autoClose: 4000 }
        );
      } else {
        onDisqualify(`Disqualified: Used restricted keys / combos (${keyCombination})`);
      }
    };

    const handleKeyDown = (e) => {
      // Block standard modifier shortcuts
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
        const modifiers = [];
        if (e.ctrlKey) modifiers.push('Ctrl');
        if (e.altKey) modifiers.push('Alt');
        if (e.shiftKey) modifiers.push('Shift');
        if (e.metaKey) modifiers.push('Cmd');
        handleCheatingAttempt(modifiers.join('+'));
        e.preventDefault();
        return;
      }

      // Block navigation and tooling keys
      const blockedKeys = [
        'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 
        'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
        'Escape', 'PrintScreen', 'Insert', 'Delete',
        'Home', 'End', 'PageUp', 'PageDown',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
      ];

      if (blockedKeys.includes(e.key)) {
        handleCheatingAttempt(e.key);
        e.preventDefault();
        return;
      }
    };

    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyPaste = (e) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [enableLock, onDisqualify]);
};

const OfficialQuizExam = () => {
  const { id: quizId } = useParams();
  const [date, setDate] = useState("");
  const [step, setStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [filteredUser, setFilteredUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [userList, setUserList] = useState([]);
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [Que, setQue] = useState(0);
  const [isExamWindowValid, setIsExamWindowValid] = useState(true);
  const [examWindowText, setExamWindowText] = useState("");

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getUserData();
      setUserList(allUsers);
    };
    fetchData();
  }, []);

  // Filter candidate
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
    setDate(new Date().toLocaleDateString('en-GB'));
  }, []);

  // Before unload block
  useEffect(() => {
    const handlePopState = () => {
      if (step === 1 && !isAlreadySubmitted) handleSubmit();
    };

    const handleBeforeUnload = (e) => {
      if (step === 1 && !isAlreadySubmitted) {
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
  }, [step, isAlreadySubmitted]);

  // Disqualify database submission
  const handleDisqualification = useCallback(async (reason = "Cheating - switched tab") => {
    if (!filteredUser?.uid || !quizData) return;
    try {
      await addDoc(collection(fireDB, "user_Quiz_Answers"), {
        quizId,
        uid: filteredUser.uid,
        email: filteredUser.email,
        name: filteredUser.name,
        rollNumber: filteredUser.rollNumber,
        language: quizData.language,
        timestamp: new Date(),
        disqualified: true,
        reason: reason,
      });
      setIsDisqualified(true);
      toast.error("You have been disqualified for violating exam regulations.");
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      console.error("Disqualification error:", err);
    }
  }, [filteredUser, quizData, quizId]);

  // Tab change visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && step === 1 && !isAlreadySubmitted && !isDisqualified) {
        handleDisqualification("Cheating - switched browser tab / window");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [step, isAlreadySubmitted, isDisqualified, handleDisqualification]);

  // Run key lock hooks
  useExamKeyLock(step === 1, handleDisqualification);

  // Fetch quiz and shuffle questions/options
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
            // Shuffling options per question, keeping reference of correctAnswer
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

            // Fisher-Yates shuffle overall questions array
            const fullyShuffledQuestions = [...shuffledQuestions].sort(() => Math.random() - 0.5);

            setQuizData({
              ...rawData,
              questions: fullyShuffledQuestions,
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

  // Client-side exam start & end window checker
  useEffect(() => {
    if (!quizData) return;

    const checkWindow = () => {
      const now = Date.now();
      const startTime = quizData.examStart ? new Date(quizData.examStart).getTime() : null;
      const endTime   = quizData.examEnd   ? new Date(quizData.examEnd).getTime()   : null;

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
        setExamWindowText(`Exam is upcoming. Starts in ${h}H ${m}M ${s}S`);
      } else if (now > endTime) {
        setIsExamWindowValid(false);
        setExamWindowText("Exam window has already expired.");
      } else {
        setIsExamWindowValid(true);
      }
    };

    checkWindow();
    const timer = setInterval(checkWindow, 1000);
    return () => clearInterval(timer);
  }, [quizData]);

  // Check if candidate already submitted
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
    const prefix = `SGSCERT${currentYearShort}`;
    const counterRef = doc(fireDB, 'CirtificateNo', `roll_numbers_${currentYearShort}`);

    try {
      let rollNumber;
      await runTransaction(fireDB, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const lastNumber = counterDoc.exists() ? counterDoc.data().lastNumber : 0;
        const newNumber = lastNumber + 1;

        transaction.set(counterRef, { lastNumber: newNumber }, { merge: true });
        rollNumber = `${prefix}${String(newNumber).padStart(4, '0')}`;
      });
      return rollNumber;
    } catch (error) {
      console.error("Certificate generation failed:", error);
      return `${prefix}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    }
  };

  const [cooldown, setCooldown] = useState(false);

  const handleSubmit = async () => {
    if (isAlreadySubmitted || isDisqualified || cooldown) return;

    if (!filteredUser?.uid) {
      toast.error("User authenticated details missing.");
      return;
    }

    if (!quizData) {
      toast.error("Quiz data missing.");
      return;
    }

    setCooldown(true);
    setTimeout(() => setCooldown(false), 10000);

    let correctCount = 0;
    quizData.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correctCount++;
    });

    const NoQuestion = quizData.questions.length;

    try {
      const certificateNo = await generateCertificateNo();
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB');

      await addDoc(collection(fireDB, "user_Quiz_Answers"), {
        quizId,
        language: quizData.language,
        uid: filteredUser.uid,
        email: filteredUser.email,
        name: filteredUser.name,
        rollNumber: filteredUser.rollNumber,
        timestamp: new Date(),
        score: correctCount,
        examName: quizData.name,
        certificateNo,
        date: formattedDate,
        NoQuestion,
      });

      setIsAlreadySubmitted(true);
      setScore(correctCount);
      setQue(NoQuestion);
      toast.success("Exam answers stored successfully!");
      setStep(2);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Submission failed. Please contact the administrator.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[85vh] bg-slate-50 dark:bg-neutral-950 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent shadow-md"></div>
          <p className="text-purple-600 dark:text-purple-400 font-semibold">Validating session...</p>
        </div>
      </Layout>
    );
  }

  if (!quizData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-8 text-center min-h-[70vh] flex flex-col items-center justify-center">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-8 rounded-3xl shadow">
            <FaExclamationTriangle className="text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quiz Database Error</h2>
            <p className="text-sm">The quiz requested could not be resolved in the database.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user){
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[85vh] bg-slate-50 dark:bg-neutral-950 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent shadow-md"></div>
          <p className="text-purple-600 dark:text-purple-400 font-semibold">Please Login to Continue...</p>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      
      {/* STEP 0: Welcome and Instructions */}
      {step === 0 && (
        <Layout>
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white dark:bg-neutral-900 border border-purple-50/50 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10">
              <h1 className="text-3xl font-black text-center text-purple-600 dark:text-purple-400 mb-2">
                {quizData.name} Exam
              </h1>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                Authenticated Candidate:{" "}
                <span className="font-bold text-gray-800 dark:text-white">
                  {filteredUser?.name || "N/A"}
                </span>
              </p>

              {isAlreadySubmitted ? (
                isDisqualified ? (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/20 text-red-500 dark:text-red-400 p-6 rounded-2xl text-center flex flex-col items-center gap-2">
                    <FaExclamationTriangle className="text-3xl" />
                    <h3 className="font-bold text-lg">Attempt Disqualified</h3>
                    <p className="text-sm">This attempt was disqualified due to tab switches or restricted browser operations.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-center font-bold flex items-center justify-center gap-2">
                      <FaCheckCircle /> You have completed this exam.
                    </div>
                    
                    <Certificate
                      name={filteredUser.name}
                      rollNumber={filteredUser.rollNumber}
                      examName={quizData.name}
                      date={date}
                      language={quizData.language}
                      score={score}
                      Que={Que}
                    />
                  </div>
                )
              ) : (
                <div className="space-y-8">
                  {/* Warning Alerts */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/30 text-amber-700 dark:text-amber-400 p-5 rounded-2xl flex items-start gap-3">
                    <FaExclamationTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">Mandatory Regulations</h4>
                      <p className="text-xs mt-1 leading-relaxed">
                        Do not click away, switch windows, open developer tools, or press keys like Tab/Ctrl/PrintScreen. Your session is monitored; violations result in immediate disqualification.
                      </p>
                    </div>
                  </div>

                  {/* Rules Checklist */}
                  <div className="border border-purple-50 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/30 p-6 rounded-2xl space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white border-b border-purple-100 dark:border-neutral-850 pb-2">Exam Protocols</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                          <FaLock />
                        </div>
                        <div>
                          <h4 className="font-bold">Keystroke Restrictors</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Copy, paste, cut, and printscreen functionality is restricted.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
                          <FaClock />
                        </div>
                        <div>
                          <h4 className="font-bold">Shuffled Environment</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Questions and matching options are generated randomly.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center flex-shrink-0 text-violet-600 dark:text-violet-400">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <h4 className="font-bold">Auto-Submission</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Closing browser or navigating back auto-submits current answers.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                          <FaCheckCircle />
                        </div>
                        <div>
                          <h4 className="font-bold">Passing Standards</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Passing scores generate a verifiable PDF certificate on results release.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Window Validation Action Buttons */}
                  <div className="flex flex-col items-center gap-3 pt-4">
                    {isExamWindowValid ? (
                      <button
                        onClick={() => setStep(1)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-700 hover:to-indigo-750 px-10 py-4 rounded-2xl text-white font-bold shadow-lg transition-all transform hover:scale-[1.02]"
                      >
                        Start Quiz Exam
                      </button>
                    ) : (
                      <div className="w-full text-center">
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/20 text-red-500 dark:text-red-400 p-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold mb-3">
                          <FaExclamationTriangle /> {examWindowText}
                        </div>
                        <div>
                          <button
                            disabled
                            className="bg-gray-300 dark:bg-neutral-800 text-gray-400 dark:text-gray-600 px-10 py-4 rounded-2xl font-bold cursor-not-allowed"
                          >
                            Exam Lock Active
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Layout>
      )}

      {/* STEP 1: Exam Taking Window */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:py-10">
          <div className="bg-white dark:bg-neutral-900 border border-purple-50/40 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10">
            
            {/* Question Progress Header */}
            <div className="flex justify-between items-center mb-8 border-b border-purple-50 dark:border-neutral-850 pb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
                Question {currentQuestion + 1} of {quizData.questions.length}
              </h2>
              <span className="bg-purple-100 dark:bg-purple-950/40 text-purple-750 dark:text-purple-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-purple-200/25">
                {quizData.language}
              </span>
            </div>

            {/* Question Container */}
            <div className="space-y-6">
              <div className="bg-slate-50/60 dark:bg-neutral-800/40 border border-purple-50/10 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-850 dark:text-white leading-relaxed mb-6">
                  {quizData.questions[currentQuestion]?.question}
                </h3>

                {/* Optional code snippet */}
                {quizData.questions[currentQuestion]?.code && (
                  <div className="mb-6">
                    <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800">
                      <div className="bg-neutral-900 px-4 py-2 flex items-center gap-1.5 border-b border-neutral-850">
                        <FaCode className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs text-gray-400 font-mono">source.code</span>
                      </div>
                      <pre className="p-4 font-mono text-sm text-purple-200 overflow-x-auto whitespace-pre-wrap">
                        {quizData.questions[currentQuestion].code}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Option Radios */}
                <div className="space-y-3">
                  {quizData.questions[currentQuestion]?.options ? (
                    Object.entries(quizData.questions[currentQuestion].options).map(([key, value]) => {
                      const isSelected = selectedAnswers[currentQuestion] === key;
                      return (
                        <label
                          key={key}
                          className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer border transition-all ${
                            isSelected
                              ? "bg-purple-50/50 dark:bg-purple-950/25 border-purple-400 dark:border-purple-650 text-purple-950 dark:text-purple-200 font-semibold"
                              : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-neutral-850"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion}`}
                            value={key}
                            checked={isSelected}
                            onChange={() => handleRadioChange(currentQuestion, key)}
                            className="mt-1.5 accent-purple-650 w-4 h-4 flex-shrink-0"
                          />
                          <span>{value}</span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-center py-4 text-gray-400">Options missing for this question entry.</p>
                  )}
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-purple-50 dark:border-neutral-850">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-3 rounded-xl font-bold transition-all text-sm ${
                    currentQuestion === 0
                      ? "bg-slate-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-650 cursor-not-allowed"
                      : "bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  Previous
                </button>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-700 hover:to-indigo-750 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all text-sm"
                >
                  {currentQuestion === quizData.questions.length - 1
                    ? "Submit Quiz Exam"
                    : "Next Question"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STEP 2: Congratulations & Certificate */}
      {step === 2 && (
        <Layout>
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white dark:bg-neutral-900 border border-purple-50/50 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 text-center">
              
              <div className="mb-8">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <FaCheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">
                  Exam Completed Successfully!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                  Your responses have been processed and locked. You can view your scorecard below.
                </p>
              </div>

              <Certificate
                name={filteredUser.name}
                rollNumber={filteredUser.rollNumber}
                examName={quizData.name}
                date={date}
                language={quizData.language}
                score={score}
                Que={Que}
              />
              
            </div>
          </div>
        </Layout>
      )}

    </div>
  );
};

export default OfficialQuizExam;