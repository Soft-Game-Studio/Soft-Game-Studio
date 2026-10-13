// src/pages/SGS Hackthone/EventsListing.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Users,
  Tag,
  Code,
  Trophy,
  Target,
  Flame,
  Globe,
  Share2,
  Check,
  Building,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  ListFilter,
  X,
  ChevronDown,
  Layers,
  Award,
  CheckCircle2
} from "lucide-react";

/* Type configuration with brand cyan & neutral palette */
const TYPE_CONFIG = {
  HACKATHON:   { dot: "bg-[#00ACF0]", border: "border-sky-500/40", icon: Code, label: "Hackathon" },
  COMPETITION: { dot: "bg-amber-400", border: "border-amber-500/40", icon: Trophy, label: "Competition" },
  WORKSHOP:    { dot: "bg-emerald-400", border: "border-emerald-500/40", icon: Target, label: "Workshop" },
  SEMINAR:     { dot: "bg-blue-400", border: "border-blue-500/40", icon: Layers, label: "Seminar" },
  WEBINAR:     { dot: "bg-cyan-400", border: "border-cyan-500/40", icon: Globe, label: "Webinar" },
  BOOTCAMP:    { dot: "bg-rose-400", border: "border-rose-500/40", icon: Flame, label: "Bootcamp" },
  MEETUP:      { dot: "bg-teal-400", border: "border-teal-500/40", icon: Users, label: "Meetup" },
  CONFERENCE:  { dot: "bg-indigo-400", border: "border-indigo-500/40", icon: Building, label: "Conference" },
  SUMMIT:      { dot: "bg-slate-400", border: "border-slate-500/40", icon: Award, label: "Summit" },
  DEFAULT:     { dot: "bg-sky-400", border: "border-sky-500/40", icon: Sparkles, label: "Event" },
};

const CATEGORIES = [
  { id: "ALL", label: "All Events", icon: Sparkles },
  { id: "HACKATHON", label: "Hackathons", icon: Code },
  { id: "COMPETITION", label: "Competitions", icon: Trophy },
  { id: "WORKSHOP", label: "Workshops", icon: Target },
  { id: "BOOTCAMP", label: "Bootcamps", icon: Flame },
  { id: "WEBINAR", label: "Webinars", icon: Globe },
  { id: "MEETUP", label: "Meetups", icon: Users },
];

/* Normalize firestore schema */
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

/* Format Indian Date */
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "TBA";

/* Event Status Calculation */
const getStatus = (ev) => {
  const now = new Date();
  const { registrationOpen: o, registrationClose: c, eventStart: s, eventEnd: e } = ev.basic || {};
  if (e && new Date(e) < now) {
    return { label: "Concluded", color: "text-neutral-400", bg: "bg-neutral-800", border: "border-neutral-700", pulse: false };
  }
  if (o && c && new Date(o) <= now && new Date(c) >= now) {
    return { label: "Registrations Open", color: "text-emerald-400", bg: "bg-emerald-950/40", border: "border-emerald-500/30", pulse: true };
  }
  if (s && new Date(s) > now) {
    return { label: "Upcoming", color: "text-sky-400", bg: "bg-sky-950/40", border: "border-sky-500/30", pulse: true };
  }
  if (s && new Date(s) <= now && (!e || new Date(e) >= now)) {
    return { label: "Live Now", color: "text-amber-400", bg: "bg-amber-950/40", border: "border-amber-500/30", pulse: true };
  }
  return { label: "Registration Closed", color: "text-rose-400", bg: "bg-rose-950/40", border: "border-rose-500/20", pulse: false };
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

export default function EventsListing() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [filterMode, setFilterMode] = useState("ALL");
  const [quickStatus, setQuickStatus] = useState("ALL");
  const [sort, setSort] = useState("soonest");
  const [viewMode, setViewMode] = useState("grid");
  const [copiedId, setCopiedId] = useState(null);

  /* Fetch live Firestore events */
  useEffect(() => {
    const q = query(collection(fireDB, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((docSnap) =>
          normalizeEvent({ id: docSnap.id, ...docSnap.data() })
        );
        setEvents(list);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore read error:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  /* Filter and Sort */
  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        const b = ev.basic || {};
        const q = search.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (b.title || "").toLowerCase().includes(q) ||
          (b.tagline || "").toLowerCase().includes(q) ||
          (b.organizer || "").toLowerCase().includes(q) ||
          (b.location || "").toLowerCase().includes(q) ||
          (ev.tags || []).some((t) => t.toLowerCase().includes(q));

        const matchesCategory =
          selectedCategory === "ALL" || b.type?.toUpperCase() === selectedCategory;
        const matchesMode =
          filterMode === "ALL" || b.mode?.toUpperCase() === filterMode;

        const status = getStatus(ev);
        let matchesStatus = true;
        if (quickStatus === "OPEN")
          matchesStatus = status.label === "Registrations Open";
        else if (quickStatus === "UPCOMING")
          matchesStatus =
            status.label === "Upcoming" || status.label === "Live Now";
        else if (quickStatus === "FREE") matchesStatus = b.entryFee === 0;

        return matchesSearch && matchesCategory && matchesMode && matchesStatus;
      })
      .sort((a, b) => {
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
        if (sort === "newest") {
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        }
        if (sort === "prize") {
          const pa = (a.prizes || []).reduce(
            (acc, p) => acc + (Number(p.amount) || 0),
            0
          );
          const pb = (b.prizes || []).reduce(
            (acc, p) => acc + (Number(p.amount) || 0),
            0
          );
          return pb - pa;
        }
        return 0;
      });
  }, [events, search, selectedCategory, filterMode, quickStatus, sort]);

  /* Spotlight Event (Featured or Next Upcoming) */
  const spotlightEvent = useMemo(() => {
    return (
      events.find((e) => e.featured) ||
      events.find((e) => getStatus(e).label === "Registrations Open") ||
      events[0]
    );
  }, [events]);

  const handleShare = (e, eventId) => {
    e.stopPropagation();
    const url = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openCount = events.filter(
    (e) => getStatus(e).label === "Registrations Open"
  ).length;
  const upcomingCount = events.filter(
    (e) => getStatus(e).label === "Upcoming"
  ).length;

  // Structured Data Schema for Event Directory
  const eventsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Soft Game Studio Hackathons & Competitions",
    "url": "https://softgamestudios.web.app/event",
    "description": "Discover upcoming game development hackathons, coding showdowns, workshops, and student tech arenas hosted by Soft Game Studio.",
    "publisher": {
      "@type": "Organization",
      "name": "Soft Game Studio Pvt. Ltd.",
      "url": "https://softgamestudios.web.app"
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Hackathons & Tech Competitions | Soft Game Studio</title>
        <meta
          name="description"
          content="Explore national game development hackathons, coding showdowns, workshops, and developer challenges hosted by Soft Game Studio. Register solo or assemble a squad."
        />
        <link rel="canonical" href="https://softgamestudios.web.app/event" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://softgamestudios.web.app/event" />
        <meta property="og:title" content="Hackathons & Developer Challenges | Soft Game Studio" />
        <meta
          property="og:description"
          content="Join premier game development hackathons and competitive coding arenas. Win certificates, rewards, and showcase your work."
        />
        <meta property="og:site_name" content="Soft Game Studio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SoftGameStudio" />
        <meta name="twitter:title" content="Hackathons & Tech Competitions | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Explore upcoming developer hackathons and coding arenas hosted by Soft Game Studio."
        />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(eventsSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        {/* Header Hero Section */}
        <header className="relative pt-24 pb-14 px-4 bg-gradient-to-b from-neutral-100 via-neutral-50 to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] dark:text-sky-400 border border-sky-200 dark:border-sky-900/50">
              <Code className="w-3.5 h-3.5" />
              SGS Hackathons & Developer Arenas
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Where Builders Compete, Innovate & Launch
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Participate in national game development hackathons, engineering showdowns, and immersive workshops. Build real projects and gain verified credentials.
            </p>

            {/* Live Metrics Counter Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <Flame className="w-4 h-4 text-emerald-500" />
                <div className="text-left">
                  <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Registrations Open</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{openCount} Active</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <Calendar className="w-4 h-4 text-[#00ACF0]" />
                <div className="text-left">
                  <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Upcoming Events</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{upcomingCount} Scheduled</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <Award className="w-4 h-4 text-amber-500" />
                <div className="text-left">
                  <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Verified Credentials</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">100% Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Spotlight Banner */}
          {!loading && spotlightEvent && (
            <div className="max-w-6xl mx-auto mt-12">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm hover:border-[#00ACF0]/40 transition">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] border border-sky-200 dark:border-sky-800">
                        Featured Event
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {spotlightEvent.basic.mode || "ONLINE"}
                      </span>
                      {getCountdown(spotlightEvent.basic.registrationClose) && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                          Closing in {getCountdown(spotlightEvent.basic.registrationClose)}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-tight">
                      {spotlightEvent.basic.title}
                    </h2>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                      {spotlightEvent.basic.tagline || spotlightEvent.basic.shortDescription || "Join this premier hackathon and collaborate with exceptional minds."}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#00ACF0]" />
                        <span>{fmt(spotlightEvent.basic.eventStart)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {spotlightEvent.basic.entryFee === 0 ? "Free Entry" : `₹${spotlightEvent.basic.entryFee.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{spotlightEvent.basic.organizer}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => navigate(`/event/${spotlightEvent.id}`)}
                        className="px-6 py-2.5 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-sm shadow-sm transition flex items-center gap-2"
                      >
                        Explore Event <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleShare(e, spotlightEvent.id)}
                        className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-sm transition flex items-center gap-1.5"
                      >
                        {copiedId === spotlightEvent.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                        <span>{copiedId === spotlightEvent.id ? "Link Copied!" : "Share"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="w-full aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800">
                      {spotlightEvent.basic.coverImage ? (
                        <img
                          src={spotlightEvent.basic.coverImage}
                          alt={spotlightEvent.basic.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-sky-50 dark:bg-sky-950/20">
                          <Code className="w-12 h-12 text-[#00ACF0] mb-2" />
                          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">SGS CHALLENGE</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Directory & Explorer Section */}
        <main className="py-12 px-4 max-w-7xl mx-auto">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
            {CATEGORIES.map(({ id, label, icon: CatIcon }) => {
              const isActive = selectedCategory === id;
              const count = id === "ALL" ? events.length : events.filter(e => e.basic.type?.toUpperCase() === id).length;

              return (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap border ${
                    isActive
                      ? "bg-[#00ACF0] text-white border-[#00ACF0] shadow-sm"
                      : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <CatIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#00ACF0]"}`} />
                  <span>{label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Filter & View Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8 space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search challenges by title, skills, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mode Select */}
              <div className="relative min-w-[130px]">
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 rounded-xl text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                >
                  <option value="ALL">All Modes</option>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">In-Person</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>

              {/* Quick Status Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                {[
                  { id: "ALL", label: "All Status" },
                  { id: "OPEN", label: "Open Now" },
                  { id: "UPCOMING", label: "Upcoming" },
                  { id: "FREE", label: "Free Entry" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQuickStatus(item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                      quickStatus === item.id
                        ? "bg-sky-50 dark:bg-sky-950/60 text-[#00ACF0] border-sky-300 dark:border-sky-800"
                        : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative min-w-[140px]">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 rounded-xl text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                >
                  <option value="soonest">Starting Soon</option>
                  <option value="closing">Closing Soon</option>
                  <option value="newest">Newest Added</option>
                  <option value="prize">Highest Prize</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl shrink-0 self-center lg:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-neutral-700 text-[#00ACF0] shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-white dark:bg-neutral-700 text-[#00ACF0] shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                  title="List View"
                >
                  <ListFilter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results count & clear filters */}
            <div className="flex justify-between items-center pt-2 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
              <span>
                Showing <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{filteredEvents.length}</strong> event{filteredEvents.length !== 1 ? "s" : ""}
              </span>
              {(search || selectedCategory !== "ALL" || filterMode !== "ALL" || quickStatus !== "ALL") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("ALL");
                    setFilterMode("ALL");
                    setQuickStatus("ALL");
                  }}
                  className="text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Events Grid or List */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 space-y-4 animate-pulse">
                  <div className="h-44 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                  <div className="h-9 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-[#00ACF0]">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No Events Found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                We could not find any events matching your selected criteria. Try resetting filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("ALL");
                  setFilterMode("ALL");
                  setQuickStatus("ALL");
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00ACF0] text-white font-semibold text-sm hover:bg-[#0092cc] transition shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
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
            </div>
          )}

          {/* Organizer CTA Banner */}
          <div className="mt-20 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 sm:p-12 text-center shadow-sm">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] border border-sky-200 dark:border-sky-800">
                Host With Soft Game Studio
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Hosting a Hackathon, Workshop or Challenge?
              </h3>

              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Leverage our registration engine, automated certification, and dedicated community portal. We partner with universities, communities, and tech leaders.
              </p>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:sgs.web.app@gmail.com?subject=Host%20an%20Event%20with%20SGS"
                  className="px-6 py-3 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-sm transition shadow-sm"
                >
                  Partner With Us
                </a>
                <button
                  onClick={() => navigate("/ContactUs")}
                  className="px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition"
                >
                  Contact Coordination Team
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

/* Event Card Component */
function EventCard({ event, index, viewMode, navigate, onShare, copiedId }) {
  const basic = event.basic || {};
  const status = getStatus(event);
  const cfg = TYPE_CONFIG[basic.type?.toUpperCase()] || TYPE_CONFIG.DEFAULT;
  const TIcon = cfg.icon;
  const countdownText = getCountdown(basic.registrationClose || basic.eventStart);

  if (viewMode === "list") {
    return (
      <div
        onClick={() => navigate(`/event/${event.id}`)}
        className="group cursor-pointer rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#00ACF0]/40 transition shadow-sm text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700 relative">
            {basic.coverImage ? (
              <img
                src={basic.coverImage}
                alt={basic.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sky-50 dark:bg-sky-950/40">
                <TIcon className="w-6 h-6 text-[#00ACF0]" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.color} border ${status.border}`}>
                {status.pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                {status.label}
              </span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase">{basic.type}</span>
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white truncate group-hover:text-[#00ACF0] transition-colors">
              {basic.title}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
              {basic.tagline || basic.shortDescription || `Organized by ${basic.organizer}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-600 dark:text-neutral-300 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#00ACF0]" />
            <span>{fmt(basic.eventStart)}</span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
            <Tag className="w-3.5 h-3.5" />
            <span>{basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee.toLocaleString("en-IN")}`}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onShare(e, event.id)}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition"
              title="Share event link"
            >
              {copiedId === event.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/event/${event.id}`);
              }}
              className="px-4 py-2 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-xs transition shadow-sm flex items-center gap-1"
            >
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Grid View Card */
  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      className="group cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#00ACF0]/40 transition shadow-sm text-left"
    >
      <div className="relative h-44 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
        {basic.coverImage ? (
          <img
            src={basic.coverImage}
            alt={basic.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-sky-50 dark:bg-sky-950/20">
            <TIcon className="w-10 h-10 text-[#00ACF0] mb-1" />
            <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase">{basic.type}</span>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.color} border ${status.border} backdrop-blur-md`}>
            {status.pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            {status.label}
          </span>

          <button
            onClick={(e) => onShare(e, event.id)}
            className="pointer-events-auto p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-[#00ACF0] transition shadow-md"
            title="Share link"
          >
            {copiedId === event.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-semibold">
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white flex items-center gap-1">
            <TIcon className="w-3 h-3 text-[#00ACF0]" /> {basic.type}
          </span>
          {countdownText && (
            <span className="px-2 py-0.5 rounded-md bg-[#00ACF0]/90 backdrop-blur-md text-white font-mono">
              {countdownText}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-[#00ACF0] transition-colors">
            {basic.title || "Untitled Challenge"}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {basic.tagline || basic.shortDescription || "Showcase your skills, create high impact projects, and claim rewards."}
          </p>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Calendar className="w-3.5 h-3.5 text-[#00ACF0]" /> Event Date
            </span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{fmt(basic.eventStart)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> Mode / Venue
            </span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
              {basic.mode} {basic.location && `- ${basic.location}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Tag className="w-3.5 h-3.5 text-emerald-500" /> Entry Fee
            </span>
            <span className={`font-bold ${basic.entryFee === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/event/${event.id}`);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
        >
          View Details & Register <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
