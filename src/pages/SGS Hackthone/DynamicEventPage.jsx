// src/pages/SGS Hackthone/DynamicEventPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { AnimatePresence } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  Lightbulb,
  Users,
  CalendarDays,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  MapPin,
  BookOpen,
  Trophy,
  Target,
  Globe,
  Shield,
  ShieldCheck,
  Tag,
  Share2,
  Rocket,
  ExternalLink,
  Calendar,
  Copy,
  Check,
  X,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Mail,
  Medal
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const EMPTY_EVENT = {
  basic: {
    title: "",
    subtitle: "",
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
    website: "",
    prizePool: ""
  },
  team: { allowSolo: true, allowTeam: true, minSize: 1, maxSize: 4, maxTeams: 100 },
  problemStatements: [],
  timeline: [],
  judging: [],
  faq: [],
  prizes: [],
  registrationFields: []
};

const normEvent = (data) => {
  if (!data) return EMPTY_EVENT;
  const b = {
    title: data.title || data.basic?.title || "SGS Arena Challenge",
    subtitle: data.subtitle || data.basic?.subtitle || data.tagline || data.basic?.tagline || "",
    tagline: data.tagline || data.basic?.tagline || data.subtitle || data.basic?.subtitle || "",
    shortDescription: data.shortDescription || data.basic?.shortDescription || "",
    longDescription: data.longDescription || data.basic?.longDescription || "",
    coverImage: data.coverImage || data.basic?.coverImage || "",
    mode: (data.mode || data.basic?.mode || "ONLINE").toUpperCase(),
    location: data.location || data.basic?.location || "",
    registrationOpen: data.registrationOpen || data.basic?.registrationOpen || "",
    registrationClose: data.registrationClose || data.basic?.registrationClose || "",
    eventStart: data.eventStart || data.basic?.eventStart || "",
    eventEnd: data.eventEnd || data.basic?.eventEnd || "",
    entryFee:
      data.entryFee !== undefined
        ? Number(data.entryFee)
        : data.basic?.entryFee !== undefined
        ? Number(data.basic.entryFee)
        : 0,
    certificate:
      data.certificate !== undefined
        ? data.certificate
        : data.basic?.certificate !== undefined
        ? data.basic.certificate
        : true,
    type: (data.type || data.basic?.type || "HACKATHON").toUpperCase(),
    organizer: data.organizer || data.basic?.organizer || "Soft Game Studio",
    website: data.website || data.basic?.website || "",
    prizePool: data.prizePool || data.basic?.prizePool || ""
  };
  const t = {
    allowSolo: data.team?.allowSolo !== undefined ? data.team.allowSolo : true,
    allowTeam: data.team?.allowTeam !== undefined ? data.team.allowTeam : true,
    minSize: data.team?.minSize !== undefined ? data.team.minSize : 1,
    maxSize: data.team?.maxSize !== undefined ? data.team.maxSize : 4,
    maxTeams: data.team?.maxTeams !== undefined ? data.team.maxTeams : 100
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

const fmt = (d) => {
  if (!d) return "TBA";
  const parsed = new Date(d);
  return isNaN(parsed.getTime())
    ? "TBA"
    : parsed.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};

/* Accessible Monochrome FAQ Accordion */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] text-left transition overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base leading-snug">
          {q}
        </span>
        <div
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            open
              ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          }`}
        >
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

  const [event, setEvent] = useState(EMPTY_EVENT);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  // Real-time Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: false });

  // Scroll detection for in-page tabs
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);

      const sections = ["about", "problems", "timeline", "prizes", "rules", "judging", "faq", "register-cta"];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220 && rect.bottom >= 220) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch event document from Firestore
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

  /* Navigation to Separate Registration Page */
  const handleGoToRegistration = () => {
    navigate(`/event/${eventId}/register`);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getCalendarUrl = () => {
    const title = encodeURIComponent(event.basic?.title || "SGS Hackathon");
    const details = encodeURIComponent(
      event.basic?.tagline || event.basic?.shortDescription || "Join this premier hackathon hosted on Soft Game Studio."
    );
    const location = encodeURIComponent(event.basic?.location || "Online");
    let start = "";
    let end = "";
    try {
      if (event.basic?.eventStart && !isNaN(new Date(event.basic.eventStart).getTime())) {
        start = new Date(event.basic.eventStart).toISOString().replace(/-|:|\.\d\d\d/g, "");
      }
      if (event.basic?.eventEnd && !isNaN(new Date(event.basic.eventEnd).getTime())) {
        end = new Date(event.basic.eventEnd).toISOString().replace(/-|:|\.\d\d\d/g, "");
      } else {
        end = start;
      }
    } catch {
      // fallback safe
    }
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
  };

  const now = new Date();
  const { registrationOpen: rO, registrationClose: rC, eventEnd: eE, status } = event.basic || {};

  // Timezone-safe and end-of-day resilient dates
  const openTime = rO ? (rO.length <= 10 ? new Date(`${rO}T00:00:00`) : new Date(rO)) : null;
  const closeTime = rC ? (rC.length <= 10 ? new Date(`${rC}T23:59:59.999`) : new Date(rC)) : null;
  const endTime = eE ? (eE.length <= 10 ? new Date(`${eE}T23:59:59.999`) : new Date(eE)) : null;

  const hasValidOpen = openTime && !isNaN(openTime.getTime());
  const hasValidClose = closeTime && !isNaN(closeTime.getTime());
  const hasValidEnd = endTime && !isNaN(endTime.getTime());

  const isConcluded =
    (status && (status.toUpperCase() === "CLOSED" || status.toUpperCase() === "CONCLUDED")) ||
    (hasValidEnd && endTime < now) ||
    (hasValidClose && closeTime < now);

  const isPending = hasValidOpen && openTime > now;
  const isRegOpen =
    !isConcluded &&
    ((hasValidOpen && openTime <= now && (!hasValidClose || closeTime >= now)) ||
      (status && (status.toUpperCase() === "OPEN" || status.toUpperCase() === "PUBLISHED" || status.toUpperCase() === "ACTIVE")));

  const { basic, team, problemStatements, timeline, judging, faq, prizes } = event;

  /* LOADING STATE */
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white dark:bg-[#000000] text-neutral-900 dark:text-neutral-100">
          <div className="w-10 h-10 rounded-full border-2 border-black dark:border-white border-t-transparent animate-spin mb-4" />
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            Loading Arena Telemetry...
          </span>
        </div>
      </Layout>
    );
  }

  /* NOT FOUND STATE */
  if (notFound) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center mb-4 text-neutral-900 dark:text-white">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-neutral-950 dark:text-white tracking-tight">
            Challenge Not Found
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-6 text-xs sm:text-sm font-mono">
            The event arena you are seeking may have concluded, been archived, or the link has changed.
          </p>
          <button
            onClick={() => navigate("/event")}
            className="px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Browse All Arenas</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{`${basic.title} | Soft Game Studio Arena`}</title>
        <meta
          name="description"
          content={
            basic.shortDescription ||
            basic.tagline ||
            `Join ${basic.title} hosted by Soft Game Studio. Compete, build projects, and claim verified credentials.`
          }
        />
        <link rel="canonical" href={`https://softgamestudio.in/event/${eventId}`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://softgamestudio.in/event/${eventId}`} />
        <meta property="og:title" content={`${basic.title} | Soft Game Studio`} />
        <meta
          property="og:description"
          content={
            basic.shortDescription ||
            basic.tagline ||
            "Official hackathon and developer competition hosted on Soft Game Studio."
          }
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
      </Helmet>

      {/* Main Container - Grounded Dual-Mode Canvas (White in Light, Black in Dark) */}
      <div className="min-h-screen bg-white dark:bg-[#000000] text-neutral-900 dark:text-[#F9FAFB] font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
        {/* Sticky Floating Action Bar (Visible upon scroll) */}
        {scrolled && (
          <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-3 shadow-md transition">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isRegOpen ? "bg-black dark:bg-white animate-pulse" : "bg-neutral-400"
                  }`}
                />
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {basic.title}
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 uppercase border border-neutral-300 dark:border-neutral-800">
                  {basic.type}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {!timeLeft.ended && (
                  <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Clock size={13} />
                    <span>
                      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition cursor-pointer"
                  title="Share event link"
                >
                  <Share2 size={14} />
                </button>

                {isRegOpen ? (
                  <button
                    onClick={handleGoToRegistration}
                    className="px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Register for Challenge</span>
                    <ArrowRight size={13} />
                  </button>
                ) : isConcluded ? (
                  <button
                    onClick={handleGoToRegistration}
                    className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Registration Closed
                  </button>
                ) : (
                  <button
                    onClick={handleGoToRegistration}
                    className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Upcoming / Waitlist
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <header className="relative pt-12 pb-14 px-4 bg-white dark:bg-[#000000] border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-6"
            >
              <Link to="/event" className="hover:text-black dark:hover:text-white transition-colors">
                Arenas
              </Link>
              <span>/</span>
              <span className="uppercase font-semibold text-neutral-700 dark:text-neutral-300">
                {basic.type}
              </span>
              <span>/</span>
              <span className="truncate max-w-xs text-neutral-900 dark:text-white font-bold">
                {basic.title}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Heading, Telemetry, Countdown, Actions */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Status Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${
                      isRegOpen
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                        : isConcluded
                        ? "bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                        : "bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isRegOpen ? "bg-white dark:bg-black animate-pulse" : "bg-neutral-400"
                      }`}
                    />
                    {isRegOpen
                      ? "Registrations Open"
                      : isConcluded
                      ? "Challenge Concluded"
                      : "Registrations Closed"}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800">
                    {basic.type}
                  </span>

                  {basic.certificate && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 flex items-center gap-1">
                      <Award size={12} /> Verified Certificate
                    </span>
                  )}
                </div>

                {/* Main H1 Title */}
                <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
                  {basic.title}
                </h1>

                {/* Subtitle / Tagline */}
                {(basic.tagline || basic.shortDescription) && (
                  <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl font-normal">
                    {basic.tagline || basic.shortDescription}
                  </p>
                )}

                {/* Real-time Countdown Timer Clock */}
                {!timeLeft.ended && (
                  <div className="pt-2">
                    <span className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
                      <Clock size={13} /> Registration Countdown
                    </span>
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-sm">
                      {[
                        { label: "DAYS", value: timeLeft.days },
                        { label: "HOURS", value: timeLeft.hours },
                        { label: "MINS", value: timeLeft.minutes },
                        { label: "SECS", value: timeLeft.seconds }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-neutral-50/70 dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 text-center shadow-sm"
                        >
                          <span className="block text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
                            {String(item.value).padStart(2, "0")}
                          </span>
                          <span className="block text-[10px] font-mono font-bold text-neutral-500 uppercase mt-0.5">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata Row */}
                <div className="flex flex-wrap gap-2.5 pt-1 text-xs text-neutral-700 dark:text-neutral-300 font-mono">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <MapPin size={13} />
                    <span>
                      {basic.mode} {basic.location && `• ${basic.location}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Calendar size={13} />
                    <span>
                      {fmt(basic.eventStart)} {basic.eventEnd && `to ${fmt(basic.eventEnd)}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Tag size={13} />
                    <span className="font-bold">
                      {basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Users size={13} />
                    <span>
                      {team.allowSolo && team.allowTeam
                        ? `Solo or Squad (${team.minSize}-${team.maxSize})`
                        : team.allowSolo
                        ? "Solo Only"
                        : `Squad (${team.minSize}-${team.maxSize})`}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleGoToRegistration}
                    className="px-6 py-3 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>
                      {isConcluded
                        ? "Registration Closed"
                        : isPending
                        ? "Opens Soon / Waitlist"
                        : "Register for Challenge"}
                    </span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>

                  <a
                    href={getCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition flex items-center gap-1.5"
                    title="Add to Google Calendar"
                  >
                    <CalendarDays size={14} />
                    <span>Add to Calendar</span>
                  </a>

                  {basic.website && (
                    <a
                      href={basic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Globe size={14} />
                      <span>Website</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Event Media Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] p-3 shadow-md">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-neutral-900">
                    {basic.coverImage ? (
                      <img
                        src={basic.coverImage}
                        alt={basic.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-white">
                        <Trophy size={48} className="mb-2 text-white" />
                        <span className="text-sm font-bold uppercase tracking-wider font-mono">
                          {basic.type}
                        </span>
                        <span className="text-xs text-neutral-400 mt-1 font-mono">{basic.organizer}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 grid grid-cols-2 gap-3 text-left">
                    <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <span className="block text-[10px] font-mono text-neutral-500 uppercase font-semibold">
                        Organized By
                      </span>
                      <span className="text-xs font-bold text-neutral-950 dark:text-white truncate block mt-0.5">
                        {basic.organizer}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <span className="block text-[10px] font-mono text-neutral-500 uppercase font-semibold">
                        Squad Capacity
                      </span>
                      <span className="text-xs font-bold text-neutral-950 dark:text-white block mt-0.5 font-mono">
                        {team.minSize} to {team.maxSize} Members
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* In-page Anchor Navigation Bar */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: "about", label: "Overview", show: true },
                { id: "problems", label: "Problem Tracks", show: problemStatements.length > 0 },
                { id: "timeline", label: "Timeline", show: timeline.length > 0 },
                { id: "prizes", label: "Prizes", show: prizes.length > 0 },
                { id: "rules", label: "Rules", show: true },
                { id: "judging", label: "Judging Criteria", show: judging.length > 0 },
                { id: "faq", label: "FAQ", show: faq.length > 0 },
                { id: "register-cta", label: "Registration Portal", show: true }
              ]
                .filter((t) => t.show)
                .map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                      activeSection === tab.id
                        ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
            </div>

            {/* Direct Link to Register in Tab Bar */}
            <button
              onClick={handleGoToRegistration}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Register</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* SECTION: ABOUT & HIGHLIGHTS */}
        <section id="about" className="py-16 px-4 max-w-7xl mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-mono font-semibold uppercase">
                <BookOpen size={12} /> Overview
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                About the Challenge
              </h2>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
                {basic.longDescription ||
                  basic.shortDescription ||
                  "Welcome to the official challenge. Prepare your technical approach, assemble your squad, and build solutions."}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center mb-2">
                  <Trophy size={18} />
                </div>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">Recognition</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Grants, certificates of excellence, and verified Soft Game Studio credentials.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center mb-2">
                  <Users size={18} />
                </div>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">Collaboration</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Compete individually or assemble a squad of up to {team.maxSize} developers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center mb-2">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">Constructive Feedback</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Submissions are reviewed by seasoned engineers with actionable feedback.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center mb-2">
                  <Rocket size={18} />
                </div>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">Showcase Opportunities</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Top projects receive dedicated showcases across our developer community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PROBLEM STATEMENTS */}
        {problemStatements.length > 0 && (
          <section
            id="problems"
            className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left"
          >
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-mono font-semibold uppercase">
                <Target size={12} /> Innovation Tracks
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
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
                  className="rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between space-y-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                        {track.track || `Track 0${idx + 1}`}
                      </span>
                      <Target size={16} className="text-neutral-600 dark:text-neutral-400" />
                    </div>

                    <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                      {track.name}
                    </h3>

                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-4">
  <a
    href={track.description}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
  >
    View Syllabus →
  </a>
</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono text-neutral-500">
                    Deliverable: Working code prototype &amp; documentation
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: TIMELINE */}
        {timeline.length > 0 && (
          <section
            id="timeline"
            className="py-16 px-4 max-w-3xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left"
          >
            <div className="text-center mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-mono font-semibold uppercase">
                <CalendarDays size={12} /> Schedule
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                Challenge Roadmap
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Follow each milestone from kickoff through evaluation.
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-neutral-300 dark:border-neutral-700 space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-black border-2 border-black dark:border-white shadow-sm" />
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-950 dark:text-white uppercase">
                        {fmt(item.date)} {item.time && `• ${item.time}`}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        Phase {i + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-950 dark:text-white">
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
          <section
            id="prizes"
            className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left"
          >
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-mono font-semibold uppercase">
                <Trophy size={12} /> Recognition
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                Prizes &amp; Awards
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Acknowledged achievements and verified credentials.
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
                        ? "bg-neutral-50 dark:bg-[#111827] border-neutral-400 dark:border-neutral-600"
                        : "bg-white dark:bg-[#111827] border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-950 dark:text-white">
                        {isFirst ? (
                          <Trophy className="w-6 h-6" />
                        ) : isSecond ? (
                          <Medal className="w-6 h-6" />
                        ) : (
                          <Award className="w-6 h-6" />
                        )}
                      </div>

                      <span className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                        {p.title || `Rank 0${i + 1}`}
                      </span>

                      <div className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
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

                    <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-1.5 font-mono">
                      <CheckCircle2 size={13} />
                      <span>Official Trophy &amp; Certificate</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION: RULES */}
        <section
          id="rules"
          className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left"
        >
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-mono font-semibold uppercase">
              <Shield size={12} /> Compliance
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
              Rules &amp; Guidelines
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Standard competition code of conduct ensuring fairness and collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
              <span className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white font-mono font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Eligibility &amp; Squad Limits
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Open to developers and students worldwide. Team sizes must comply with the minimum ({team.minSize}) and maximum ({team.maxSize}) member limits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
              <span className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white font-mono font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Original Engineering
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                All source code must be authored within the active hackathon schedule. Open-source libraries and public frameworks are permitted with attribution.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
              <span className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white font-mono font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Submission Deliverables
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Teams must submit a working repository, video demonstration, and architectural overview before the announced deadline.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: JUDGING CRITERIA */}
        {judging.length > 0 && (
          <section
            id="judging"
            className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left"
          >
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-mono font-semibold uppercase">
                <Lightbulb size={12} /> Rubric
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                Judging Criteria
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Transparent evaluation rubric applied by our technical reviewers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {judging.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-500 uppercase">Weight</span>
                      {item.weight && (
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
                          {item.weight}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-neutral-950 dark:text-white">{item.name}</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description || "Evaluated for execution quality, depth, and practical viability."}
                    </p>
                  </div>

                  {item.weight && (
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-black dark:bg-white h-full rounded-full"
                        style={{ width: `${item.weight}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: FAQS */}
        {faq.length > 0 && (
          <section
            id="faq"
            className="py-16 px-4 max-w-3xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-left"
          >
            <div className="text-center mb-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-mono font-semibold uppercase">
                <HelpCircle size={12} /> Answers
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
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

            <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h4 className="text-sm font-bold text-neutral-950 dark:text-white">
                  Have additional questions?
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Reach out to the Soft Game Studio coordination team.
                </p>
              </div>
              <a
                href="mailto:sgs.web.app@gmail.com"
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
              >
                <Mail size={13} />
                <span>Contact Support</span>
              </a>
            </div>
          </section>
        )}

        {/* ────────────────────────────────────────────────────────────
            SECTION: SEPARATE REGISTRATION PORTAL CALL-TO-ACTION
            (Never combines embedded form; routes to /event/:id/register)
        ──────────────────────────────────────────────────────────── */}
        <section
          id="register-cta"
          aria-labelledby="register-cta-heading"
          className="py-20 px-4 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800 text-center"
        >
          <div className="max-w-3xl mx-auto rounded-3xl bg-neutral-50 dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 shadow-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-black text-white dark:bg-white dark:text-black">
              <Rocket size={13} />
              <span>OFFICIAL REGISTRATION PORTAL</span>
            </div>

            <h2
              id="register-cta-heading"
              className="text-2xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight"
            >
              {isConcluded
                ? `${basic.title} — Registration Concluded`
                : isPending
                ? `${basic.title} — Registration Opens Soon`
                : `Ready to Compete in ${basic.title}?`}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              {isConcluded
                ? "The registration deadline has passed and this competition has concluded. You can still track your candidate pass or explore active arenas."
                : isPending
                ? `Registration officially opens on ${fmt(rO)}. Join the priority waitlist to be notified immediately when spots open.`
                : "Registration is hosted on our dedicated registration portal. Submit your squad details, verify developer credentials, and obtain your cryptographic entry pass."}
            </p>

            {/* Feature Highlights Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={14} className="text-black dark:text-white" />
                <span>DPDP Act 2023 Compliant</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-1.5">
                <Users size={14} className="text-black dark:text-white" />
                <span>
                  {team.allowSolo && team.allowTeam ? "Solo & Squad Entry" : team.allowSolo ? "Solo Entry" : "Squad Entry"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-1.5">
                <Shield size={14} className="text-black dark:text-white" />
                <span>Encrypted Entry Pass</span>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGoToRegistration}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>
                  {isConcluded
                    ? "View Registration Status"
                    : isPending
                    ? "Pre-Register / Waitlist"
                    : "Proceed to Registration Form"}
                </span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => navigate(`/event/${eventId}/track`)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Track Application</span>
                <ShieldCheck size={14} />
              </button>

              <button
                onClick={() => navigate("/event")}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-semibold text-xs transition cursor-pointer"
              >
                Back to All Events
              </button>
            </div>
          </div>
        </section>

        {/* SHARE & QR MODAL */}
        <AnimatePresence>
          {showShareModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            >
              <div
                className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 relative shadow-2xl text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute right-4 top-4 p-2 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition cursor-pointer"
                  aria-label="Close share modal"
                >
                  <X size={16} />
                </button>

                <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-1">
                  Share Challenge
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                  Invite your teammates or colleagues to register for {basic.title}.
                </p>

                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center mb-5">
                  <QRCodeSVG value={typeof window !== "undefined" ? window.location.href : ""} size={140} level="M" />
                  <span className="text-[11px] font-mono font-medium text-neutral-500 mt-2">
                    Scan with mobile camera
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 mb-5">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== "undefined" ? window.location.href : ""}
                    className="bg-transparent border-0 text-xs text-neutral-800 dark:text-neutral-200 px-2 flex-1 focus:outline-none font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Register for ${basic.title} on Soft Game Studio: ${typeof window !== "undefined" ? window.location.href : ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-center text-neutral-800 dark:text-neutral-200 transition block"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Check out ${basic.title} at Soft Game Studio: ${typeof window !== "undefined" ? window.location.href : ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-center text-neutral-800 dark:text-neutral-200 transition block"
                  >
                    Twitter / X
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-center text-neutral-800 dark:text-neutral-200 transition block"
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
