// src/pages/CUSTOMER SERVICE/FeedBackFome.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import {
  MessageSquare,
  ThumbsUp,
  Award,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquareQuote,
  Loader2
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import { fireDB } from "../../DataBase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import StarRatingSelector from "../../components/StartRating/StarRating";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FeedbackSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: 5
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Parallax transforms (disabled if user prefers reduced motion)
  const yHero = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -120]);

  // Fetch feedback from Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const feedbackRef = collection(fireDB, "feedback");
        const q = query(feedbackRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const feedbacks = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          let createdAtDate = new Date();
          if (data.createdAt && typeof data.createdAt.toDate === "function") {
            createdAtDate = data.createdAt.toDate();
          } else if (data.createdAt) {
            createdAtDate = new Date(data.createdAt);
          }

          feedbacks.push({
            id: docSnap.id,
            name: data.name || "Anonymous",
            email: data.email || "",
            subject: data.subject || "Feedback",
            message: data.message || "",
            rating: typeof data.rating === "number" ? data.rating : 5,
            createdAt: createdAtDate
          });
        });

        if (isMounted) {
          setFeedbackList(feedbacks);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        if (isMounted) {
          setStatus({
            type: "error",
            text: "Failed to load community feedback. Please refresh."
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFeedback();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: "info", text: "Submitting your feedback..." });

      const docRef = await addDoc(collection(fireDB, "feedback"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || "General Feedback",
        message: formData.message.trim(),
        rating: Number(formData.rating) || 5,
        createdAt: serverTimestamp()
      });

      const newFeedback = {
        id: docRef.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || "General Feedback",
        message: formData.message.trim(),
        rating: Number(formData.rating) || 5,
        createdAt: new Date()
      };

      setFeedbackList((prev) => [newFeedback, ...prev]);
      setFormData({ name: "", email: "", subject: "", message: "", rating: 5 });
      setStatus({
        type: "success",
        text: "Thank you! Your feedback has been published successfully."
      });
    } catch (error) {
      console.error("Error adding feedback:", error);
      setStatus({
        type: "error",
        text: "Failed to submit feedback. Please check your connection and try again."
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus({ type: "", text: "" });
      }, 5000);
    }
  };

  // Compute live statistics
  const total = feedbackList.length;
  const ratingStats = useMemo(() => {
    return [1, 2, 3, 4, 5].map(
      (r) => feedbackList.filter((f) => Math.round(f.rating) === r).length
    );
  }, [feedbackList]);

  const positiveFeedbacks = useMemo(() => {
    return feedbackList.filter((f) => f.rating >= 4).length;
  }, [feedbackList]);

  const positivePercentage = total > 0 ? Math.round((positiveFeedbacks / total) * 100) : 100;

  const avgRating = useMemo(() => {
    if (total === 0) return "5.0";
    const sum = feedbackList.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0);
    return (sum / total).toFixed(1);
  }, [feedbackList, total]);

  // Chart configuration
  const chartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Reviews",
        data: ratingStats,
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(0, 172, 240, 0.85)"
        ],
        borderColor: [
          "#ef4444",
          "#f97316",
          "#f59e0b",
          "#0ea5e9",
          "#00ACF0"
        ],
        borderWidth: 1.5,
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleFont: { size: 13, weight: "600" },
        bodyFont: { size: 12 },
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} review${context.parsed.y === 1 ? "" : "s"}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#94a3b8",
          font: { size: 11 }
        },
        grid: {
          color: "rgba(148, 163, 184, 0.1)"
        }
      },
      x: {
        ticks: {
          color: "#94a3b8",
          font: { size: 12, weight: "500" }
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Structured Data Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Customer Feedback & Reviews",
    "url": "https://softgamestudios.web.app/Feedback",
    "description": "Share your experience and browse authentic customer feedback for Soft Game Studio.",
    "publisher": {
      "@type": "Organization",
      "name": "Soft Game Studio Pvt. Ltd.",
      "url": "https://softgamestudios.web.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
      }
    }
  };

  if (total > 0) {
    schemaData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": total,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // Loading skeleton state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <div className="h-10 w-72 bg-neutral-200 dark:bg-neutral-800 rounded-md mx-auto animate-pulse" />
              <div className="h-5 w-96 max-w-full bg-neutral-200 dark:bg-neutral-800 rounded-md mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 animate-pulse space-y-3"
                >
                  <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 animate-pulse h-80" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href="https://softgamestudios.web.app/Feedback" />
        <title>Customer Feedback & Reviews | Soft Game Studio</title>
        <meta
          name="description"
          content="Share your experience and explore authentic customer feedback for Soft Game Studio game development, courses, and educational tools."
        />
        <meta
          name="keywords"
          content="customer feedback, soft game studio reviews, client testimonials, game dev rating, user opinions"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content="Customer Feedback & Reviews | Soft Game Studio" />
        <meta
          property="og:description"
          content="Read genuine user reviews and share your personal experience with Soft Game Studio products and educational programs."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FCustomer-Feedback-Portal-Share-Your-Experience-Soft-Game-Studio-06-07-2025_02_08_PM.png?alt=media&token=2f94c5c4-6d9c-482b-92df-015bef62c1ce"
        />
        <meta property="og:url" content="https://softgamestudios.web.app/Feedback" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SoftGameStudio" />
        <meta name="twitter:title" content="Customer Feedback & Reviews | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Explore user ratings and submit your thoughts to help Soft Game Studio improve."
        />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FCustomer-Feedback-Portal-Share-Your-Experience-Soft-Game-Studio-06-07-2025_02_08_PM.png?alt=media&token=2f94c5c4-6d9c-482b-92df-015bef62c1ce"
        />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        {/* Hero Section */}
        <header className="relative pt-24 pb-16 px-4 bg-gradient-to-b from-neutral-100 via-neutral-50 to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <motion.div
            style={{ y: yHero }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] dark:text-sky-400 border border-sky-200 dark:border-sky-900/50 mb-6">
              <MessageSquare className="w-3.5 h-3.5" />
              Community Voice
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Customer Feedback & Reviews
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Your honest feedback shapes our game mechanics, learning resources, and development services.
            </p>

            {/* Scorecard Hero Banner */}
            <div className="mt-8 inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#00ACF0]">
                {avgRating}
              </div>
              <div className="text-left border-l border-neutral-200 dark:border-neutral-800 pl-6">
                <StarRatingSelector
                  rating={Number(avgRating) || 5}
                  readOnly={true}
                  size="md"
                />
                <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                  Based on {total} authentic submission{total === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Live Metrics Grid */}
        <section aria-labelledby="feedback-stats-heading" className="py-12 px-4 max-w-6xl mx-auto">
          <h2 id="feedback-stats-heading" className="sr-only">Community Feedback Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition hover:border-[#00ACF0]/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Reviews</span>
                <span className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0]">
                  <MessageSquare className="w-5 h-5" />
                </span>
              </div>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-4">{total}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Verified user responses</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition hover:border-[#00ACF0]/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Satisfaction Rate</span>
                <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
                  <ThumbsUp className="w-5 h-5" />
                </span>
              </div>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-4">
                {positivePercentage}%
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Rated 4 stars or higher</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition hover:border-[#00ACF0]/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Overall Rating</span>
                <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500">
                  <Award className="w-5 h-5" />
                </span>
              </div>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-4">{avgRating} / 5</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Calculated in real time</p>
            </div>
          </div>
        </section>

        {/* Rating Breakdown Chart */}
        <section aria-labelledby="rating-distribution-heading" className="py-8 px-4 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="text-center mb-6">
              <h2 id="rating-distribution-heading" className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Rating Breakdown
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Visualizing reviews from 1 to 5 stars
              </p>
            </div>

            <div className="h-64 w-full">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </section>

        {/* Feedback Submission Form */}
        <section aria-labelledby="submit-feedback-heading" className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="text-center mb-8">
              <h2 id="submit-feedback-heading" className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Submit Your Feedback
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                We read every submission to improve our platform.
              </p>
            </div>

            {/* Submission Status Alert */}
            {status.text && (
              <div
                role="status"
                aria-live="polite"
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                  status.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : status.type === "error"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    : "bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{status.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. SGS Projects, Course Quality, App Experience"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Your Experience & Suggestions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you liked or how we can improve..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] focus:border-transparent transition resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Rate Your Experience
                </label>
                <div className="flex items-center gap-3">
                  <StarRatingSelector
                    rating={formData.rating}
                    setRating={(newRating) =>
                      setFormData((prev) => ({ ...prev, rating: newRating }))
                    }
                    size="lg"
                  />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {formData.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#00ACF0] hover:bg-[#0092cc] active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing Review...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Public Testimonials Section */}
        <section aria-labelledby="recent-feedback-heading" className="py-16 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="recent-feedback-heading" className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Recent Feedback & Reviews
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Browse authentic reviews from students, educators, and gaming enthusiasts.
            </p>
          </div>

          {feedbackList.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 max-w-lg mx-auto">
              <MessageSquareQuote className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-600 mb-3" />
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                No feedback published yet
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Be the first to share your thoughts using the form above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbackList.map((item) => (
                <article
                  key={item.id}
                  className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between hover:border-[#00ACF0]/40 transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-bold text-base text-neutral-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <time className="text-xs text-neutral-400 whitespace-nowrap">
                        {item.createdAt.toLocaleDateString()}
                      </time>
                    </div>

                    <div className="mb-3">
                      <StarRatingSelector
                        rating={item.rating}
                        readOnly={true}
                        size="sm"
                      />
                    </div>

                    <h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 mb-2">
                      {item.subject}
                    </h4>

                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                      {item.message}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}