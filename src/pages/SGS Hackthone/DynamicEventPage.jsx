// src/pages/SGS Hackthone/DynamicEventPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Particles from "react-tsparticles";
import { 
  Rocket, Lightbulb, TrendingUp, MonitorPlay, 
  Users, CalendarDays, Award, ChevronDown, CheckCircle2, 
  Clock, MapPin, BookOpen, MessageCircle
} from "lucide-react";
import RegistrationForm from "./RegistrationForm";

// ---------- Default empty event structure ----------
const EMPTY_EVENT = {
  basic: { title: "", tagline: "", shortDescription: "", longDescription: "", coverImage: "", mode: "", location: "", registrationOpen: "", registrationClose: "", eventStart: "", eventEnd: "", entryFee: 0, certificate: false, type: "" },
  team: { allowSolo: true, allowTeam: true, minSize: 1, maxSize: 4, maxTeams: 100 },
  problemStatements: [],
  timeline: [],
  judging: [],
  faq: [],
  prizes: [],
  registrationFields: [],
};

// Database schema normalization to support both flat top-level structures and nested "basic" maps
const normalizeEvent = (data) => {
  if (!data) return EMPTY_EVENT;
  const basic = {
    title: data.title || data.basic?.title || "",
    tagline: data.tagline || data.basic?.tagline || "",
    shortDescription: data.shortDescription || data.basic?.shortDescription || "",
    longDescription: data.longDescription || data.basic?.longDescription || "",
    coverImage: data.coverImage || data.basic?.coverImage || "",
    mode: data.mode || data.basic?.mode || "",
    location: data.location || data.basic?.location || "",
    registrationOpen: data.registrationOpen || data.basic?.registrationOpen || "",
    registrationClose: data.registrationClose || data.basic?.registrationClose || "",
    eventStart: data.eventStart || data.basic?.eventStart || "",
    eventEnd: data.eventEnd || data.basic?.eventEnd || "",
    entryFee: data.entryFee !== undefined ? data.entryFee : (data.basic?.entryFee !== undefined ? data.basic.entryFee : 0),
    certificate: data.certificate !== undefined ? data.certificate : (data.basic?.certificate !== undefined ? data.basic.certificate : false),
    type: data.type || data.basic?.type || "",
  };

  const team = {
    allowSolo: data.team?.allowSolo !== undefined ? data.team.allowSolo : true,
    allowTeam: data.team?.allowTeam !== undefined ? data.team.allowTeam : true,
    minSize: data.team?.minSize !== undefined ? data.team.minSize : 1,
    maxSize: data.team?.maxSize !== undefined ? data.team.maxSize : 4,
    maxTeams: data.team?.maxTeams !== undefined ? data.team.maxTeams : 100,
  };

  return {
    ...data,
    basic,
    team,
    problemStatements: data.problemStatements || [],
    timeline: data.timeline || [],
    judging: data.judging || [],
    faq: data.faq || [],
    prizes: data.prizes || [],
    registrationFields: data.registrationFields || [],
  };
};

// Helper to format dates
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function DynamicEventPage() {
  const { id } = useParams();
  const eventId = id;
  const [event, setEvent] = useState(EMPTY_EVENT);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Fetch event from Firestore
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const docRef = doc(fireDB, "events", eventId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const normalized = normalizeEvent({ id: snap.id, ...snap.data() });
          setEvent(normalized);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  const scrollToRegister = () => {
    document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Determine registration status badge text
  const registrationOpen = event.basic.registrationOpen;
  const registrationClose = event.basic.registrationClose;
  const now = new Date();
  const badgeText = registrationOpen && new Date(registrationOpen) <= now && new Date(registrationClose) >= now
    ? "Registrations Now Open"
    : "Registrations Closed";

  // Loading & Not Found states
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#07070F]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#07070F] text-slate-900 dark:text-white px-6 text-center">
          <Rocket className="w-16 h-16 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  const {
    basic,
    team,
    problemStatements,
    timeline,
    judging,
    faq,
    prizes,
    registrationFields,
  } = event;

  return (
    <Layout>
      <div ref={containerRef} className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#07070F] text-slate-900 dark:text-white selection:bg-purple-500/30 overflow-hidden">
        
        {/* Particles */}
        <Particles
          options={{
            background: { color: "transparent" },
            particles: {
              number: { value: 60, density: { enable: true, value_area: 800 } },
              color: { value: "#8b5cf6" },
              shape: { type: "circle" },
              opacity: { value: 0.3, random: true },
              size: { value: 3, random: true },
              move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out", bounce: false },
              links: { enable: true, distance: 150, color: "#8b5cf6", opacity: 0.1, width: 1 },
            },
            interactivity: {
              events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
              modes: { grab: { distance: 200, line_linked: { opacity: 0.3 } } },
            },
            retina_detect: true,
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Glow Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none translate-x-[-50%]" />

        {/* ---------- HERO SECTION ---------- */}
        <motion.section
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 min-h-[90vh] flex items-center justify-center px-6 pt-32 pb-20 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-purple-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              >
                <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-purple-700 dark:text-purple-300">
                  {badgeText}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1]"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-700 to-indigo-900 dark:from-white dark:via-purple-200 dark:to-indigo-300">
                  {basic.title || "Untitled Event"}
                </span>
              </motion.h1>

              {/* Tagline / Short Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed"
              >
                {basic.tagline || basic.shortDescription}
              </motion.p>

              {/* Metadata chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-3 w-full"
              >
                {basic.mode && (
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-gray-300 text-sm font-semibold">
                    <MapPin className="w-4 h-4 text-purple-500" /> {basic.mode} {basic.location && `· ${basic.location}`}
                  </span>
                )}
                {(basic.eventStart || basic.eventEnd) && (
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-gray-300 text-sm font-semibold">
                    <Clock className="w-4 h-4 text-purple-500" /> {formatDate(basic.eventStart)} - {formatDate(basic.eventEnd)}
                  </span>
                )}
                {basic.entryFee !== undefined && (
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-gray-300 text-sm font-semibold">
                    <Award className="w-4 h-4 text-purple-500" /> {basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee}`}
                  </span>
                )}
                {basic.certificate && (
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/20 backdrop-blur-md border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold shadow-sm shadow-amber-500/5">
                    🏆 Certificate Included
                  </span>
                )}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-4"
              >
                <button
                  onClick={scrollToRegister}
                  className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 overflow-hidden rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-100"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                    Register Now <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </button>
              </motion.div>
            </div>

            {/* Right Cover Image Column */}
            <div className="lg:col-span-5 w-full flex justify-center items-center">
              {basic.coverImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200/60 dark:border-white/10 bg-slate-100 dark:bg-white/5 shadow-2xl p-2.5 group"
                >
                  <div className="relative w-full h-full rounded-[18px] overflow-hidden">
                    <img
                      src={basic.coverImage}
                      alt={basic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                  </div>
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200/60 dark:border-white/10 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 shadow-2xl flex flex-col items-center justify-center p-6 text-center"
                >
                  <Rocket className="w-16 h-16 text-purple-500 animate-bounce mb-4" />
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest">{basic.type || "HACKATHON"}</span>
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-40 hidden lg:flex flex-col items-center text-xs font-bold tracking-widest uppercase cursor-pointer"
            onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Scroll Down
            <ChevronDown className="mt-1 w-4 h-4" />
          </motion.div>
        </motion.section>

        {/* ---------- LONG DESCRIPTION / ABOUT ---------- */}
        {basic.longDescription && (
          <section id="about-section" className="relative z-10 py-16 px-6 max-w-4xl mx-auto text-center border-t border-slate-100 dark:border-white/5">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">About the Event</h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium"
            >
              {basic.longDescription}
            </motion.p>
          </section>
        )}

        {/* ---------- EVENT OVERVIEW / INFO CARDS ---------- */}
        <section className="relative z-10 py-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Structure Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="w-8 h-8 text-purple-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Participation Rules</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span>Solo Allowed:</span>
                  <span className="font-semibold">{team.allowSolo ? "Yes" : "No"}</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span>Team Allowed:</span>
                  <span className="font-semibold">{team.allowTeam ? "Yes" : "No"}</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span>Team Size:</span>
                  <span className="font-semibold">{team.minSize === team.maxSize ? `${team.minSize} Member` : `${team.minSize} - ${team.maxSize} Members`}</span>
                </li>
              </ul>
            </motion.div>

            {/* Event Format Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all"
            >
              <MapPin className="w-8 h-8 text-indigo-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Mode & Venue</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span>Mode:</span>
                  <span className="font-semibold capitalize text-purple-600 dark:text-purple-400">{basic.mode?.toLowerCase() || "Not specified"}</span>
                </li>
                {basic.location && (
                  <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                    <span>Location:</span>
                    <span className="font-semibold">{basic.location}</span>
                  </li>
                )}
                <li className="flex justify-between pb-1">
                  <span>Category:</span>
                  <span className="font-semibold capitalize">{basic.type?.toLowerCase() || "Event"}</span>
                </li>
              </ul>
            </motion.div>

            {/* Important Dates Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all"
            >
              <Clock className="w-8 h-8 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Registration Details</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span>Registration Opens:</span>
                  <span className="font-semibold">{formatDate(basic.registrationOpen)}</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span>Registration Closes:</span>
                  <span className="font-semibold text-rose-500">{formatDate(basic.registrationClose)}</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span>Current Status:</span>
                  <span className={`font-semibold ${badgeText.includes("Open") ? "text-emerald-500" : "text-rose-500"}`}>{badgeText}</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ---------- PROBLEM STATEMENTS / TRACKS ---------- */}
        {problemStatements.length > 0 && (
          <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500 mb-4">
                Problem Categories
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                Choose your battlefield. Construct the future.
              </p>
            </div>

            <div className="space-y-16 lg:space-y-28">
              {problemStatements.map((item, i) => {
                const isEven = i % 2 === 0;
                const trackIcon = <BookOpen className="w-8 h-8" />;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                    className={`flex flex-col gap-8 lg:gap-16 items-center ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    <div className="w-full lg:w-1/2 perspective-[1000px]">
                      <motion.div
                        whileHover={{ rotateY: isEven ? 6 : -6, rotateX: 3, z: 30 }}
                        transition={{ duration: 0.4 }}
                        className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 dark:border-white/5 bg-slate-100 dark:bg-black/20 backdrop-blur-sm aspect-video transform-style-3d group"
                      >
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"}
                          alt={item.name}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                            {trackIcon}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-4 text-left">
                      <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400 font-bold tracking-wider">
                        <span className="text-xs bg-purple-50 dark:bg-purple-900/30 px-3.5 py-1.5 rounded-full border border-purple-200 dark:border-purple-800 uppercase">
                          {item.track || `Track ${i + 1}`}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------- TIMELINE SECTION ---------- */}
        {timeline.length > 0 && (
          <section className="relative z-10 py-24 bg-gray-50/50 dark:bg-[#0A0A12]/85 border-y border-gray-200 dark:border-white/5">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500 mb-4">
                  Event Timeline
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                  Follow the roadmap of the event from start to finish.
                </p>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-indigo-500 before:opacity-30">
                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    {/* Timeline Node */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0A0A12] bg-purple-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {/* Timeline Card */}
                    <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg hover:-translate-y-1 transition-transform text-left">
                      <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1">{formatDate(item.date)}</div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------- JUDGING CRITERIA SECTION ---------- */}
        {judging.length > 0 && (
          <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500 mb-4">
                Judging Criteria
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                How submissions will be evaluated by our panel of judges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {judging.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-purple-500/50 transition-all group text-left"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    {item.weight && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        Weight: {item.weight}%
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {item.description || "Submissions will be assessed based on their execution, practicality, and relevance in this area."}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- FAQ ---------- */}
        {faq.length > 0 && (
          <section className="relative z-10 py-24 bg-gray-50/50 dark:bg-[#0A0A12]/85 border-y border-gray-200 dark:border-white/5">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                <MessageCircle className="text-indigo-500 w-8 h-8" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4 text-left">
                {faq.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-2xl bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 hover:border-purple-300 transition-colors"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{item.question}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">{item.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------- PRIZES ---------- */}
        {prizes.length > 0 && (
          <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black flex justify-center items-center text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600 mb-4">
                Glory & Rewards
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                Prizes and rewards for outstanding participants.
              </p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${prizes.length === 1 ? "lg:grid-cols-1 max-w-md" : prizes.length === 2 ? "lg:grid-cols-2 max-w-3xl" : "lg:grid-cols-3 max-w-5xl"} gap-8 mx-auto justify-center`}>
              {prizes.map((p, i) => {
                const colors = [
                  "from-amber-400 to-yellow-600",
                  "from-slate-300 to-slate-500",
                  "from-orange-400 to-amber-700",
                  "from-rose-400 to-red-600",
                  "from-green-400 to-lime-600",
                  "from-purple-400 to-violet-600",
                ];
                const color = colors[i % colors.length];
                const emojis = ["🏆", "🥈", "🥉", "🔥", "🏅", "👥"];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`relative p-[1px] rounded-3xl bg-gradient-to-b ${color} shadow-xl`}
                  >
                    <div className="h-full bg-white dark:bg-[#0A0A12] rounded-[23px] p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      <div className="text-6xl mb-6 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                        {emojis[i % emojis.length]}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 dark:text-white text-gray-900">{p.title}</h3>
                      <p className="text-xl font-extrabold text-amber-500 dark:text-amber-400 mb-2">
                        {p.amount && p.amount !== "0" ? `₹${Number(p.amount).toLocaleString("en-IN")}` : "Glory & Certificate"}
                      </p>
                      {p.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                          {p.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------- REGISTRATION FORM ---------- */}
        <section id="register-section" className="relative z-20 py-24 bg-slate-950 dark:bg-black text-white border-t border-white/10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]">
                Secure Your Spot
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">
                Fill in the details below to join {basic.title}.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <RegistrationForm
                eventId={eventId}
                dynamicFields={registrationFields}
                className="shadow-[0_0_100px_rgba(139,92,246,0.15)]"
              />
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}