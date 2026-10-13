// src/pages/SGS Hackthone/DynamicEventPage.jsx
// UI-UX Pro Max: Futuristic Cyberpunk + OLED Glassmorphism | Space Grotesk + DM Sans
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/layout/Layout";
import {
  Lightbulb, Users, CalendarDays, Award, ChevronDown, CheckCircle2, Clock,
  MapPin, BookOpen, MessageCircle, Star, Zap, Trophy, Target, Globe, ChevronUp,
  Shield, Tag, Share2, Rocket, ExternalLink, Calendar, Copy, Check, X,
  Building, ArrowRight, Info, AlertTriangle, Sparkles, HelpCircle, Phone, Mail
} from "lucide-react";
import RegistrationForm from "./RegistrationForm";
import { QRCodeSVG } from "qrcode.react";

const EMPTY_EVENT = {
  basic: {
    title: "", tagline: "", shortDescription: "", longDescription: "", coverImage: "",
    mode: "ONLINE", location: "", registrationOpen: "", registrationClose: "",
    eventStart: "", eventEnd: "", entryFee: 0, certificate: true, type: "HACKATHON",
    organizer: "Soft Game Studio", website: ""
  },
  team: { allowSolo: true, allowTeam: true, minSize: 1, maxSize: 4, maxTeams: 100 },
  problemStatements: [],
  timeline: [],
  judging: [],
  faq: [],
  prizes: [],
  registrationFields: [],
};

const normEvent = (data) => {
  if (!data) return EMPTY_EVENT;
  const b = {
    title:             data.title             || data.basic?.title             || "SGS Arena Challenge",
    tagline:           data.tagline           || data.basic?.tagline           || "",
    shortDescription:  data.shortDescription  || data.basic?.shortDescription  || "",
    longDescription:   data.longDescription   || data.basic?.longDescription   || "",
    coverImage:        data.coverImage        || data.basic?.coverImage        || "",
    mode:              data.mode              || data.basic?.mode              || "ONLINE",
    location:          data.location          || data.basic?.location          || "",
    registrationOpen:  data.registrationOpen  || data.basic?.registrationOpen  || "",
    registrationClose: data.registrationClose || data.basic?.registrationClose || "",
    eventStart:        data.eventStart        || data.basic?.eventStart        || "",
    eventEnd:          data.eventEnd          || data.basic?.eventEnd          || "",
    entryFee:   data.entryFee  !== undefined ? data.entryFee  : (data.basic?.entryFee  !== undefined ? data.basic.entryFee  : 0),
    certificate:data.certificate!== undefined ? data.certificate:(data.basic?.certificate!== undefined ? data.basic.certificate: true),
    type:       data.type       || data.basic?.type       || "HACKATHON",
    organizer:  data.organizer  || data.basic?.organizer  || "Soft Game Studio",
    website:    data.website    || data.basic?.website    || "",
  };
  const t = {
    allowSolo: data.team?.allowSolo !== undefined ? data.team.allowSolo : true,
    allowTeam: data.team?.allowTeam !== undefined ? data.team.allowTeam : true,
    minSize:   data.team?.minSize   !== undefined ? data.team.minSize   : 1,
    maxSize:   data.team?.maxSize   !== undefined ? data.team.maxSize   : 4,
    maxTeams:  data.team?.maxTeams  !== undefined ? data.team.maxTeams  : 100,
  };
  return {
    ...data,
    basic: b,
    team: t,
    problemStatements: data.problemStatements || [],
    timeline: data.timeline || [],
    judging: data.judging || [],
    faq: data.faq || [],
    prizes: data.prizes || [],
    registrationFields: data.registrationFields || []
  };
};

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "TBA";
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

/* ─── High-tech FAQ Accordion item ─── */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d0e1d]/80 text-left transition-all duration-300 hover:border-violet-500/40"
    >
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-white/[0.02] transition-colors"
      >
        <span className="font-bold text-white text-sm sm:text-base leading-snug">{q}</span>
        <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
          open ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400"
        }`}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-slate-300 text-sm leading-relaxed border-t border-white/5 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DynamicEventPage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(EMPTY_EVENT);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  // Real-time ticking Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: false });

  // Scroll detection for sticky navigation bar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);

      // Section highlight
      const sections = ["about", "problems", "timeline", "prizes", "rules", "judging", "faq", "register-section"];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch event document
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(fireDB, "events", eventId));
        if (snap.exists()) {
          setEvent(normEvent({ id: snap.id, ...snap.data() }));
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  // Live countdown clock ticker
  useEffect(() => {
    const target = event.basic.registrationClose || event.basic.eventStart;
    if (!target) return;

    const interval = setInterval(() => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, ended: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event.basic.registrationClose, event.basic.eventStart]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCalendarUrl = () => {
    const title = encodeURIComponent(event.basic.title || "SGS Hackathon");
    const details = encodeURIComponent(event.basic.tagline || event.basic.shortDescription || "Join this premier hackathon hosted on Soft Game Studio.");
    const location = encodeURIComponent(event.basic.location || "Online");
    const start = event.basic.eventStart ? new Date(event.basic.eventStart).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";
    const end = event.basic.eventEnd ? new Date(event.basic.eventEnd).toISOString().replace(/-|:|\.\d\d\d/g, "") : start;
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
  };

  const now = new Date();
  const { registrationOpen: rO, registrationClose: rC, eventStart: eS, eventEnd: eE } = event.basic;
  const isRegOpen = rO && rC && new Date(rO) <= now && new Date(rC) >= now;
  const isConcluded = eE && new Date(eE) < now;

  /* ═══ LOADING STATE ═══ */
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#070711] text-white">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-indigo-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
          </div>
          <span className="text-sm font-mono text-violet-400 tracking-wider">LOADING ARENA DATA...</span>
        </div>
      </Layout>
    );
  }

  /* ═══ NOT FOUND STATE ═══ */
  if (notFound) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#070711] text-white px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-400">
            <AlertTriangle size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Challenge Not Found</h1>
          <p className="text-slate-400 max-w-md mb-8">
            The event arena you are seeking may have been removed or the URL is incorrect.
          </p>
          <button
            onClick={() => navigate("/event")}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-violet-600/30 hover:brightness-110 transition-all flex items-center gap-2"
          >
            Browse All Arenas <ArrowRight size={16} />
          </button>
        </div>
      </Layout>
    );
  }

  const { basic, team, problemStatements, timeline, judging, faq, prizes, registrationFields } = event;

  return (
    <Layout>
      {/* ── Custom Styling ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;600;700&display=swap');
        .ev-detail * { font-family: 'DM Sans', system-ui, sans-serif; }
        .ev-detail h1, .ev-detail h2, .ev-detail h3, .ev-detail h4, .ev-detail .font-heading { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ev-detail .font-mono { font-family: 'Fira Code', monospace; }

        @keyframes auroraFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(25px, -20px) scale(1.06); }
        }
        @keyframes shimmerText {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .aurora-orb { animation: auroraFloat 16s ease-in-out infinite; }
        .shimmer-gradient {
          background: linear-gradient(90deg, #c084fc, #818cf8, #60a5fa, #c084fc);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 5s linear infinite;
        }
        .glass-card {
          backdrop-filter: blur(20px) saturate(180%);
          background: rgba(13, 14, 28, 0.7);
        }
      `}</style>

      <div className="ev-detail min-h-screen bg-[#070711] text-slate-100 relative overflow-hidden selection:bg-violet-500/30 selection:text-white">

        {/* ── Ambient Background Lighting ── */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="aurora-orb absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-violet-600/15 blur-[150px]" />
          <div className="aurora-orb absolute top-1/3 -right-32 w-[700px] h-[700px] rounded-full bg-indigo-600/12 blur-[140px]" style={{ animationDelay: "-6s" }} />
          <div className="aurora-orb absolute -bottom-32 left-1/3 w-[850px] h-[550px] rounded-full bg-purple-600/10 blur-[160px]" style={{ animationDelay: "-10s" }} />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />
        </div>

        {/* ═══════════════════════════════════════════
            STICKY FLOATING TOP NAVBAR (Scroll-triggered)
        ═══════════════════════════════════════════ */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ y: -70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -70, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 z-50 bg-[#080914]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${isRegOpen ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                  <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">{basic.title}</h3>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase">
                    {basic.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!timeLeft.ended && (
                    <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-300 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                      <Clock size={13} className="text-violet-400" />
                      <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left</span>
                    </div>
                  )}

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 size={14} />
                  </button>

                  <button
                    onClick={() => scrollToSection("register-section")}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5"
                  >
                    Register <Rocket size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/event" className="hover:text-white transition-colors">Arenas</Link>
            <span>/</span>
            <span className="text-violet-400 uppercase font-semibold">{basic.type}</span>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-xs">{basic.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Title, Metadata, Countdown & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Status & Category Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${
                  isRegOpen
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : isConcluded
                    ? "bg-slate-500/10 border-slate-500/30 text-slate-400"
                    : "bg-violet-500/10 border-violet-500/30 text-violet-400"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isRegOpen ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
                  {isRegOpen ? "Registrations Open" : isConcluded ? "Concluded" : "Registrations Closed"}
                </span>

                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-600/20 text-violet-300 border border-violet-500/30 font-mono">
                  {basic.type}
                </span>

                {basic.certificate && (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/[0.04] text-slate-300 border border-white/10 flex items-center gap-1.5">
                    <Award size={13} className="text-amber-400" /> Certificate Included
                  </span>
                )}
              </div>

              {/* Event Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.08] tracking-tight">
                <span className="shimmer-gradient">{basic.title}</span>
              </h1>

              {/* Tagline / Short Description */}
              {(basic.tagline || basic.shortDescription) && (
                <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
                  {basic.tagline || basic.shortDescription}
                </p>
              )}

              {/* ── REAL-TIME COUNTDOWN TIMER CLOCK ── */}
              {!timeLeft.ended && (
                <div className="pt-2">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <Clock size={13} className="text-violet-400" /> Registration Closes In
                  </span>
                  <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md">
                    {[
                      { label: "DAYS", value: timeLeft.days },
                      { label: "HOURS", value: timeLeft.hours },
                      { label: "MINS", value: timeLeft.minutes },
                      { label: "SECS", value: timeLeft.seconds }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center glass-card shadow-lg">
                        <span className="block text-2xl sm:text-3xl font-black font-mono text-white tracking-wider">
                          {String(item.value).padStart(2, "0")}
                        </span>
                        <span className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Badges */}
              <div className="flex flex-wrap gap-3 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <MapPin size={15} className="text-violet-400 shrink-0" />
                  <span>{basic.mode} {basic.location && `· ${basic.location}`}</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <Calendar size={15} className="text-indigo-400 shrink-0" />
                  <span>{fmt(basic.eventStart)} {basic.eventEnd && `– ${fmt(basic.eventEnd)}`}</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <Tag size={15} className="text-emerald-400 shrink-0" />
                  <span className={`font-semibold ${basic.entryFee === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    {basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <Users size={15} className="text-blue-400 shrink-0" />
                  <span>
                    {team.allowSolo && team.allowTeam ? `Solo or Team (${team.minSize}–${team.maxSize})` : team.allowSolo ? "Solo Only" : `Team (${team.minSize}–${team.maxSize})`}
                  </span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => scrollToSection("register-section")}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-base shadow-2xl shadow-violet-600/35 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
                >
                  Register For Arena <Rocket size={18} />
                </button>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-white border border-white/15 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Share2 size={16} /> Share Arena
                </button>

                <a
                  href={getCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-sm font-semibold transition-all flex items-center gap-2"
                  title="Add to Google Calendar"
                >
                  <CalendarDays size={16} /> Add to Calendar
                </a>

                {basic.website && (
                  <a
                    href={basic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    <Globe size={16} /> Official Website <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Holographic 3D-styled Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-md rounded-3xl p-[1px] bg-gradient-to-br from-violet-600/40 via-indigo-500/20 to-transparent shadow-2xl shadow-violet-950/40"
              >
                <div className="bg-[#0b0c1b] rounded-[23px] overflow-hidden p-3 relative group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-black/60">
                    {basic.coverImage ? (
                      <img
                        src={basic.coverImage}
                        alt={basic.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-900/40 via-indigo-950 to-black flex flex-col items-center justify-center p-6 text-center">
                        <Trophy size={54} className="text-violet-400 mb-3 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]" />
                        <span className="text-base font-bold text-white uppercase tracking-widest">{basic.type}</span>
                        <span className="text-xs text-slate-400 mt-1">{basic.organizer}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-mono text-violet-300 font-semibold flex items-center gap-1.5">
                          <Shield size={14} className="text-emerald-400" /> SGS Verified Challenge
                        </span>
                        <span className="text-xs font-bold text-amber-400">
                          {basic.entryFee === 0 ? "Free Participation" : `₹${basic.entryFee}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bar under image */}
                  <div className="p-4 grid grid-cols-2 gap-3 text-left">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="block text-[11px] text-slate-400 uppercase font-semibold">Organized By</span>
                      <span className="text-xs font-bold text-white truncate block mt-0.5">{basic.organizer}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="block text-[11px] text-slate-400 uppercase font-semibold">Team Size</span>
                      <span className="text-xs font-bold text-white block mt-0.5">{team.minSize} – {team.maxSize} Members</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            IN-PAGE ANCHOR NAVIGATION TABS BAR
        ═══════════════════════════════════════════ */}
        <div className="sticky top-0 z-30 bg-[#070711]/90 backdrop-blur-xl border-y border-white/10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
            {[
              { id: "about", label: "About & Highlights", show: true },
              { id: "problems", label: "Problem Tracks", show: problemStatements.length > 0 },
              { id: "timeline", label: "Timeline", show: timeline.length > 0 },
              { id: "prizes", label: "Prizes & Rewards", show: prizes.length > 0 },
              { id: "rules", label: "Rules & Eligibility", show: true },
              { id: "judging", label: "Judging Criteria", show: judging.length > 0 },
              { id: "faq", label: "FAQ", show: faq.length > 0 },
              { id: "register-section", label: "Register", show: true }
            ].filter(t => t.show).map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeSection === tab.id
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            SECTION: ABOUT & EVENT HIGHLIGHTS BENTO
        ═══════════════════════════════════════════ */}
        <section id="about" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Long description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-bold tracking-widest uppercase">
                <BookOpen size={12} /> Overview
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                About the Challenge
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300 text-base leading-relaxed space-y-4 whitespace-pre-line">
                {basic.longDescription || basic.shortDescription || "Welcome to the official challenge arena. Prepare your ideas, team up, and build impactful solutions."}
              </div>
            </div>

            {/* Highlights Bento Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 glass-card space-y-2">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-2">
                  <Trophy size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">Prestigious Prizes</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cash rewards, certificates of excellence, and verified Soft Game Studio credentials.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 glass-card space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2">
                  <Users size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">Collaboration</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compete individually or assemble a dream team of up to {team.maxSize} developers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 glass-card space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2">
                  <Sparkles size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">Mentorship &amp; Review</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Get evaluated by seasoned industry engineers and receive constructive project feedback.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 glass-card space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-2">
                  <Rocket size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">Career Opportunities</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Outstanding performers gain interview opportunities and direct project showcase features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION: PROBLEM STATEMENTS & TRACKS
        ═══════════════════════════════════════════ */}
        {problemStatements.length > 0 && (
          <section id="problems" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 text-left">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-bold tracking-widest uppercase">
                <Target size={12} /> Innovation Tracks
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Problem Statements
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Choose your track, innovate without boundaries, and construct future-proof solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problemStatements.map((track, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-3xl bg-[#0c0d1b] border border-white/10 p-6 flex flex-col justify-between space-y-4 hover:border-violet-500/50 transition-all duration-300 shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30">
                        {track.track || `Track 0${idx + 1}`}
                      </span>
                      <Target size={18} className="text-violet-400" />
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                      {track.name}
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                      {track.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Deliverable: Working Prototype</span>
                    <span className="text-violet-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Details <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            SECTION: EVENT TIMELINE & ROADMAP
        ═══════════════════════════════════════════ */}
        {timeline.length > 0 && (
          <section id="timeline" className="relative py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/10 text-left">
            <div className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold tracking-widest uppercase">
                <CalendarDays size={12} /> Schedule
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Challenge Roadmap
              </h2>
              <p className="text-slate-400 text-sm">
                Mark your calendar. Follow each milestone from kickoff to grand finale.
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-violet-500/30 space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative group"
                >
                  {/* Glowing Node Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#070711] border-2 border-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/40 transition-all space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
                        {fmt(item.date)} {item.time && `· ${item.time}`}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-slate-400">
                        Phase {i + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            SECTION: PRIZES & REWARDS PODIUM
        ═══════════════════════════════════════════ */}
        {prizes.length > 0 && (
          <section id="prizes" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 text-left">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold tracking-widest uppercase">
                <Trophy size={12} /> Recognition
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Prizes &amp; Glory
              </h2>
              <p className="text-slate-400 text-sm">
                Celebrated achievements, cash grants, and career-accelerating opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {prizes.map((p, i) => {
                const isFirst = i === 0;
                const isSecond = i === 1;
                const isThird = i === 2;

                const borderGrad = isFirst
                  ? "from-amber-400 via-yellow-500 to-amber-600"
                  : isSecond
                  ? "from-slate-200 via-zinc-400 to-slate-500"
                  : isThird
                  ? "from-amber-600 via-orange-600 to-amber-800"
                  : "from-violet-500 to-indigo-600";

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className={`relative p-[1px] rounded-3xl bg-gradient-to-b ${borderGrad} shadow-2xl`}
                  >
                    <div className="h-full bg-[#0d0e1d] rounded-[23px] p-8 text-center flex flex-col items-center justify-between relative overflow-hidden">
                      <div className="space-y-4 w-full">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                          {isFirst ? "🥇" : isSecond ? "🥈" : isThird ? "🥉" : "🏆"}
                        </div>

                        <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                          {p.title || `Rank 0${i + 1}`}
                        </span>

                        <div className="text-3xl font-black text-white font-mono">
                          {p.amount && p.amount !== "0"
                            ? `₹${Number(p.amount).toLocaleString("en-IN")}`
                            : "Excellence Grant"}
                        </div>

                        {p.description && (
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {p.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-6 mt-6 border-t border-white/10 w-full space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2 justify-center">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span>Official SGS Trophy &amp; Certificate</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span>Direct Portfolio Feature</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            SECTION: RULES & PARTICIPATION GUIDELINES
        ═══════════════════════════════════════════ */}
        <section id="rules" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-bold tracking-widest uppercase">
              <Shield size={12} /> Compliance
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Rules &amp; Guidelines
            </h2>
            <p className="text-slate-400 text-sm">
              Standard competition policies to ensure a fair and inspiring environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0c0d1b] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">1</div>
              <h3 className="text-base font-bold text-white">Eligibility &amp; Teams</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open to developers, students, and engineers worldwide. Team sizes must comply with the specified minimum ({team.minSize}) and maximum ({team.maxSize}) participant limits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0d1b] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">2</div>
              <h3 className="text-base font-bold text-white">Fresh &amp; Original Code</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All source code and designs must be authored during the active hackathon timeline. Utilizing public open-source libraries and APIs is permitted and encouraged.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0d1b] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">3</div>
              <h3 className="text-base font-bold text-white">Submission Requirements</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Teams must submit a working prototype URL, public GitHub code repository, and a concise walkthrough demonstration video before the designated deadline.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION: JUDGING CRITERIA
        ═══════════════════════════════════════════ */}
        {judging.length > 0 && (
          <section id="judging" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 text-left">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-widest uppercase">
                <Lightbulb size={12} /> Scoring
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Judging Criteria
              </h2>
              <p className="text-slate-400 text-sm">
                Transparent rubric utilized by our industry panel to evaluate submissions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {judging.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-violet-400 uppercase">Weightage</span>
                      {item.weight && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30">
                          {item.weight}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description || "Evaluated for execution, depth, practicality, and real-world viability."}
                    </p>
                  </div>

                  {item.weight && (
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full" style={{ width: `${item.weight}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            SECTION: FAQS & CONTACT
        ═══════════════════════════════════════════ */}
        {faq.length > 0 && (
          <section id="faq" className="relative py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/10 text-left">
            <div className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold tracking-widest uppercase">
                <HelpCircle size={12} /> Answers
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-400 text-sm">
                Everything you need to know before stepping into the arena.
              </p>
            </div>

            <div className="space-y-3">
              {faq.map((item, idx) => (
                <FaqItem key={idx} q={item.question} a={item.answer} index={idx} />
              ))}
            </div>

            {/* Support / Help card */}
            <div className="mt-10 p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h4 className="text-sm font-bold text-white">Have more questions?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Our support coordinators are ready to help you.</p>
              </div>
              <a
                href="mailto:support@softgamestudio.com"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition-all flex items-center gap-2 shrink-0"
              >
                <Mail size={14} /> Contact Coordinators
              </a>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            SECTION: REGISTRATION PORTAL
        ═══════════════════════════════════════════ */}
        <section id="register-section" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="relative z-10 text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-widest uppercase">
              <Rocket size={13} className="fill-current" /> Registration Terminal
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Secure Your Arena Entry Pass
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Enroll your team or compete solo in <span className="text-violet-400 font-semibold">{basic.title}</span>.
            </p>
          </div>

          <RegistrationForm
            eventId={eventId}
            eventTitle={basic.title}
            dynamicFields={registrationFields}
            onClose={() => scrollToSection("about")}
          />
        </section>

        {/* ═══════════════════════════════════════════
            SHARE & QR MODAL
        ═══════════════════════════════════════════ */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-[#0c0d1b] border border-white/15 rounded-3xl p-6 relative shadow-2xl text-left"
              >
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>

                <h3 className="text-xl font-bold text-white mb-1">Share this Arena</h3>
                <p className="text-xs text-slate-400 mb-6">Invite your teammates and friends to join this challenge.</p>

                {/* QR Code Container */}
                <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center mb-6 shadow-inner">
                  <QRCodeSVG value={window.location.href} size={150} level="M" />
                  <span className="text-[11px] font-mono font-bold text-slate-800 mt-2">Scan to Open on Mobile</span>
                </div>

                {/* Copy Link Input */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 mb-6">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="bg-transparent border-0 text-xs text-slate-300 px-2 flex-1 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                {/* Social Share Shortcuts */}
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${basic.title} on Soft Game Studio: ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-center text-xs font-semibold text-slate-200 transition-all block"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me at ${basic.title} on Soft Game Studio! ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-center text-xs font-semibold text-slate-200 transition-all block"
                  >
                    Twitter / X
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-center text-xs font-semibold text-slate-200 transition-all block"
                  >
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
