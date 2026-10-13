// src/pages/SGS Hackthone/EventsListing.jsx
// UI-UX Pro Max: Futuristic Cyberpunk + OLED Glassmorphism | Space Grotesk + DM Sans
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../../components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Calendar, MapPin, Clock, Users, Tag, ExternalLink,
  Sparkles, TrendingUp, Award, Code, Trophy, Briefcase, Zap, Globe,
  Star, Filter, X, ChevronDown, ArrowRight, Flame, Target, Share2,
  CheckCircle2, LayoutGrid, ListFilter, Copy, Check, Rocket, Building
} from "lucide-react";

/* ─── Type configuration with high-tech gradients and glows ─── */
const TYPE_CONFIG = {
  HACKATHON:   { grad: "from-violet-600 via-purple-600 to-indigo-600", glow: "shadow-violet-600/30", dot: "bg-violet-400", border: "border-violet-500/40", icon: Code, label: "Hackathon" },
  COMPETITION: { grad: "from-rose-500 via-pink-600 to-amber-600",     glow: "shadow-rose-500/30",   dot: "bg-rose-400",   border: "border-rose-500/40",   icon: Trophy, label: "Competition" },
  WORKSHOP:    { grad: "from-emerald-500 via-teal-600 to-cyan-600",    glow: "shadow-emerald-500/30",dot: "bg-emerald-400",border: "border-emerald-500/40",icon: Target, label: "Workshop" },
  SEMINAR:     { grad: "from-amber-500 via-orange-600 to-red-600",     glow: "shadow-amber-500/30",  dot: "bg-amber-400",  border: "border-amber-500/40",  icon: Star, label: "Seminar" },
  WEBINAR:     { grad: "from-blue-500 via-indigo-600 to-cyan-600",     glow: "shadow-blue-500/30",   dot: "bg-blue-400",   border: "border-blue-500/40",   icon: Globe, label: "Webinar" },
  BOOTCAMP:    { grad: "from-red-500 via-rose-600 to-orange-600",      glow: "shadow-red-500/30",    dot: "bg-red-400",    border: "border-red-500/40",    icon: Flame, label: "Bootcamp" },
  MEETUP:      { grad: "from-sky-500 via-cyan-600 to-blue-600",       glow: "shadow-sky-500/30",    dot: "bg-sky-400",    border: "border-sky-500/40",    icon: Users, label: "Meetup" },
  CONFERENCE:  { grad: "from-indigo-600 via-violet-600 to-purple-600", glow: "shadow-indigo-500/30", dot: "bg-indigo-400", border: "border-indigo-500/40", icon: Briefcase, label: "Conference" },
  SUMMIT:      { grad: "from-slate-700 via-zinc-800 to-neutral-900",   glow: "shadow-slate-500/30",  dot: "bg-slate-400",  border: "border-slate-500/40",  icon: Award, label: "Summit" },
  DEFAULT:     { grad: "from-purple-600 via-indigo-600 to-violet-700", glow: "shadow-purple-500/30", dot: "bg-purple-400", border: "border-purple-500/40", icon: Sparkles, label: "Event" },
};

const CATEGORIES = [
  { id: "ALL", label: "All Arenas", icon: Sparkles },
  { id: "HACKATHON", label: "Hackathons", icon: Code },
  { id: "COMPETITION", label: "Competitions", icon: Trophy },
  { id: "WORKSHOP", label: "Workshops", icon: Target },
  { id: "BOOTCAMP", label: "Bootcamps", icon: Flame },
  { id: "WEBINAR", label: "Webinars", icon: Globe },
  { id: "MEETUP", label: "Meetups", icon: Users },
];

/* ─── Normalise firestore schema ─── */
const normalizeEvent = (data) => {
  if (!data) return {};
  const basic = {
    title:             data.title             || data.basic?.title             || "",
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
  return {
    ...data,
    basic,
    tags: data.tags || [],
    prizes: data.prizes || [],
    timeline: data.timeline || [],
    featured: data.featured || false
  };
};

/* ─── Helpers ─── */
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "TBA";

const getStatus = (ev) => {
  const now = new Date();
  const { registrationOpen: o, registrationClose: c, eventStart: s, eventEnd: e } = ev.basic || {};
  if (e && new Date(e) < now) return { label: "Concluded", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", pulse: false };
  if (o && c && new Date(o) <= now && new Date(c) >= now) return { label: "Registrations Open", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", pulse: true };
  if (s && new Date(s) > now) return { label: "Upcoming", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30", pulse: true };
  if (s && new Date(s) <= now && (!e || new Date(e) >= now)) return { label: "Live Now", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", pulse: true };
  return { label: "Registration Closed", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", pulse: false };
};

const getCountdown = (targetDate) => {
  if (!targetDate) return null;
  const ms = new Date(targetDate).getTime() - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hrs}h left`;
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hrs}h ${mins}m left`;
};

const IN = "w-full px-4 py-3 rounded-xl bg-slate-900/60 dark:bg-black/60 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm font-medium";

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export default function EventsListing() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [filterMode, setFilterMode] = useState("ALL");
  const [quickStatus, setQuickStatus] = useState("ALL");
  const [sort, setSort] = useState("soonest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [copiedId, setCopiedId] = useState(null);

  /* Fetch live Firestore events */
  useEffect(() => {
    const q = query(collection(fireDB, "events"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => normalizeEvent({ id: doc.id, ...doc.data() }));
      setEvents(list);
      setLoading(false);
    }, (err) => {
      console.error("Firestore read error:", err);
      setLoading(false);
    });
  }, []);

  /* Filter and Sort */
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const b = ev.basic || {};
      const q = search.toLowerCase().trim();
      const matchesSearch = !q ||
        (b.title || "").toLowerCase().includes(q) ||
        (b.tagline || "").toLowerCase().includes(q) ||
        (b.organizer || "").toLowerCase().includes(q) ||
        (b.location || "").toLowerCase().includes(q) ||
        (ev.tags || []).some(t => t.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === "ALL" || b.type?.toUpperCase() === selectedCategory;
      const matchesMode = filterMode === "ALL" || b.mode?.toUpperCase() === filterMode;

      const status = getStatus(ev);
      let matchesStatus = true;
      if (quickStatus === "OPEN") matchesStatus = status.label === "Registrations Open";
      else if (quickStatus === "UPCOMING") matchesStatus = status.label === "Upcoming" || status.label === "Live Now";
      else if (quickStatus === "FREE") matchesStatus = b.entryFee === 0;

      return matchesSearch && matchesCategory && matchesMode && matchesStatus;
    }).sort((a, b) => {
      const da = new Date(a.basic.eventStart || 0).getTime();
      const db = new Date(b.basic.eventStart || 0).getTime();
      const now = Date.now();

      if (sort === "soonest") {
        if (da > now && db <= now) return -1;
        if (da <= now && db > now) return 1;
        return da - db;
      }
      if (sort === "closing") {
        const ca = new Date(a.basic.registrationClose || 0).getTime();
        const cb = new Date(b.basic.registrationClose || 0).getTime();
        return ca - cb;
      }
      if (sort === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sort === "prize") {
        const pa = (a.prizes || []).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
        const pb = (b.prizes || []).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
        return pb - pa;
      }
      return 0;
    });
  }, [events, search, selectedCategory, filterMode, quickStatus, sort]);

  /* Spotlight Event (Featured or Next Upcoming) */
  const spotlightEvent = useMemo(() => {
    return events.find(e => e.featured) || events.find(e => getStatus(e).label === "Registrations Open") || events[0];
  }, [events]);

  const handleShare = (e, eventId) => {
    e.stopPropagation();
    const url = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openCount = events.filter(e => getStatus(e).label === "Registrations Open").length;
  const upcomingCount = events.filter(e => getStatus(e).label === "Upcoming").length;

  return (
    <Layout>
      {/* ── Custom Styling & Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;600&display=swap');
        .ev-hub * { font-family: 'DM Sans', system-ui, sans-serif; }
        .ev-hub h1, .ev-hub h2, .ev-hub h3, .ev-hub h4, .ev-hub .font-heading { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ev-hub .font-mono { font-family: 'Fira Code', monospace; }

        @keyframes auroraFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes shimmerText {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes borderPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        .aurora-orb { animation: auroraFloat 16s ease-in-out infinite; }
        .shimmer-gradient {
          background: linear-gradient(90deg, #c084fc, #818cf8, #60a5fa, #c084fc);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 5s linear infinite;
        }
        .glass-panel {
          backdrop-filter: blur(20px) saturate(180%);
          background: rgba(12, 13, 26, 0.75);
        }
        .card-ambient:hover {
          box-shadow: 0 10px 40px -10px rgba(124, 58, 237, 0.35), 0 0 20px -5px rgba(99, 102, 241, 0.2);
        }
      `}</style>

      <div className="ev-hub min-h-screen bg-[#070711] text-slate-100 relative overflow-hidden selection:bg-violet-500/30 selection:text-white">

        {/* ── Ambient Background Lighting ── */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="aurora-orb absolute -top-40 -left-40 w-[750px] h-[750px] rounded-full bg-violet-600/15 blur-[140px]" />
          <div className="aurora-orb absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full bg-indigo-600/12 blur-[130px]" style={{ animationDelay: "-6s" }} />
          <div className="aurora-orb absolute -bottom-32 left-1/4 w-[850px] h-[550px] rounded-full bg-purple-600/10 blur-[160px]" style={{ animationDelay: "-10s" }} />
          {/* subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
        </div>

        {/* ═══════════════════════════════════════════
            HERO HEADER
        ═══════════════════════════════════════════ */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            {/* Tagline Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold tracking-widest uppercase shadow-lg shadow-violet-500/10"
            >
              <Zap size={13} className="text-violet-400 fill-violet-400 animate-pulse" />
              SGS Hackathons &amp; Arenas
              <Sparkles size={13} className="text-violet-400" />
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
              Where Builders Compete, <br />
              <span className="shimmer-gradient">Innovate &amp; Conquer.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Step into premier national hackathons, coding showdowns, and immersive developer bootcamps. Prove your craft and unlock real opportunities.
            </p>

            {/* Live Metrics Counter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
            >
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 glass-panel">
                <Flame size={18} className="text-rose-400 animate-bounce" />
                <div className="text-left">
                  <span className="block text-xs text-slate-400 font-medium">Registrations Open</span>
                  <span className="text-sm font-bold text-white font-mono">{openCount} Active</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 glass-panel">
                <Calendar size={18} className="text-violet-400" />
                <div className="text-left">
                  <span className="block text-xs text-slate-400 font-medium">Upcoming Arenas</span>
                  <span className="text-sm font-bold text-white font-mono">{upcomingCount} Scheduled</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 glass-panel">
                <Trophy size={18} className="text-amber-400" />
                <div className="text-left">
                  <span className="block text-xs text-slate-400 font-medium">Cash Prizes &amp; Perks</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">₹5,00,000+ Pool</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 glass-panel">
                <Award size={18} className="text-emerald-400" />
                <div className="text-left">
                  <span className="block text-xs text-slate-400 font-medium">Verified Credentials</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">100% Certified</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ═══════════════════════════════════════════
              FEATURED SPOTLIGHT HERO BANNER
          ═══════════════════════════════════════════ */}
          {!loading && spotlightEvent && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-14 relative"
            >
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-violet-600 via-indigo-500 to-rose-500 shadow-2xl shadow-violet-950/40">
                <div className="bg-[#0b0c19] rounded-[23px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-10 relative">
                  {/* Decorative background grid inside spotlight */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6 relative z-10 text-left">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
                          <Rocket size={13} className="text-violet-400" /> Featured Arena
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {spotlightEvent.basic.mode || "ONLINE"}
                        </span>
                        {getCountdown(spotlightEvent.basic.registrationClose) && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            Closing in {getCountdown(spotlightEvent.basic.registrationClose)}
                          </span>
                        )}
                      </div>

                      <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                        {spotlightEvent.basic.title}
                      </h2>

                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-xl">
                        {spotlightEvent.basic.tagline || spotlightEvent.basic.shortDescription || "Join this premier hackathon and compete with exceptional minds."}
                      </p>
                    </div>

                    {/* Quick Metadata Row */}
                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-violet-400" />
                        <span>{fmt(spotlightEvent.basic.eventStart)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-emerald-400" />
                        <span className="font-semibold text-emerald-400">
                          {spotlightEvent.basic.entryFee === 0 ? "Free Entry" : `₹${spotlightEvent.basic.entryFee}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-slate-400" />
                        <span>{spotlightEvent.basic.organizer}</span>
                      </div>
                    </div>

                    {/* Call to Action buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={() => navigate(`/event/${spotlightEvent.id}`)}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                      >
                        Enter Arena Now <ArrowRight size={16} />
                      </button>

                      <button
                        onClick={(e) => handleShare(e, spotlightEvent.id)}
                        className="px-5 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-white border border-white/15 font-semibold text-sm transition-all flex items-center gap-2"
                      >
                        {copiedId === spotlightEvent.id ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                        {copiedId === spotlightEvent.id ? "Link Copied!" : "Share"}
                      </button>
                    </div>
                  </div>

                  {/* Spotlight Image / Graphic */}
                  <div className="lg:col-span-5 flex items-center justify-center relative z-10">
                    <div className="w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-black/40 relative group shadow-2xl">
                      {spotlightEvent.basic.coverImage ? (
                        <img
                          src={spotlightEvent.basic.coverImage}
                          alt={spotlightEvent.basic.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-900/40 via-indigo-950 to-black flex flex-col items-center justify-center p-6 text-center">
                          <Code size={48} className="text-violet-400 mb-3 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
                          <span className="text-sm font-bold text-white uppercase tracking-widest">SGS CODE CHALLENGE</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                        <span className="text-xs font-mono text-violet-300 font-semibold">
                          # {spotlightEvent.basic.type || "HACKATHON"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* ═══════════════════════════════════════════
            CATEGORIES BAR
        ═══════════════════════════════════════════ */}
        <section className="relative px-4 sm:px-6 max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(({ id, label, icon: CatIcon }) => {
              const isActive = selectedCategory === id;
              const count = id === "ALL" ? events.length : events.filter(e => e.basic.type?.toUpperCase() === id).length;

              return (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
                    isActive
                      ? "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/30 scale-[1.02]"
                      : "bg-white/[0.03] text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <CatIcon size={15} className={isActive ? "text-white" : "text-violet-400"} />
                  {label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SEARCH & FILTER COMMAND BAR
        ═══════════════════════════════════════════ */}
        <section className="relative px-4 sm:px-6 max-w-7xl mx-auto mb-10">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 glass-panel shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search challenges, technologies, organizers (#Web3, #AI, #GameDev)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={`${IN} pl-10 pr-9`}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Mode Select */}
              <div className="relative min-w-[140px]">
                <select
                  value={filterMode}
                  onChange={e => setFilterMode(e.target.value)}
                  className={`${IN} pr-9 appearance-none bg-[#0a0b16]`}
                >
                  <option value="ALL">All Modes</option>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">In-Person</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Quick Status Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                {[
                  { id: "ALL", label: "All Status" },
                  { id: "OPEN", label: "Open Now" },
                  { id: "UPCOMING", label: "Upcoming" },
                  { id: "FREE", label: "Free Entry" }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setQuickStatus(item.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      quickStatus === item.id
                        ? "bg-violet-600/30 text-violet-300 border-violet-500/60"
                        : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative min-w-[150px]">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className={`${IN} pr-9 appearance-none bg-[#0a0b16]`}
                >
                  <option value="soonest">Starting Soon</option>
                  <option value="closing">Closing Soon</option>
                  <option value="newest">Newest Added</option>
                  <option value="prize">Highest Prize</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-black/40 p-1 self-center lg:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
                  title="List View"
                >
                  <ListFilter size={16} />
                </button>
              </div>
            </div>

            {/* Results count & clear filters */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10 text-xs text-slate-400">
              <span>
                Showing <strong className="text-violet-400 font-mono">{filteredEvents.length}</strong> challenge{filteredEvents.length !== 1 ? "s" : ""}
              </span>
              {(search || selectedCategory !== "ALL" || filterMode !== "ALL" || quickStatus !== "ALL") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("ALL");
                    setFilterMode("ALL");
                    setQuickStatus("ALL");
                  }}
                  className="text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            EVENTS LISTING GRID / LIST
        ═══════════════════════════════════════════ */}
        <section className="relative px-4 sm:px-6 max-w-7xl mx-auto pb-24">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 animate-pulse p-4 space-y-4">
                  <div className="h-48 bg-white/5 rounded-2xl" />
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-10 bg-white/5 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-24 text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Arenas Found</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                We couldn't find any challenges matching your search criteria. Try removing some filters or searching for broader terms.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("ALL");
                  setFilterMode("ALL");
                  setQuickStatus("ALL");
                }}
                className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/30"
              >
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((ev, i) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    index={i}
                    viewMode={viewMode}
                    navigate={navigate}
                    onShare={handleShare}
                    copiedId={copiedId}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              HOST AN EVENT / ORGANIZER CTA BANNER
          ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 relative"
          >
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">
              <div className="bg-[#0a0b17] rounded-[23px] px-6 sm:px-12 py-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/30">
                    <Rocket size={13} /> Partner With Soft Game Studio
                  </span>

                  <h3 className="text-3xl sm:text-4xl font-black text-white">
                    Hosting a Hackathon or Challenge?
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    Empower your organization with our comprehensive event infrastructure. Tap into our community of over 50,000+ enthusiastic builders and developers.
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center gap-4">
                    <a
                      href="mailto:contact@softgamestudio.com?subject=Host%20a%20Hackathon%20with%20SGS"
                      className="px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-xl"
                    >
                      Host on SGS Platform
                    </a>
                    <button
                      onClick={() => navigate("/contact")}
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all"
                    >
                      Speak with our Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}

/* ════════════════════════════════════════════════════════════
   EVENT CARD (Wrapped with React.forwardRef for AnimatePresence)
════════════════════════════════════════════════════════════ */
const EventCard = React.forwardRef(({ event, index, viewMode, navigate, onShare, copiedId }, ref) => {
  const basic = event.basic || {};
  const status = getStatus(event);
  const cfg = TYPE_CONFIG[basic.type?.toUpperCase()] || TYPE_CONFIG.DEFAULT;
  const TIcon = cfg.icon;
  const countdownText = getCountdown(basic.registrationClose || basic.eventStart);

  if (viewMode === "list") {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.03 }}
        onClick={() => navigate(`/event/${event.id}`)}
        className="group cursor-pointer rounded-2xl bg-[#0d0e1b]/80 border border-white/10 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 card-ambient hover:border-violet-500/50 transition-all duration-300"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* thumbnail */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10 relative">
            {basic.coverImage ? (
              <img src={basic.coverImage} alt={basic.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${cfg.grad} flex items-center justify-center`}>
                <TIcon size={20} className="text-white/60" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.color} border ${status.border}`}>
                {status.pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                {status.label}
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">{basic.type}</span>
            </div>
            <h4 className="text-base font-bold text-white truncate group-hover:text-violet-400 transition-colors">
              {basic.title}
            </h4>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {basic.tagline || basic.shortDescription || `Organized by ${basic.organizer}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-slate-300 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-violet-400" />
            <span>{fmt(basic.eventStart)}</span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <Tag size={14} />
            <span>{basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee}`}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onShare(e, event.id)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all"
              title="Share event link"
            >
              {copiedId === event.id ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/event/${event.id}`); }}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-md shadow-violet-600/30 flex items-center gap-1"
            >
              Explore <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  /* Grid View */
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/event/${event.id}`)}
      className="group cursor-pointer flex flex-col h-full rounded-3xl overflow-hidden bg-[#0c0d1b] border border-white/10 card-ambient hover:border-violet-500/50 transition-all duration-300 shadow-xl shadow-black/40 text-left"
    >
      {/* Cover Media */}
      <div className="relative h-48 w-full overflow-hidden bg-black/60 shrink-0">
        {basic.coverImage ? (
          <img
            src={basic.coverImage}
            alt={basic.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cfg.grad} flex flex-col items-center justify-center p-4 text-center relative`}>
            <TIcon className="w-14 h-14 text-white/30 mb-1" />
            <span className="text-xs font-mono font-bold text-white/70 uppercase tracking-widest">{basic.type}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d1b] via-[#0c0d1b]/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${status.bg} ${status.color} border ${status.border} backdrop-blur-md`}>
            {status.pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            {status.label}
          </span>

          <button
            onClick={(e) => onShare(e, event.id)}
            className="pointer-events-auto p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-violet-600 transition-colors shadow-lg"
            title="Share link"
          >
            {copiedId === event.id ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
          </button>
        </div>

        {/* Bottom cover badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white">
          <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1">
            <TIcon size={12} className="text-violet-400" /> {basic.type}
          </span>
          {countdownText && (
            <span className="px-2.5 py-1 rounded-lg bg-violet-600/80 backdrop-blur-md border border-violet-400/30 font-mono text-[10px]">
              {countdownText}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-violet-400 transition-colors duration-200">
            {basic.title || "Untitled Arena"}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {basic.tagline || basic.shortDescription || "Showcase your skills, create high impact projects, and claim rewards."}
          </p>
        </div>

        {/* Metadata info */}
        <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Calendar size={13} className="text-violet-400" /> Event Date
            </span>
            <span className="font-semibold text-white">{fmt(basic.eventStart)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <MapPin size={13} className="text-indigo-400" /> Mode / Venue
            </span>
            <span className="font-semibold text-white capitalize">{basic.mode} {basic.location && `· ${basic.location}`}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Tag size={13} className="text-emerald-400" /> Entry Fee
            </span>
            <span className={`font-bold ${basic.entryFee === 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {event.tags.slice(0, 3).map((tag, tIdx) => (
              <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[10px] text-violet-300 font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/event/${event.id}`);
          }}
          className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${cfg.grad} text-white font-bold text-xs shadow-md ${cfg.glow} hover:brightness-110 transition-all flex items-center justify-center gap-1.5 group-hover:shadow-lg`}
        >
          View Details &amp; Register <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
});

EventCard.displayName = "EventCard";
