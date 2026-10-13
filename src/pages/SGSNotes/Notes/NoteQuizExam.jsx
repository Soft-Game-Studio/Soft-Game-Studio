/**
 * NoteQuizExam.jsx: SGS Interactive Study Self-Assessment
 *
 * Production-grade quiz practice application implementing:
 * - Clean Multi-Step Exam Architecture: Step 0 (Instructions), Step 1 (Active Quiz), Step 2 (Detailed Performance Analysis)
 * - Full Dark & Light Mode Theme Support: High-contrast neutral design, zero purple gradients
 * - Comprehensive Question Review: Post-quiz breakdown highlighting selected vs correct answers
 * - Full Anti-Cheat Protections: Context menu, copy/paste, and screen capture event handlers during test session
 * - Technical SEO: react-helmet-async with dynamic Quiz metadata
 * - Zero em dashes in user-facing copy
 */

/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fireDB } from '../../../DataBase/firebaseConfig';
import Layout from '../../../components/layout/Layout';
import { useAuth } from '../../../AuthProvide';
import { Helmet } from 'react-helmet-async';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaClock,
  FaShieldAlt,
  FaRedo,
  FaArrowLeft,
  FaArrowRight,
  FaFileAlt,
  FaGraduationCap,
  FaAward,
  FaCheck
} from 'react-icons/fa';

export default function NoteQuizExam() {
  const { user } = useAuth();
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0: overview, 1: test, 2: results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [date, setDate] = useState('');
  const [userName, setUserName] = useState('Guest Scholar');

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    );
  }, []);

  // Fetch logged in user profile if present
  useEffect(() => {
    let isCancelled = false;
    const fetchUser = async () => {
      if (!user?.uid) return;
      try {
        const ref = doc(fireDB, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && !isCancelled) {
          const data = snap.data();
          setUserName(data.name || 'Student');
        }
      } catch (err) {
        console.error('[SGS Quiz] User fetch error:', err);
      }
    };
    fetchUser();
    return () => {
      isCancelled = true;
    };
  }, [user]);

  // Anti-cheat protections active during the exam (Step 1)
  useEffect(() => {
    if (step !== 1) return;

    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyCutPaste = (e) => e.preventDefault();
    const blockPrintScreen = (e) => {
      if (e.key === 'PrintScreen') {
        try {
          navigator.clipboard.writeText('Screen capture is restricted during evaluation.');
        } catch {
          // ignore clipboard write failure
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    window.addEventListener('keyup', blockPrintScreen);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
      window.removeEventListener('keyup', blockPrintScreen);
    };
  }, [step]);

  // Fetch Note Quiz Data
  useEffect(() => {
    let isCancelled = false;

    const fetchQuiz = async () => {
      if (!quizId) {
        toast.error('Quiz identifier is missing.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(fireDB, 'notes', quizId);
        const docSnap = await getDoc(docRef);

        if (isCancelled) return;

        if (docSnap.exists()) {
          const noteData = docSnap.data();

          if (!noteData.quizEnabled) {
            toast.error('Quiz is not enabled for this note.');
            setLoading(false);
            return;
          }

          if (!noteData.quiz || !Array.isArray(noteData.quiz.questions) || noteData.quiz.questions.length === 0) {
            toast.error('No practice questions are available for this note.');
            setLoading(false);
            return;
          }

          setQuizData({
            name: noteData.subject || 'Subject Quiz',
            language: 'English',
            questions: noteData.quiz.questions,
            noteId: docSnap.id,
            course: noteData.course || '',
            semester: noteData.semester || '',
          });
        } else {
          toast.error('Quiz document could not be found.');
        }
      } catch (err) {
        console.error('[SGS Quiz] Fetch error:', err);
        toast.error('Failed to load quiz data.');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchQuiz();
    return () => {
      isCancelled = true;
    };
  }, [quizId]);

  const handleSelectOption = useCallback((questionIdx, optionKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionKey,
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (!quizData) return;
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  }, [quizData, currentQuestion]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const handleSubmit = useCallback(() => {
    if (!quizData) return;

    let correctCount = 0;
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const total = quizData.questions.length;
    setScore(correctCount);
    setTotalQuestions(total);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [quizData, selectedAnswers]);

  const handleRestart = useCallback(() => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setScore(0);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const answeredCount = useMemo(() => {
    return Object.keys(selectedAnswers).length;
  }, [selectedAnswers]);

  const percentageScore = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.round((score / totalQuestions) * 100);
  }, [score, totalQuestions]);

  const scoreBadge = useMemo(() => {
    if (percentageScore >= 80) {
      return {
        label: 'Proficient Mastery',
        color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (percentageScore >= 60) {
      return {
        label: 'Solid Foundation',
        color: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200 dark:border-sky-800',
      };
    }
    return {
      label: 'Needs Concept Review',
      color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    };
  }, [percentageScore]);

  // Loading State
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors py-20 px-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Loading evaluation questions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Not Found State
  if (!quizData) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors py-24 px-4">
          <div className="max-w-lg mx-auto text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center text-2xl">
              <FaQuestionCircle />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Quiz Material Unavailable</h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
              This note currently does not have an active practice quiz or the content is being updated.
            </p>
            <button
              onClick={() => navigate('/DownloadNotes')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
            >
              <FaArrowLeft className="text-xs" /> Back to Notes Catalog
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{quizData.name} Practice Quiz | Soft Game Studio</title>
        <meta
          name="description"
          content={`Test your knowledge in ${quizData.name} with this interactive practice assessment on Soft Game Studio.`}
        />
        <meta property="og:title" content={`${quizData.name} Practice Quiz | Soft Game Studio`} />
        <meta
          property="og:description"
          content={`Interactive self-assessment for ${quizData.name} (${quizData.questions.length} questions).`}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb / Top Return Link */}
          <div className="mb-6">
            <Link
              to={`/DownloadNotes/${quizId}`}
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-xs" /> Return to Note Details
            </Link>
          </div>

          {/* STEP 0: Quiz Overview & Guidelines */}
          {step === 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6 sm:p-10 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <FaGraduationCap className="text-xs text-neutral-500" />
                  Self-Assessment Module
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  {quizData.name} Practice Quiz
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Evaluate your conceptual clarity with verified multiple-choice questions aligned with your course syllabus.
                </p>
              </div>

              {/* Quick Exam Metrics Card */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-center">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Questions</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">{quizData.questions.length}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Format</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">Multiple Choice</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Estimated Time</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">
                    {Math.max(5, Math.round(quizData.questions.length * 1.5))} mins
                  </p>
                </div>
              </div>

              {/* Instructions Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Session Guidelines
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                      <FaShieldAlt className="text-neutral-500" />
                      <span>Academic Honesty</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Complete this assessment independently to benchmark your personal retention of the subject material.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                      <FaClock className="text-neutral-500" />
                      <span>Single Session</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Navigate through all questions sequentially. Answers are recorded in browser state for immediate calculation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                      <FaAward className="text-neutral-500" />
                      <span>Instant Feedback</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Upon submission, view your total score and a full question breakdown comparing your choices with solutions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Start CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Start Practice Exam</span>
                  <FaArrowRight className="text-xs" />
                </button>
                <Link
                  to={`/DownloadNotes/${quizId}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-center"
                >
                  Review PDF Notes First
                </Link>
              </div>
            </div>
          )}

          {/* STEP 1: Interactive Question Taking */}
          {step === 1 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
              {/* Header: Progress & Question Counter */}
              <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/90 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      Question {currentQuestion + 1} of {quizData.questions.length}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {answeredCount} Answered
                    </span>
                  </div>
                  <span className="font-mono text-neutral-500 dark:text-neutral-400">
                    {Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 dark:bg-white transition-all duration-300 ease-out"
                    style={{
                      width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white leading-relaxed">
                    {quizData.questions[currentQuestion]?.question}
                  </h2>

                  {/* Code snippet display if question contains code */}
                  {quizData.questions[currentQuestion]?.code && (
                    <div className="mt-4 p-4 rounded-xl bg-neutral-950 text-neutral-100 font-mono text-xs overflow-x-auto border border-neutral-800">
                      <pre className="whitespace-pre-wrap">
                        {quizData.questions[currentQuestion].code}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-3" role="radiogroup" aria-label="Question Options">
                  {quizData.questions[currentQuestion]?.options ? (
                    Object.entries(quizData.questions[currentQuestion].options).map(([key, value]) => {
                      const isSelected = selectedAnswers[currentQuestion] === key;
                      return (
                        <label
                          key={key}
                          onClick={() => handleSelectOption(currentQuestion, key)}
                          className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-neutral-900 dark:border-white bg-neutral-100/70 dark:bg-neutral-800/80 shadow-sm'
                              : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion}`}
                            value={key}
                            checked={isSelected}
                            onChange={() => handleSelectOption(currentQuestion, key)}
                            className="mt-0.5 w-4 h-4 text-neutral-900 dark:text-white border-neutral-300 focus:ring-neutral-900 dark:focus:ring-white"
                          />
                          <div className="flex-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                            <span className="font-semibold uppercase mr-2 text-neutral-500 dark:text-neutral-400">
                              {key}.
                            </span>
                            {value}
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-neutral-500">
                      No options defined for this question.
                    </div>
                  )}
                </div>

                {/* Question Navigation Footer */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-2 ${
                      currentQuestion === 0
                        ? 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <FaArrowLeft className="text-xs" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <span>
                        {currentQuestion === quizData.questions.length - 1 ? 'Submit Exam' : 'Next Question'}
                      </span>
                      <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Performance Evaluation & Full Review */}
          {step === 2 && (
            <div className="space-y-8">
              {/* Score Summary Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-sm text-center space-y-6">
                <div className="space-y-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${scoreBadge.color}`}>
                    <FaAward className="text-xs" />
                    {scoreBadge.label}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    Assessment Completed
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    Performance calculation for {userName} on {date}
                  </p>
                </div>

                {/* Score Number Display */}
                <div className="max-w-xs mx-auto p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1">Total Score</p>
                  <p className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white">
                    {score} <span className="text-lg font-normal text-neutral-400">/ {totalQuestions}</span>
                  </p>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-2">
                    {percentageScore}% Accuracy
                  </p>
                </div>

                {/* Next Steps Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm"
                  >
                    <FaRedo className="text-xs" />
                    <span>Retake Quiz</span>
                  </button>

                  <Link
                    to={`/DownloadNotes/${quizId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FaFileAlt className="text-xs" />
                    <span>Return to Note</span>
                  </Link>

                  <Link
                    to="/DownloadNotes"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <span>Browse All Notes</span>
                  </Link>
                </div>
              </div>

              {/* Comprehensive Question Review Breakdown */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                    Detailed Question Review
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Compare your selected answers with the verified solution key.
                  </p>
                </div>

                <div className="space-y-4">
                  {quizData.questions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctAnswer;
                    const isAnswered = Boolean(userAns);

                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-xl border transition-colors ${
                          isCorrect
                            ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                            : 'border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/10'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex-shrink-0">
                            {isCorrect ? (
                              <FaCheckCircle className="text-emerald-500 text-base" />
                            ) : (
                              <FaTimesCircle className="text-red-500 text-base" />
                            )}
                          </span>

                          <div className="flex-1 space-y-2">
                            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                              {idx + 1}. {q.question}
                            </h3>

                            {q.code && (
                              <div className="p-3 rounded-lg bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto">
                                <pre className="whitespace-pre-wrap">{q.code}</pre>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                                  Your Selection:
                                </span>
                                <span
                                  className={`font-semibold ${
                                    isCorrect
                                      ? 'text-emerald-700 dark:text-emerald-400'
                                      : 'text-red-700 dark:text-red-400'
                                  }`}
                                >
                                  {isAnswered
                                    ? `${userAns}: ${q.options?.[userAns] || 'Selected'}`
                                    : 'Not answered'}
                                </span>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                                  Correct Key:
                                </span>
                                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                  {q.correctAnswer}: {q.options?.[q.correctAnswer] || 'Answer'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}