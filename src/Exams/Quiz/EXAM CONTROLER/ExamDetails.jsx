import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { fireDB } from "../../../DataBase/firebaseConfig";
import Layout from "../../../components/layout/Layout";
import { FaPlay, FaClock, FaCalendarAlt, FaShieldAlt, FaExclamationTriangle, FaHeadphones } from "react-icons/fa";

const OfficialQuizDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const docRef = doc(fireDB, "quizzes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const examData = docSnap.data();
          setExam({
            ...examData,
            id: docSnap.id
          });
        } else {
          setExam(null);
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setExam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (!exam) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const startTime = exam.examStart ? new Date(exam.examStart).getTime() : null;
      const endTime   = exam.examEnd   ? new Date(exam.examEnd).getTime()   : null;

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
      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}H`);
      } else {
        setTimeLeft(`${hours}H ${minutes}M ${seconds}S`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam]);

  const handleOpenQuiz = (examId) => {
    navigate(`/SGS-Quiz-Official/${examId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[85vh] bg-slate-50 dark:bg-neutral-950 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="h-14 w-14 border-4 border-purple-600 border-t-transparent rounded-full shadow-md"
          ></motion.div>
          <p className="text-purple-600 dark:text-purple-400 font-medium">Fetching exam schedule...</p>
        </div>
      </Layout>
    );
  }

  if (!exam) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[85vh] bg-slate-50 dark:bg-neutral-950 text-center p-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-6 text-red-500"
          >
            <FaExclamationTriangle className="mx-auto" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2"
          >
            Exam Not Found
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-500 dark:text-gray-400 mb-8 max-w-md"
          >
            The exam details you are looking for may have been archived or removed by the administrator.
          </motion.p>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition-all"
          >
            Go Back
          </motion.button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-slate-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
        
        {/* Immersive Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-850 dark:from-purple-950 dark:via-indigo-950 dark:to-neutral-950 py-24 md:py-32 px-4">
          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col justify-center items-center max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 dark:bg-neutral-900/40 border border-white/20 px-4 py-1.5 rounded-full text-white text-sm font-semibold mb-6 backdrop-blur"
            >
              🏆 Official Coding Certification
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow"
            >
              {exam.name}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-purple-100 max-w-2xl mb-10 leading-relaxed font-light"
            >
              Subject area: <span className="font-semibold text-amber-200">{exam.language}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              {timeLeft === "STARTED" ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOpenQuiz(exam.id)}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 text-lg"
                >
                  <FaPlay className="w-4 h-4" /> Start Exam Now
                </motion.button>
              ) : timeLeft === "ENDED" ? (
                <button
                  disabled
                  className="bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold py-4 px-10 rounded-2xl shadow border border-red-200/10 cursor-not-allowed flex items-center justify-center gap-2.5 text-lg w-full sm:w-auto"
                >
                  Registration Closed
                </button>
              ) : (
                <div className="bg-white dark:bg-neutral-900 text-purple-700 dark:text-purple-300 font-mono font-bold py-4 px-10 rounded-2xl shadow-lg flex items-center justify-center gap-2.5 text-lg border border-purple-100 dark:border-neutral-800">
                  <FaClock className="w-4 h-4 text-purple-500 animate-pulse" />
                  {timeLeft || "Timer starting..."}
                </div>
              )}
              <button
                onClick={() => window.scrollTo({ top: document.getElementById("details-content").offsetTop - 60, behavior: 'smooth' })}
                className="bg-purple-600/30 hover:bg-purple-600/40 text-white font-bold py-4 px-10 rounded-2xl border border-white/20 backdrop-blur transition-all flex items-center justify-center gap-2"
              >
                View Rules & Syllabus
              </button>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <section id="details-content" className="py-16 md:py-24 max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-12 items-center bg-white dark:bg-neutral-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-purple-50/50 dark:border-neutral-800/40"
          >
            {/* Image display */}
            <div className="lg:w-1/2 w-full flex justify-center">
              <motion.img
                src={exam.imageUrl || "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500"}
                alt={exam.name}
                className="w-full max-h-80 sm:max-h-96 object-contain rounded-2xl shadow-lg border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4"
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              />
            </div>

            {/* Description */}
            <div className="lg:w-1/2 w-full">
              <h2 className="text-3xl font-extrabold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                Exam Details
              </h2>
              <div className="h-1 w-20 bg-purple-600 rounded-full mb-6"></div>
              
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8">
                {parse(exam.description || "<p>No description provided for this exam.</p>")}
              </div>

              <div className="flex flex-wrap gap-4">
                {timeLeft === "STARTED" ? (
                  <button
                    onClick={() => handleOpenQuiz(exam.id)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                  >
                    <FaPlay className="w-3.5 h-3.5" /> Start Exam Now
                  </button>
                ) : timeLeft === "ENDED" ? (
                  <button
                    disabled
                    className="bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 font-semibold py-3 px-8 rounded-xl border border-red-200/20 text-sm cursor-not-allowed"
                  >
                    Ended
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-purple-50 dark:bg-neutral-800 text-purple-600 dark:text-purple-400 font-semibold py-3 px-8 rounded-xl border border-purple-200/20 text-sm cursor-not-allowed flex items-center gap-2"
                  >
                    <FaClock className="w-3.5 h-3.5 animate-pulse" /> {timeLeft || "Pending"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Guidelines / Features Section */}
        <section className="py-16 bg-slate-100/50 dark:bg-neutral-900/30 border-t border-b border-slate-200/50 dark:border-neutral-800/40">
          <div className="max-w-6xl mx-auto px-4">
            <motion.h2 
              className="text-3xl font-extrabold mb-12 text-center text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Exam Guidelines & Policy
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FaClock className="w-7 h-7 text-purple-600 dark:text-purple-400" />,
                  title: "Strict Time Window",
                  description: "Once the timer begins, it cannot be paused or reset. Manage your pace to answer all shuffled questions."
                },
                {
                  icon: <FaShieldAlt className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
                  title: "Cheating Detection",
                  description: "Tab switching, right clicking, copy-pasting, and print-screening are blocked. Violations result in automatic disqualification."
                },
                {
                  icon: <FaCalendarAlt className="w-7 h-7 text-violet-600 dark:text-violet-400" />,
                  title: "Verifiable Result",
                  description: "Completed exams generate verifiable certifications of score. A certificate with a QR code is issued to passing candidates."
                }
              ].map((guideline, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow border border-purple-50/20 dark:border-neutral-800 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="p-3 bg-purple-50 dark:bg-neutral-800/60 rounded-xl mb-4">
                    {guideline.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {guideline.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {guideline.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Callout Section */}
        <section className="py-20 max-w-4xl mx-auto text-center px-4">
          <div className="bg-gradient-to-tr from-purple-800 to-indigo-900 text-white rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to test your limits?</h2>
            <p className="text-purple-200 mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Ensure you have a reliable network connection and a distraction-free environment before starting this official exam.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {timeLeft === "STARTED" ? (
                <button 
                  onClick={() => handleOpenQuiz(exam.id)}
                  className="bg-white hover:bg-slate-100 text-purple-700 font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]"
                >
                  Start Exam Now
                </button>
              ) : timeLeft === "ENDED" ? (
                <div className="bg-red-500/20 text-red-200 border border-red-400/30 py-3.5 px-8 rounded-2xl font-bold">
                  Exam Has Closed
                </div>
              ) : (
                <div className="bg-white/10 text-white border border-white/20 py-3.5 px-8 rounded-2xl font-mono font-bold backdrop-blur">
                  {timeLeft || "Timer starting..."}
                </div>
              )}
              <button 
                onClick={() => navigate("/ContactUs")}
                className="bg-transparent hover:bg-white/10 text-white font-bold py-3.5 px-8 rounded-2xl border border-white/30 transition-all flex items-center justify-center gap-2"
              >
                <FaHeadphones className="w-3.5 h-3.5" /> Support Desk
              </button>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default OfficialQuizDetails;