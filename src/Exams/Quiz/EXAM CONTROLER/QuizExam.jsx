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


const Certificate = ({ name, rollNumber, examName, date, language, score, Que }) => {
  // Calculate progress %
  const progress = Que > 0 ? (score / Que) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-purple-900 rounded-2xl shadow-2xl p-8 text-center font-sans relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-2">
          Certificate of Participation
        </h1>
        <p className="text-purple-600 dark:text-purple-200 text-sm">
          This is to acknowledge the participation of the following user
        </p>
      </div>

      {/* User Info */}
      <div className="bg-purple-50 dark:bg-purple-800 rounded-xl p-6 mb-6 shadow-inner text-left">
        <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-2">
          Name: <span className="font-bold">{name}</span>
        </h2>
        <p className="text-purple-700 dark:text-purple-200 mb-1">
          Roll Number: <span className="font-mono">{rollNumber}</span>
        </p>
        <p className="text-purple-700 dark:text-purple-200 mb-1">
          Exam: <span className="font-semibold">{examName}</span>
        </p>
        <p className="text-purple-700 dark:text-purple-200 mb-1">
          Language: <span className="font-semibold">{language}</span>
        </p>
        <p className="text-purple-700 dark:text-purple-200 mb-1">
          Date: <span className="font-semibold">{date}</span>
        </p>
        <p className="text-purple-700 dark:text-purple-200">
          Score: <span className="font-bold">{score}</span> / <span className="font-semibold">{Que}</span>
        </p>
      </div>

      {/* Performance Bar */}
      <div className="mb-6">
        <p className="text-purple-700 dark:text-purple-200 mb-2 font-semibold">Performance</p>
        <div className="w-full bg-purple-200 dark:bg-purple-700 rounded-full h-4">
          <div
            className="bg-purple-600 dark:bg-purple-300 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-purple-100 dark:bg-purple-800 rounded-xl p-4 shadow-inner mb-4">
        <p className="text-purple-800 dark:text-white text-sm">
          Your certificate will be sent to your registered email soon.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs text-purple-500 dark:text-purple-300">
        SGS Coding Competition | All Rights Reserved
      </div>
    </div>
  );
};

// Custom hook for exam key lock
const useExamKeyLock = (enableLock = true, onDisqualify) => {
  const attemptCount = useRef(0);

  useEffect(() => {
    if (!enableLock) return;

    const handleCheatingAttempt = (keyCombination = '') => {
      attemptCount.current += 1;
      
      if (attemptCount.current < 3) {
        toast.warning(
          `Warning ${attemptCount.current}/3: ${keyCombination} is not allowed.`,
          { autoClose: 3000 }
        );
      } else if (attemptCount.current === 3) {
        toast.error(
          `Final Warning! Next violation will disqualify you.`,
          { autoClose: 4000 }
        );
      } else {
        onDisqualify(`Used forbidden key combination: ${keyCombination}`);
      }
    };

    const handleKeyDown = (e) => {
      // Block all modifier key combinations
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

      // Block specific keys
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

      // Special case for Alt+Tab (Windows) and Command+Tab (Mac)
      if ((e.key === 'Tab' && e.altKey) || (e.key === 'Tab' && e.metaKey)) {
        handleCheatingAttempt('Tab+Alt/Cmd');
        e.preventDefault();
        return;
      }
    };

    // Block right click context menu
    const handleContextMenu = (e) => e.preventDefault();

    // Block copy/paste
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

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getUserData();
      setUserList(allUsers);
    };
    fetchData();
  }, []);

  // Filter current user
  useEffect(() => {
    if (!user || !userList.length) return;

    const matchedUser = userList.find(
      (u) => u.email?.toLowerCase() === user.email?.toLowerCase()
    );
    setFilteredUser(matchedUser || {});
    setLoading(false);
  }, [userList, user]);

  // Set current date
  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  // Handle browser navigation and tab closing
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

  // Disqualification handler
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
      toast.error("Disqualified for cheating.");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Disqualification error:", err);
      toast.error("Failed to save disqualification.");
    }
  }, [filteredUser, quizData, quizId]);

  // Tab visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && step === 1 && !isAlreadySubmitted && !isDisqualified) {
        handleDisqualification("Cheating - switched tab");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [step, isAlreadySubmitted, isDisqualified, handleDisqualification]);

  // Use exam key lock
  useExamKeyLock(step === 1, handleDisqualification);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        toast.error("Quiz ID missing.");
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(fireDB, "quizzes", quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuizData(docSnap.data());
        } else {
          toast.error("Quiz not found.");
        }
      } catch (err) {
        console.error("Quiz fetch error:", err);
        toast.error("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Check if user already submitted
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
            console.warn("Disqualified:", docData?.reason);
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

    console.log('Generated CirtificateNo:', rollNumber);
    return rollNumber;
  } catch (error) {
    console.error("Cirtificate No generation failed:", error);
    // Fallback certificate number
    return `${prefix}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
  }
};

 const [cooldown, setCooldown] = useState(false);

const handleSubmit = async () => {
  if (isAlreadySubmitted || isDisqualified || cooldown) return;

  if (!filteredUser?.uid) {
    toast.error("User not authenticated.");
    return;
  }

  if (!quizData) {
    toast.error("Quiz not loaded.");
    return;
  }

  // ✅ Start cooldown
  setCooldown(true);
  setTimeout(() => setCooldown(false), 10000); // 10 seconds

  // Calculate score
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
    toast.success("Quiz submitted successfully!");
    setStep(2);
  } catch (err) {
    console.error("Submit error:", err);
    toast.error("Submission failed. Please try again.");
  }
};


  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!quizData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center">
            Quiz data not available.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {step === 0 && (
        <Layout>
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 md:p-8 transition-all duration-200">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
                {quizData.name} Quiz
              </h1>
              
              <div className="text-center mb-8">
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome,{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {filteredUser?.name || "User"}
                  </span>
                </p>
              </div>

              {isAlreadySubmitted ? (
                isDisqualified ? (
                  <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center mb-6">
                    Disqualified. Reason: <em>Cheating - switched tab</em>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-center">
                      You have already completed this exam
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
                <div className="space-y-6">
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg">
                    <h2 className="text-xl font-bold text-center mb-2">Important Note</h2>
                    <p className="text-center font-medium">(Read Before Starting the Quiz)</p>
                  </div>

                  <div>
                    <section className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-lg p-6 sm:p-8">
                      {/* No Cheating */}
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">🚫 No Cheating</h3>
                        <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Single attempt only.</strong> Multiple attempts are not permitted.</li>
                          <li>• Tab switching, external devices, screen sharing, or outside help is considered cheating.</li>
                          <li>• Any suspicious activity will result in <strong>immediate disqualification</strong>.</li>
                        </ul>
                      </div>

                      {/* Strict Deadline */}
                      <div className="flex gap-3 mt-6">
                        <div className="flex-none p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                          <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">📅 Strict Deadline</h3>
                          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• You must complete the exam within the allotted time once started.</li>
                            <li>• Unfinished exams will be <strong>auto-submitted</strong> when time expires.</li>
                            <li>• Late submissions or re-openings are not allowed.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Identity & Fair Use */}
                      <div className="flex gap-3 mt-6">
                        <div className="flex-none p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                          <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">👤 Identity & Fair Use</h3>
                          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• The exam is <strong>personal and non-transferable</strong>.</li>
                            <li>• Do not share your login, questions, or answers with anyone.</li>
                            <li>• Your activity will be monitored for fair use.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Important Notes */}
                      <div className="mt-6 border-t border-gray-100 dark:border-neutral-800 pt-5">
                        <h4 className="font-medium text-gray-800 dark:text-white">📌 Important Notes</h4>
                        <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>• Read all instructions carefully before beginning the exam.</li>
                          <li>• Ensure a stable internet connection and a quiet, well-lit environment.</li>
                          <li>• Once submitted, answers <strong>cannot be changed</strong> and the attempt cannot be re-done.</li>
                          <li>• Results will be declared after evaluation; follow-up communication will be sent via your registered email.</li>
                          <li>• If you face technical issues, contact support immediately with logs and screenshots — do not attempt to restart the exam unless instructed.</li>
                        </ul>
                      </div>
                    </section>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-colors duration-200"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Layout>
      )}

      {step === 1 && (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 transition-all duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </h2>
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {quizData.language}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {quizData.questions[currentQuestion]?.question}
                </h3>

                {quizData.questions[currentQuestion]?.code && (
                  <div className="mt-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Code for this question:
                      </h4>
                      <pre className="whitespace-pre-wrap bg-gray-900 rounded-md p-3 font-mono text-sm text-gray-200 overflow-x-auto">
                        {quizData.questions[currentQuestion].code}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {quizData.questions[currentQuestion]?.options ? (
                    Object.entries(
                      quizData.questions[currentQuestion].options
                    ).map(([key, value]) => (
                      <label
                        key={key}
                        className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer border transition ${
                          selectedAnswers[currentQuestion] === key
                            ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600"
                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={key}
                          checked={selectedAnswers[currentQuestion] === key}
                          onChange={() =>
                            handleRadioChange(currentQuestion, key)
                          }
                          className="mt-1 accent-blue-600 w-5 h-5"
                        />
                        <span className="text-gray-800 dark:text-gray-200">{value}</span>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No options available for this question.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-5 py-2.5 rounded-md font-medium ${
                    currentQuestion === 0
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200"
                >
                  {currentQuestion === quizData.questions.length - 1
                    ? "Submit Quiz"
                    : "Next Question"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <Layout>
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 md:p-8 transition-all duration-200">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                    Congratulations!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    You have successfully completed the quiz.
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
          </div>
        </Layout>
      )}
    </div>
  );
};

export default OfficialQuizExam;