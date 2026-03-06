import React, { useState, useEffect } from "react";
import {
  getDoc, doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fireDB } from "../../../DataBase/firebaseConfig";
import Layout from "../../../components/layout/Layout";
import { useAuth } from "../../../AuthProvide";

const NoteQuizExam = () => {
  const { user } = useAuth();
  const { id: quizId } = useParams();
  const [step, setStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [score, setScore] = useState(0);
  const [Que, setQue] = useState(0);
  const [date, setDate] = useState("");
  const [userName, setUserName] = useState("Guest User");

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  useEffect(() => {

    const fetchUser = async () => {

      if (!user?.uid) return;

      try {

        const ref = doc(fireDB, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {

          const data = snap.data();
          setUserName(data.name || "Guest User");

        }

      } catch (err) {
        console.error("User fetch error:", err);
      }

    };

    fetchUser();

  }, [user]);





  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyCutPaste = (e) => e.preventDefault();
    const blockPrintScreen = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("Screenshot is disabled.");
        alert("Screenshots are disabled.");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCutPaste);
    document.addEventListener("cut", handleCopyCutPaste);
    document.addEventListener("paste", handleCopyCutPaste);
    window.addEventListener("keyup", blockPrintScreen);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
      window.removeEventListener("keyup", blockPrintScreen);
    };
  }, []);




  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        toast.error("Quiz ID missing.");
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(fireDB, "notes", quizId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          const noteData = docSnap.data();

          if (!noteData.quizEnabled) {
            toast.error("Quiz is disabled.");
            return;
          }

          if (!noteData.quiz || !noteData.quiz.questions?.length) {
            toast.error("Quiz not available.");
            return;
          }

          setQuizData({
            name: noteData.subject,
            language: "English",
            questions: noteData.quiz.questions,
          });

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

  const handleSubmit = async () => {
    if (!quizData) {
      toast.error("Quiz not loaded.");
      return;
    }

    let correctCount = 0;
    quizData.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correctCount++;
    });

    const NoQuestion = quizData.questions.length;

    setScore(correctCount);
    setQue(NoQuestion);
    toast.success("Quiz completed!");
    setStep(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          Quiz data not available.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {step === 0 && (
        <Layout>
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-purple-700 mb-6">
                {quizData.name} Quiz
              </h1>

              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Practice Quiz
                  <span className="font-medium text-gray-900">

                  </span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg">
                  <h2 className="text-xl font-bold text-center mb-2">Quiz Instructions</h2>
                  <p className="text-center font-medium">(Please read the following guidelines before starting the quiz)</p>
                </div>

                <div>
                  <section className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-lg p-6 sm:p-8">


                    {/* No Cheating */}
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">🚫 Academic Integrity</h3>
                      <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• This quiz is designed for learning and self-assessment.</li>
                        <li>• Please attempt the quiz honestly without using external assistance.</li>
                        <li>• Avoid switching tabs, screen sharing, or using additional devices during the quiz.</li>
                        <li>• Any attempt to bypass quiz restrictions may invalidate your attempt.</li>
                      </ul>
                    </div>


                    {/* Strict Deadline */}
                    <div className="flex gap-3 mt-6">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">⏱ Time Guidelines</h3>
                        <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Complete the quiz in a single session once started.</li>
                          <li>• Avoid refreshing or leaving the page during the quiz.</li>
                          <li>• All answers will be evaluated immediately after submission.</li>
                        </ul>
                      </div>
                    </div>


                    {/* Identity & Fair Use */}
                    <div className="flex gap-3 mt-6">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">👤 Responsible Use</h3>
                        <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• This quiz is intended for educational practice.</li>
                          <li>• Do not distribute or publicly share quiz questions or answers.</li>
                          <li>• Please respect the learning process and attempt the quiz sincerely.</li>
                        </ul>
                      </div>
                    </div>


                    {/* Important Notes */}
                    <div className="mt-6 border-t border-gray-100 dark:border-neutral-800 pt-5">
                      <h4 className="font-medium text-gray-800 dark:text-white">📌 Important Notes</h4>
                      <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Read all instructions carefully before starting the quiz.</li>
                        <li>• Ensure a stable internet connection for a smooth experience.</li>
                        <li>• Attempt each question carefully before moving to the next one.</li>
                        <li>• Once the quiz is submitted, your score will be displayed immediately.</li>
                        <li>• You may restart the quiz to practice again if needed.</li>
                      </ul>


                      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                      </div>
                    </div>
                  </section>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-colors duration-200"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Layout>

      )}

      {step === 1 && (
        <Layout>
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </h2>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {quizData.language}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                          className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer border transition ${selectedAnswers[currentQuestion] === key
                            ? "bg-purple-100 border-purple-300"
                            : "bg-white border-gray-200 hover:bg-purple-50"
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
                            className="mt-1 accent-purple-600 w-5 h-5"
                          />
                          <span className="text-gray-800">{value}</span>
                        </label>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No options available for this question.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`px-5 py-2.5 rounded-md font-medium ${currentQuestion === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200"
                  >
                    {currentQuestion === quizData.questions.length - 1
                      ? "Submit Quiz"
                      : "Next Question"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Layout>

      )}

      {step === 2 && (
        <Layout>
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-purple-700">
                    Congratulations!
                  </h1>
                  <p className="text-gray-600">
                    You have successfully completed the quiz.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg shadow-inner border-2 border-purple-200">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-purple-800 mb-2">
                      Quiz Completion Summary
                    </h2>
                    <div className="w-20 h-1 bg-purple-300 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">
                      This summarizes your performance
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-purple-700 mb-1">
                      {userName}
                    </h3>
                    <p className="text-gray-600">Practice Quiz Attempt</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-700 mb-2">You completed:</p>
                    <h4 className="text-lg font-semibold text-purple-600">
                      {quizData?.name}
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Language: {quizData?.language || "English"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-purple-200">
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Score</p>
                      <p className="font-medium">
                        {score} out of {Que}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="bg-purple-100 text-purple-800 px-4 py-3 rounded-lg">
                    <p className="font-medium">
                      Final Score: {score} out of {Que} (
                      {Que > 0 ? ((score / Que) * 100).toFixed(1) : 0}%)
                    </p>
                  </div>

                  <div className="pt-4">
                    <p className="text-gray-600 mb-3">
                      What would you like to do next?
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                      <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200"
                      >
                        Restart Quiz
                      </button>

                      <a
                        href="/DownloadNotes"
                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200 text-center"
                      >
                        Go to Notes
                      </a>

                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      You can restart the quiz to practice again or explore more notes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>

      )}
    </div>
  );
};

export default NoteQuizExam;