// src/pages/SGS Hackthone/DynamicEventPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  Lightbulb,
  Users,
  CalendarDays,
  Award,
  ChevronDown,
  CheckCircle2,
  Clock,
  MapPin,
  BookOpen,
  Trophy,
  Target,
  Globe,
  ChevronUp,
  Shield,
  Tag,
  Share2,
  Rocket,
  ExternalLink,
  Calendar,
  Copy,
  Check,
  X,
  Building,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Mail,
  Medal
} from "lucide-react";
import RegistrationForm from "./RegistrationForm";
import { QRCodeSVG } from "qrcode.react";

const EMPTY_EVENT = {
  basic: {
    title: "",
    tagline: "",
    shortDescription: "",
    longDescription: "",
    coverImage: "",
    mode: "ONLINE",
    location: "",
    registrationOpen: "",
    registrationClose: "",
    eventStart: "",
    eventEnd: "",
    entryFee: 0,
    certificate: true,
    type: "HACKATHON",
    organizer: "Soft Game Studio",
    website: ""
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

/* Accessible FAQ Accordion */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left transition hover:border-[#00ACF0]/40 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
      >
        <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base leading-snug">{q}</span>
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          open ? "bg-[#00ACF0] text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
        }`}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed border-t border-neutral-100 dark:border-neutral-800 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function DynamicEventPage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [event, setEvent] = useState(EMPTY_EVENT);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  // Real-time Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: false });

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);

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
    let isMounted = true;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(fireDB, "events", eventId));
        if (snap.exists() && isMounted) {
          setEvent(normEvent({ id: snap.id, ...snap.data() }));
        } else if (isMounted) {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error loading event:", err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (eventId) fetchEvent();
    return () => {
      isMounted = false;
    };
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

  const { basic, team, problemStatements, timeline, judging, faq, prizes, registrationFields } = event;

  // JSON-LD Event Schema
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": basic.title || "SGS Challenge",
    "description": basic.shortDescription || basic.tagline || "Official developer hackathon and competition.",
    "startDate": basic.eventStart || undefined,
    "endDate": basic.eventEnd || basic.eventStart || undefined,
    "eventAttendanceMode": basic.mode === "ONLINE"
      ? "https://schema.org/OnlineEventAttendanceMode"
      : basic.mode === "OFFLINE"
      ? "https://schema.org/OfflineEventAttendanceMode"
      : "https://schema.org/MixedEventAttendanceMode",
    "eventStatus": isConcluded
      ? "https://schema.org/EventMovedOnline"
      : "https://schema.org/EventScheduled",
    "location": {
      "@type": basic.mode === "ONLINE" ? "VirtualLocation" : "Place",
      "name": basic.location || "Soft Game Studio Virtual Arena",
      "url": window.location.href
    },
    "organizer": {
      "@type": "Organization",
      "name": basic.organizer || "Soft Game Studio",
      "url": "https://softgamestudios.web.app"
    },
    "offers": {
      "@type": "Offer",
      "price": basic.entryFee || "0",
      "priceCurrency": "INR",
      "availability": isRegOpen ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "validFrom": basic.registrationOpen || undefined
    }
  };

  /* LOADING STATE */
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
          <div className="w-10 h-10 rounded-full border-2 border-[#00ACF0] border-t-transparent animate-spin mb-4" />
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Loading Challenge Data...</span>
        </div>
      </Layout>
    );
  }

  /* NOT FOUND STATE */
  if (notFound) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mb-4 text-amber-600">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Challenge Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-6 text-sm">
            The event arena you are seeking may have concluded, been archived, or the link has changed.
          </p>
          <button
            onClick={() => navigate("/event")}
            className="px-6 py-2.5 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-sm transition flex items-center gap-2 shadow-sm"
          >
            Browse All Arenas <ArrowRight size={16} />
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{`${basic.title} | SGS Hackathons`}</title>
        <meta
          name="description"
          content={basic.shortDescription || basic.tagline || `Join ${basic.title} hosted by Soft Game Studio. Compete, build projects, and claim verified credentials.`}
        />
        <link rel="canonical" href={`https://softgamestudios.web.app/event/${eventId}`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://softgamestudios.web.app/event/${eventId}`} />
        <meta property="og:title" content={`${basic.title} | Soft Game Studio`} />
        <meta
          property="og:description"
          content={basic.shortDescription || basic.tagline || "Official hackathon and developer competition hosted on Soft Game Studio."}
        />
        {basic.coverImage && <meta property="og:image" content={basic.coverImage} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SoftGameStudio" />
        <meta name="twitter:title" content={`${basic.title} | Soft Game Studio`} />
        <meta
          name="twitter:description"
          content={basic.tagline || basic.shortDescription || "Participate in this official coding challenge."}
        />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        {/* Sticky Floating Top Bar */}
        {scrolled && (
          <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-3 shadow-sm transition">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full ${isRegOpen ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{basic.title}</h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-sky-50 dark:bg-sky-950/60 text-[#00ACF0] uppercase">
                  {basic.type}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {!timeLeft.ended && (
                  <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-400 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <Clock size={13} className="text-[#00ACF0]" />
                    <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left</span>
                  </div>
                )}

                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition"
                  title="Share event link"
                >
                  <Share2 size={14} />
                </button>

                <button
                  onClick={() => scrollToSection("register-section")}
                  className="px-4 py-2 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
                >
                  Register <Rocket size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <header className="relative pt-24 pb-14 px-4 bg-gradient-to-b from-neutral-100 via-neutral-50 to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              <Link to="/event" className="hover:text-[#00ACF0] transition-colors">Arenas</Link>
              <span>/</span>
              <span className="uppercase font-semibold text-[#00ACF0]">{basic.type}</span>
              <span>/</span>
              <span className="truncate max-w-xs text-neutral-700 dark:text-neutral-300">{basic.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    isRegOpen
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                      : isConcluded
                      ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-500"
                      : "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-[#00ACF0]"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isRegOpen ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                    {isRegOpen ? "Registrations Open" : isConcluded ? "Concluded" : "Registrations Closed"}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {basic.type}
                  </span>

                  {basic.certificate && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <Award size={12} className="text-amber-500" /> Certificate Included
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
                  {basic.title}
                </h1>

                {(basic.tagline || basic.shortDescription) && (
                  <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                    {basic.tagline || basic.shortDescription}
                  </p>
                )}

                {/* Real-time Countdown Timer Clock */}
                {!timeLeft.ended && (
                  <div className="pt-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
                      <Clock size={13} className="text-[#00ACF0]" /> Registration Deadline
                    </span>
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-sm">
                      {[
                        { label: "DAYS", value: timeLeft.days },
                        { label: "HOURS", value: timeLeft.hours },
                        { label: "MINS", value: timeLeft.minutes },
                        { label: "SECS", value: timeLeft.seconds }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center shadow-sm">
                          <span className="block text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                            {String(item.value).padStart(2, "0")}
                          </span>
                          <span className="block text-[10px] font-semibold text-neutral-400 uppercase mt-0.5">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata Row */}
                <div className="flex flex-wrap gap-3 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <MapPin size={14} className="text-[#00ACF0]" />
                    <span>{basic.mode} {basic.location && `- ${basic.location}`}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Calendar size={14} className="text-[#00ACF0]" />
                    <span>{fmt(basic.eventStart)} {basic.eventEnd && `to ${fmt(basic.eventEnd)}`}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Tag size={14} className="text-emerald-500" />
                    <span className={`font-semibold ${basic.entryFee === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Users size={14} className="text-sky-500" />
                    <span>
                      {team.allowSolo && team.allowTeam ? `Solo or Squad (${team.minSize} to ${team.maxSize})` : team.allowSolo ? "Solo Only" : `Squad (${team.minSize} to ${team.maxSize})`}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => scrollToSection("register-section")}
                    className="px-6 py-3 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-sm shadow-sm transition flex items-center gap-2"
                  >
                    Register For Challenge <Rocket size={16} />
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition flex items-center gap-2"
                  >
                    <Share2 size={15} /> Share
                  </button>

                  <a
                    href={getCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold transition flex items-center gap-1.5"
                    title="Add to Google Calendar"
                  >
                    <CalendarDays size={15} /> Add to Calendar
                  </a>

                  {basic.website && (
                    <a
                      href={basic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold transition flex items-center gap-1.5"
                    >
                      <Globe size={15} /> Website <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Event Media Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 shadow-sm">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-800">
                    {basic.coverImage ? (
                      <img
                        src={basic.coverImage}
                        alt={basic.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-sky-50 dark:bg-sky-950/20">
                        <Trophy size={48} className="text-[#00ACF0] mb-2" />
                        <span className="text-sm font-bold text-neutral-900 dark:text-white uppercase">{basic.type}</span>
                        <span className="text-xs text-neutral-500 mt-1">{basic.organizer}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 grid grid-cols-2 gap-3 text-left">
                    <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/50">
                      <span className="block text-[11px] text-neutral-500 uppercase font-semibold">Organized By</span>
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate block mt-0.5">{basic.organizer}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/50">
                      <span className="block text-[11px] text-neutral-500 uppercase font-semibold">Squad Capacity</span>
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block mt-0.5">{team.minSize} to {team.maxSize} Members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* In-page Anchor Navigation Bar */}
        <div className="sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            {[
              { id: "about", label: "Overview", show: true },
              { id: "problems", label: "Problem Tracks", show: problemStatements.length > 0 },
              { id: "timeline", label: "Timeline", show: timeline.length > 0 },
              { id: "prizes", label: "Prizes", show: prizes.length > 0 },
              { id: "rules", label: "Rules", show: true },
              { id: "judging", label: "Judging Criteria", show: judging.length > 0 },
              { id: "faq", label: "FAQ", show: faq.length > 0 },
              { id: "register-section", label: "Register", show: true }
            ].filter((t) => t.show).map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  activeSection === tab.id
                    ? "bg-[#00ACF0] text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION: ABOUT & HIGHLIGHTS */}
        <section id="about" className="py-16 px-4 max-w-7xl mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] text-xs font-semibold uppercase">
                <BookOpen size={12} /> Overview
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                About the Challenge
              </h2>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
                {basic.longDescription || basic.shortDescription || "Welcome to the official challenge. Prepare your technical approach, assemble your squad, and build solutions."}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0] flex items-center justify-center mb-2">
                  <Trophy size={18} />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Recognition</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Grants, certificates of excellence, and verified Soft Game Studio credentials.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-2">
                  <Users size={18} />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Collaboration</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Compete individually or assemble a squad of up to {team.maxSize} developers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mb-2">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Constructive Feedback</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Submissions are reviewed by seasoned engineers with actionable feedback.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-2">
                  <Rocket size={18} />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Showcase Opportunities</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Top projects receive dedicated showcases across our developer community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PROBLEM STATEMENTS */}
        {problemStatements.length > 0 && (
          <section id="problems" className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] text-xs font-semibold uppercase">
                <Target size={12} /> Innovation Tracks
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Problem Statements
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Select your track and engineer solutions according to competition guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problemStatements.map((track, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between space-y-4 hover:border-[#00ACF0]/40 transition shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-sky-50 dark:bg-sky-950/60 text-[#00ACF0] border border-sky-200 dark:border-sky-800">
                        {track.track || `Track 0${idx + 1}`}
                      </span>
                      <Target size={16} className="text-[#00ACF0]" />
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {track.name}
                    </h3>

                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-4">
                      {track.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
                    Deliverable: Working code prototype & documentation
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: TIMELINE */}
        {timeline.length > 0 && (
          <section id="timeline" className="py-16 px-4 max-w-3xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left">
            <div className="text-center mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] text-xs font-semibold uppercase">
                <CalendarDays size={12} /> Schedule
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Challenge Roadmap
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Follow each milestone from kickoff through evaluation.
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-[#00ACF0]/40 space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 border-2 border-[#00ACF0]" />
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-[#00ACF0] uppercase">
                        {fmt(item.date)} {item.time && `- ${item.time}`}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        Phase {i + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: PRIZES */}
        {prizes.length > 0 && (
          <section id="prizes" className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold uppercase">
                <Trophy size={12} /> Recognition
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Prizes & Awards
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Acknowledged achievements and verified certificates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {prizes.map((p, i) => {
                const isFirst = i === 0;
                const isSecond = i === 1;

                return (
                  <div
                    key={i}
                    className={`rounded-2xl p-6 text-center border transition shadow-sm flex flex-col justify-between ${
                      isFirst
                        ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                        : isSecond
                        ? "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                        {isFirst ? (
                          <Trophy className="w-6 h-6 text-amber-500" />
                        ) : isSecond ? (
                          <Medal className="w-6 h-6 text-slate-400" />
                        ) : (
                          <Award className="w-6 h-6 text-[#00ACF0]" />
                        )}
                      </div>

                      <span className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                        {p.title || `Rank 0${i + 1}`}
                      </span>

                      <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                        {p.amount && p.amount !== "0"
                          ? `₹${Number(p.amount).toLocaleString("en-IN")}`
                          : "Excellence Grant"}
                      </div>

                      {p.description && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>Official Trophy & Certificate</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION: RULES */}
        <section id="rules" className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] text-xs font-semibold uppercase">
              <Shield size={12} /> Compliance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Rules & Guidelines
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Standard competition code of conduct ensuring fairness and collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
              <span className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0] font-bold text-xs flex items-center justify-center">1</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Eligibility & Squad Limits</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Open to developers and students worldwide. Team sizes must comply with the minimum ({team.minSize}) and maximum ({team.maxSize}) member limits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
              <span className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0] font-bold text-xs flex items-center justify-center">2</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Original Engineering</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                All source code must be authored within the active hackathon schedule. Open-source libraries and public frameworks are permitted with attribution.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
              <span className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0] font-bold text-xs flex items-center justify-center">3</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Submission Deliverables</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Teams must submit a working repository, video demonstration, and architectural overview before the announced deadline.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: JUDGING CRITERIA */}
        {judging.length > 0 && (
          <section id="judging" className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold uppercase">
                <Lightbulb size={12} /> Rubric
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Judging Criteria
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Transparent evaluation rubric applied by our technical reviewers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {judging.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-500 uppercase">Weight</span>
                      {item.weight && (
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-sky-50 dark:bg-sky-950/60 text-[#00ACF0]">
                          {item.weight}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">{item.name}</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description || "Evaluated for execution quality, depth, and practical viability."}
                    </p>
                  </div>

                  {item.weight && (
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#00ACF0] h-full rounded-full" style={{ width: `${item.weight}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: FAQS */}
        {faq.length > 0 && (
          <section id="faq" className="py-16 px-4 max-w-3xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left">
            <div className="text-center mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] text-xs font-semibold uppercase">
                <HelpCircle size={12} /> Answers
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Key questions regarding participation, submission, and logistics.
              </p>
            </div>

            <div className="space-y-3">
              {faq.map((item, idx) => (
                <FaqItem key={idx} q={item.question} a={item.answer} index={idx} />
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Have additional questions?</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Reach out to the Soft Game Studio coordination team.</p>
              </div>
              <a
                href="mailto:sgs.web.app@gmail.com"
                className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
              >
                <Mail size={13} /> Contact Support
              </a>
            </div>
          </section>
        )}

        {/* SECTION: REGISTRATION PORTAL */}
        <section id="register-section" className="py-20 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800">
          <RegistrationForm
            eventId={eventId}
            eventTitle={basic.title}
            dynamicFields={registrationFields}
            onClose={() => scrollToSection("about")}
          />
        </section>

        {/* SHARE & QR MODAL */}
        <AnimatePresence>
          {showShareModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            >
              <div
                className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 relative shadow-xl text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute right-4 top-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition"
                >
                  <X size={16} />
                </button>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Share Event</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">Invite your teammates to register for {basic.title}.</p>

                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center mb-5">
                  <QRCodeSVG value={window.location.href} size={140} level="M" />
                  <span className="text-[11px] font-mono font-medium text-neutral-500 mt-2">Scan with mobile camera</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-5">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="bg-transparent border-0 text-xs text-neutral-700 dark:text-neutral-300 px-2 flex-1 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-xs flex items-center gap-1 transition"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Register for ${basic.title} on Soft Game Studio: ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition block"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${basic.title} at Soft Game Studio: ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition block"
                  >
                    Twitter / X
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition block"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
