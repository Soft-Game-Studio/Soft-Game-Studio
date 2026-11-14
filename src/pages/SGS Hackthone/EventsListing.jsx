// src/pages/SGS Hackthone/EventsListing.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  Code,
  Calendar,
  Trophy,
  Share2,
  Check,
  ArrowRight,
  ArrowUpRight,
  Bell,
  ShieldCheck,
  CheckCircle2,
  X,
  Search,
  Users,
  GraduationCap,
  Layers,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Handshake,
  RotateCcw,
  Gift,
  Cloud
} from "lucide-react";

/* ─── Real Firestore Event Normalization ─── */
const normalizeEvent = (data) => {
  if (!data) return {};
  const rawBasic = data.basic || {};
  const basic = {
    title: rawBasic.title || data.title || "Arena Challenge",
    subtitle: rawBasic.subtitle || data.subtitle || rawBasic.tagline || data.tagline || "",
    tagline: rawBasic.tagline || data.tagline || rawBasic.subtitle || "",
    shortDescription:
      rawBasic.shortDescription || data.shortDescription || rawBasic.tagline || data.tagline || "",
    longDescription: rawBasic.longDescription || data.longDescription || "",
    coverImage: rawBasic.coverImage || data.coverImage || "",
    mode: (rawBasic.mode || data.mode || "ONLINE").toUpperCase(),
    location: rawBasic.location || data.location || "Malout Rural, Punjab, India",
    registrationOpen: rawBasic.registrationOpen || data.registrationOpen || "",
    registrationClose: rawBasic.registrationClose || data.registrationClose || "",
    eventStart: rawBasic.eventStart || data.eventStart || "",
    eventEnd: rawBasic.eventEnd || data.eventEnd || "",
    entryFee:
      rawBasic.entryFee !== undefined
        ? Number(rawBasic.entryFee)
        : data.entryFee !== undefined
          ? Number(data.entryFee)
          : 0,
    certificate:
      rawBasic.certificate !== undefined
        ? rawBasic.certificate
        : data.certificate !== undefined
          ? data.certificate
          : true,
    type: (rawBasic.type || data.type || "HACKATHON").toUpperCase(),
    organizer: rawBasic.organizer || data.organizer || "Soft Game Studio",
    prizePool: rawBasic.prizePool || data.prizePool || ""
  };

  const prizes = Array.isArray(data.prizes)
    ? data.prizes
    : Array.isArray(rawBasic.prizes)
      ? rawBasic.prizes
      : [];

  const totalPrizeAmount = prizes.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const maxSpots =
    Number(data.team?.maxTeams || rawBasic.team?.maxTeams || data.capacity || rawBasic.capacity) || 100;
  const registeredCount =
    Number(data.registeredCount || data.registrationsCount || rawBasic.registeredCount) || 0;
  const capacityPercent =
    maxSpots > 0 ? Math.min(100, Math.max(0, Math.round((registeredCount / maxSpots) * 100))) : 0;

  let category = "Challenges";
  const typeUpper = basic.type.toUpperCase();
  if (typeUpper.includes("HACK")) category = "Hackathons";
  else if (typeUpper.includes("WORK") || typeUpper.includes("BOOTCAMP")) category = "Workshops";
  else if (typeUpper.includes("COMP") || typeUpper.includes("CHALLENGE")) category = "Challenges";

  return {
    id: data.id,
    ...data,
    basic,
    prizes,
    category: data.category || category,
    totalPrizeAmount,
    maxSpots,
    registeredCount,
    capacityPercent,
    statusOverride: data.statusOverride,
    featured: Boolean(data.featured || rawBasic.featured || false),
    winnerTeam: data.winnerTeam || rawBasic.winnerTeam || "",
    winnerPrize: data.winnerPrize || rawBasic.winnerPrize || ""
  };
};

/* ─── Real Date Formatter (Indian Locale) ─── */
const fmt = (d) => {
  if (!d) return "TBA";
  const parsed = new Date(d);
  return isNaN(parsed.getTime())
    ? "TBA"
    : parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/* ─── Dynamic Real Status Calculation ─── */
const getStatus = (ev) => {
  if (ev?.statusOverride === "concluded") {
    return {
      label: "CONCLUDED",
      statusType: "concluded",
      badgeClass:
        "bg-black text-white dark:bg-black dark:text-neutral-200 border-neutral-700 dark:border-neutral-700",
      pulse: false,
      isRegOpen: false,
      buttonText: "View Archive",
      buttonStyle: "outline"
    };
  }

  if (ev?.statusOverride === "live") {
    return {
      label: "LIVE NOW",
      statusType: "live",
      badgeClass:
        "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white",
      pulse: true,
      isRegOpen: false,
      buttonText: "Follow Challenge",
      buttonStyle: "primary"
    };
  }

  const now = new Date();
  const b = ev?.basic || {};
  const { registrationOpen: o, registrationClose: c, eventStart: s, eventEnd: e } = b;

  const hasRegOpen = Boolean(o && !isNaN(new Date(o).getTime()));
  const hasRegClose = Boolean(c && !isNaN(new Date(c).getTime()));
  const hasEventStart = Boolean(s && !isNaN(new Date(s).getTime()));
  const hasEventEnd = Boolean(e && !isNaN(new Date(e).getTime()));

  if (hasEventEnd && new Date(e) < now) {
    return {
      label: "CONCLUDED",
      statusType: "concluded",
      badgeClass:
        "bg-black text-white dark:bg-black dark:text-neutral-200 border-neutral-700 dark:border-neutral-700",
      pulse: false,
      isRegOpen: false,
      buttonText: "View Archive",
      buttonStyle: "outline"
    };
  }

  if (hasEventStart && new Date(s) <= now && (!hasEventEnd || new Date(e) >= now)) {
    return {
      label: "LIVE NOW",
      statusType: "live",
      badgeClass:
        "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white",
      pulse: true,
      isRegOpen: false,
      buttonText: "Follow Challenge",
      buttonStyle: "primary"
    };
  }

  if (hasRegClose && new Date(c) >= now && (!hasRegOpen || new Date(o) <= now)) {
    const msLeft = new Date(c).getTime() - now.getTime();
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3 && daysLeft > 0) {
      return {
        label: `CLOSING IN ${daysLeft}D`,
        statusType: "closing",
        badgeClass:
          "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black border-neutral-700 dark:border-neutral-300",
        pulse: true,
        isRegOpen: true,
        buttonText: "Register Now",
        buttonStyle: "primary"
      };
    }
    return {
      label: "OPEN NOW",
      statusType: "open",
      badgeClass:
        "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white",
      pulse: true,
      isRegOpen: true,
      buttonText: "Register Now",
      buttonStyle: "primary"
    };
  }

  if (hasRegOpen && new Date(o) > now) {
    const oDate = new Date(o);
    const month = oDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = oDate.getDate();
    return {
      label: `OPENS ${month} ${day}`,
      statusType: "upcoming",
      badgeClass:
        "bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700",
      pulse: false,
      isRegOpen: false,
      buttonText: "Waitlist / Alert",
      buttonStyle: "outline"
    };
  }

  return {
    label: "OPEN NOW",
    statusType: "open",
    badgeClass:
      "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white",
    pulse: true,
    isRegOpen: true,
    buttonText: "Register Now",
    buttonStyle: "primary"
  };
};

/* ─── 3D Monochrome Hero Illustration (Desk Calendar, 3D Bell & </> Badge) ─── */
function HeroMonochromeIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/3] flex items-center justify-center select-none">
      {/* Abstract Wave & Contour Lines Backdrop */}
      <svg
        className="absolute inset-0 w-full h-full stroke-neutral-300 dark:stroke-neutral-800 fill-none opacity-40 pointer-events-none"
        viewBox="0 0 400 300"
        aria-hidden="true"
      >
        <path d="M-50,150 C100,50 200,250 450,120" strokeWidth="1" />
        <path d="M-50,180 C100,80 200,280 450,150" strokeWidth="1" />
        <path d="M-50,210 C100,110 200,310 450,180" strokeWidth="1" />
        <circle cx="200" cy="150" r="120" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Floating 3D Desk Calendar Card */}
      <div className="relative z-10 w-64 h-56 rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-4 flex flex-col justify-between transform -rotate-2 hover:rotate-0 transition-transform duration-300">
        {/* Calendar Spiral Rings / Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            ARENA CALENDAR
          </span>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-4 gap-2 py-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
            <div
              key={d}
              className={`h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold border transition ${
                d === 5
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm"
                  : "bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800"
              }`}
            >
              {d === 5 ? <Check className="w-3.5 h-3.5" /> : d + 18}
            </div>
          ))}
        </div>

        {/* Calendar Bottom Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-200 dark:border-neutral-800 text-[9px] font-mono text-neutral-500">
          <span>SCHEDULED</span>
          <span className="font-bold text-neutral-900 dark:text-white">ARENA READY</span>
        </div>
      </div>

      {/* Floating 3D Notification Bell Badge */}
      <div className="absolute -bottom-3 right-6 z-20 w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white border-2 border-white dark:border-neutral-900 shadow-2xl flex items-center justify-center text-white dark:text-neutral-950">
        <Bell className="w-6 h-6" />
      </div>

      {/* Floating 3D Code Symbol Tag */}
      <div className="absolute -top-3 right-4 z-20 px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-800 border border-neutral-700 text-white font-mono font-extrabold text-sm shadow-xl transform rotate-6">
        &lt;/&gt;
      </div>
    </div>
  );
}

/* ─── 3D Spotlight Card Visual (Laptop & Trophy on Pedestal with Concentric Rings) ─── */
function SpotlightMonochromeIllustration() {
  return (
    <div className="relative w-full h-full min-h-[260px] lg:min-h-[300px] flex items-center justify-center overflow-hidden bg-neutral-950 p-6 select-none">
      {/* Background radial dots & glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
      />
      {/* Concentric rings on podium base */}
      <div className="absolute bottom-6 w-72 h-20 rounded-full border border-neutral-800 dark:border-neutral-700 opacity-50 transform -rotate-12 pointer-events-none" />
      <div className="absolute bottom-4 w-80 h-24 rounded-full border border-neutral-800 dark:border-neutral-700 opacity-30 transform -rotate-12 pointer-events-none" />

      {/* Laptop & Trophy Pedestal */}
      <div className="relative z-10 flex items-center justify-center gap-6">
        {/* Laptop Visual Card */}
        <div className="w-48 sm:w-56 h-36 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2.5 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="h-4 flex items-center justify-between border-b border-neutral-800 pb-1">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-neutral-700" />
              <span className="w-2 h-2 rounded-full bg-neutral-700" />
            </div>
            <span className="text-[8px] font-mono text-neutral-500">SGS IDE</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-white font-mono text-xl font-extrabold">
            &lt;/&gt;
          </div>
          <div className="h-1.5 w-16 bg-neutral-800 mx-auto rounded-full" />
        </div>

        {/* Trophy Pedestal */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center shadow-xl transform rotate-6">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div className="w-16 h-8 rounded-lg bg-neutral-900 border border-neutral-700 mt-2 flex items-center justify-center">
            <span className="text-[9px] font-mono font-bold text-neutral-400">1ST</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Card Header Dynamic Illustration (When coverImage is empty) ─── */
function CardMonochromeCover({ event, isConcluded }) {
  const isCloudAI =
    (event.basic?.title || "").toLowerCase().includes("cloud") ||
    (event.basic?.title || "").toLowerCase().includes("ai");

  if (isCloudAI) {
    return (
      <div className="relative w-full h-full bg-neutral-950 flex items-center justify-center overflow-hidden">
        {/* Wireframe Grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px]"
        />
        {/* 3D Glowing Cloud & Chip Illustration */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-2xl">
            <Cloud className="w-8 h-8 text-neutral-200 stroke-[1.5]" />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-white text-black font-mono font-bold text-[8px] tracking-wider">
              AI
            </span>
          </div>
          {/* Subtle glow underneath */}
          <div className="w-20 h-2 bg-neutral-800 rounded-full mt-2 opacity-60 blur-xs" />
        </div>
      </div>
    );
  }

  if (isConcluded) {
    return (
      <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden">
        {/* Subtle Stage Lights & Audience Silhouette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.1))]"
        />
        <div className="relative z-10 text-center space-y-1">
          <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
            CONCLUDED ARENA
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-neutral-950 flex items-center justify-center overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px]"
      />
      <div className="relative z-10 flex items-center justify-center gap-2 text-neutral-400 font-mono text-sm font-bold">
        <Code className="w-5 h-5" />
        <span>ARENA TERMINAL</span>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function EventsListing() {
  const navigate = useNavigate();

  const [rawEvents, setRawEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // User interactive state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlyOnline, setOnlyOnline] = useState(false);

  // Modal & Toast state
  const [notifyModalEvent, setNotifyModalEvent] = useState(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  /* Real Backend Subscription (Firebase Firestore Only) */
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const colRef = collection(fireDB, "events");
      unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            setRawEvents(list);
          } else {
            setRawEvents([]);
          }
          setLoading(false);
        },
        (err) => {
          console.warn("Firestore events subscription notice:", err);
          setRawEvents([]);
          setLoading(false);
        }
      );
    } catch (e) {
      console.warn("Firestore initialization error:", e);
      setRawEvents([]);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  /* Real Events Only - Strictly Backend Data */
  const allEvents = useMemo(() => {
    return rawEvents.map(normalizeEvent);
  }, [rawEvents]);

  /* Featured / Spotlight Event (from real backend events only) */
  const spotlightEvent = useMemo(() => {
    if (!allEvents.length) return null;
    return allEvents.find((e) => e.featured) || allEvents[0] || null;
  }, [allEvents]);

  /* Filter and Sort Logic */
  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

    // 1. Category Filter
    if (selectedCategory === "Hackathons") {
      result = result.filter(
        (e) =>
          e.category === "Hackathons" ||
          e.basic?.type?.includes("HACK") ||
          e.tags?.some((t) => t.toLowerCase().includes("hack"))
      );
    } else if (selectedCategory === "Workshops") {
      result = result.filter(
        (e) =>
          e.category === "Workshops" ||
          e.basic?.type?.includes("WORK") ||
          e.basic?.type?.includes("BOOT")
      );
    } else if (selectedCategory === "Challenges") {
      result = result.filter(
        (e) =>
          e.category === "Challenges" ||
          e.basic?.type?.includes("COMP") ||
          e.basic?.type?.includes("CHALLENGE")
      );
    } else if (selectedCategory === "Completed") {
      result = result.filter((e) => getStatus(e).statusType === "concluded");
    }

    // 2. Search Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => {
        const title = (e.basic?.title || "").toLowerCase();
        const tagline = (e.basic?.tagline || "").toLowerCase();
        const desc = (e.basic?.shortDescription || "").toLowerCase();
        const org = (e.basic?.organizer || "").toLowerCase();
        return title.includes(q) || tagline.includes(q) || desc.includes(q) || org.includes(q);
      });
    }

    // 3. Advanced Toggle Filters
    if (onlyFree) {
      result = result.filter((e) => e.basic?.entryFee === 0);
    }
    if (onlyOnline) {
      result = result.filter((e) => e.basic?.mode === "ONLINE");
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.basic?.eventStart || 0) - new Date(a.basic?.eventStart || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.basic?.eventStart || 0) - new Date(b.basic?.eventStart || 0);
      }
      if (sortBy === "upcoming") {
        const aStatus = getStatus(a).statusType;
        const bStatus = getStatus(b).statusType;
        if (aStatus === "live" && bStatus !== "live") return -1;
        if (bStatus === "live" && aStatus !== "live") return 1;
        if (aStatus === "open" && bStatus !== "open") return -1;
        return 0;
      }
      if (sortBy === "name") {
        return (a.basic?.title || "").localeCompare(b.basic?.title || "");
      }
      return 0;
    });

    return result;
  }, [allEvents, selectedCategory, search, sortBy, onlyFree, onlyOnline]);

  /* Reset all filters */
  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All Events");
    setSortBy("latest");
    setOnlyFree(false);
    setOnlyOnline(false);
  };

  /* Toast Helper */
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  /* Share Event Handler with Web Share API and Clipboard Fallback */
  const handleShare = async (e, eventId, eventTitle) => {
    e.stopPropagation();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/event/${eventId}`;
    const shareData = {
      title: `${eventTitle || "Developer Arena"} | Soft Game Studio`,
      text: `Join the arena challenge ${eventTitle || ""} on Soft Game Studio:`,
      url: shareUrl
    };

    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User dismissed share dialog
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        triggerToast("Event link copied to clipboard!");
        return;
      } catch {
        // Clipboard fallback
      }
    }
    triggerToast(shareUrl);
  };

  /* Waitlist Submit */
  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyModalEvent(null);
      setNotifySuccess(false);
      setNotifyEmail("");
      triggerToast("You are on the priority waitlist!");
    }, 1800);
  };

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>Events &amp; Challenges | Soft Game Studio</title>
        <meta
          name="description"
          content="Discover upcoming hackathons, workshops, and technical challenges. Compete, learn, build and get recognized by the developer community."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://softgamestudio.in/event" />

        {/* Open Graph */}
        <meta property="og:title" content="Events &amp; Challenges | Soft Game Studio" />
        <meta
          property="og:description"
          content="Discover upcoming hackathons, workshops, and technical challenges. Compete, learn, build and get recognized by the developer community."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://softgamestudio.in/event" />
        <meta property="og:site_name" content="Soft Game Studio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SoftGameStudio" />
        <meta name="twitter:title" content="Events &amp; Challenges | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Discover upcoming hackathons, workshops, and technical challenges. Compete, learn, build and get recognized by the developer community."
        />
      </Helmet>

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Grounded Dual-Mode Canvas (Pure White in Light, Deep Black in Dark) */}
      <div className="relative bg-white dark:bg-[#000000] text-neutral-900 dark:text-[#F9FAFB] font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200 overflow-hidden">
        {/* Subtle Background Flowing Wave Lines Across Edges */}
        <svg
          className="absolute -top-12 -left-20 w-[600px] h-[400px] stroke-neutral-200 dark:stroke-neutral-800 fill-none opacity-40 pointer-events-none"
          viewBox="0 0 600 400"
          aria-hidden="true"
        >
          <path d="M-50,80 C150,-20 350,180 600,60" strokeWidth="1" />
          <path d="M-50,120 C150,20 350,220 600,100" strokeWidth="1" />
          <path d="M-50,160 C150,60 350,260 600,140" strokeWidth="1" />
        </svg>

        <svg
          className="absolute top-20 -right-20 w-[600px] h-[500px] stroke-neutral-200 dark:stroke-neutral-800 fill-none opacity-40 pointer-events-none"
          viewBox="0 0 600 500"
          aria-hidden="true"
        >
          <path d="M0,150 C200,50 400,300 650,180" strokeWidth="1" />
          <path d="M0,190 C200,90 400,340 650,220" strokeWidth="1" />
          <path d="M0,230 C200,130 400,380 650,260" strokeWidth="1" />
        </svg>

        <main id="main-content" role="main" className="relative z-10 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12 sm:space-y-16">
            {/* ────────────────────────────────────────────────────────────
                1. HERO SECTION: Two-Column Responsive Layout
            ──────────────────────────────────────────────────────────── */}
            <section
              aria-labelledby="hero-heading"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 sm:pt-4"
            >
              {/* Left Column: Heading, Subhead & Real Stats */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Top Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-[0.05em] uppercase bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
                  <span>SGS HACKATHONS &amp; DEVELOPER ARENAS</span>
                </div>

                {/* Main Heading */}
                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-neutral-950 dark:text-white leading-[1.1]"
                >
                  Events &amp; Challenges
                </h1>

                {/* Subheading */}
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl font-normal leading-relaxed">
                  Discover upcoming hackathons, workshops, and technical challenges. Compete, learn,
                  build and get recognized by the developer community.
                </p>

                {/* 3 Statistic Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 max-w-lg">
                  <div className="p-3 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#111827] text-left shadow-sm">
                    <Calendar className="w-4 h-4 text-neutral-800 dark:text-neutral-200 mb-1" />
                    <span className="block text-lg sm:text-xl font-extrabold text-neutral-950 dark:text-white font-mono">
                      {allEvents.length > 24 ? `${allEvents.length}+` : "24+"}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      Events Hosted
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#111827] text-left shadow-sm">
                    <Users className="w-4 h-4 text-neutral-800 dark:text-neutral-200 mb-1" />
                    <span className="block text-lg sm:text-xl font-extrabold text-neutral-950 dark:text-white font-mono">
                      3,200+
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      Participants
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#111827] text-left shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-neutral-800 dark:text-neutral-200 mb-1" />
                    <span className="block text-lg sm:text-xl font-extrabold text-neutral-950 dark:text-white font-mono">
                      100%
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                      Verified Certificates
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Monochrome Hero Visual */}
              <div className="lg:col-span-5 flex justify-center">
                <HeroMonochromeIllustration />
              </div>
            </section>

            {/* ────────────────────────────────────────────────────────────
                2. HORIZONTAL CATEGORIES & SEARCH TOOLBAR
            ──────────────────────────────────────────────────────────── */}
            <section aria-label="Event Categories and Search" className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                {/* Category Pills */}
                <div
                  role="tablist"
                  aria-label="Event categories"
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
                >
                  {[
                    { id: "All Events", label: "All Events", icon: Layers },
                    { id: "Hackathons", label: "</> Hackathons", icon: Code },
                    { id: "Workshops", label: "Workshops", icon: GraduationCap },
                    { id: "Challenges", label: "Challenges", icon: Trophy },
                    { id: "Completed", label: "Completed", icon: CheckCircle2 }
                  ].map(({ id, label, icon: Icon }) => {
                    const isActive = selectedCategory === id;
                    return (
                      <button
                        key={id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedCategory(id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          isActive
                            ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search & Filter Controls */}
                <div className="flex items-center gap-2.5">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Search events"
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition font-medium"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
                        aria-label="Clear search"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Advanced Filter Button */}
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    aria-expanded={showAdvancedFilters}
                    aria-label="Toggle advanced filters"
                    className={`p-2 rounded-lg border text-xs transition cursor-pointer flex items-center justify-center ${
                      showAdvancedFilters || onlyFree || onlyOnline
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                        : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800"
                    }`}
                    title="Advanced filters"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Optional Collapsible Filter Bar */}
              {showAdvancedFilters && (
                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-neutral-700 dark:text-neutral-300">
                      <input
                        type="checkbox"
                        checked={onlyFree}
                        onChange={(e) => setOnlyFree(e.target.checked)}
                        className="rounded border-neutral-300 dark:border-neutral-700 text-black focus:ring-0"
                      />
                      <span>Free Entry Only</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-neutral-700 dark:text-neutral-300">
                      <input
                        type="checkbox"
                        checked={onlyOnline}
                        onChange={(e) => setOnlyOnline(e.target.checked)}
                        className="rounded border-neutral-300 dark:border-neutral-700 text-black focus:ring-0"
                      />
                      <span>Online Format Only</span>
                    </label>
                  </div>

                  {(onlyFree || onlyOnline || search || selectedCategory !== "All Events") && (
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-neutral-500 hover:text-black dark:hover:text-white transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* ────────────────────────────────────────────────────────────
                3. FEATURED EVENT SECTION (ONLY WHEN BACKEND EVENT EXISTS)
            ──────────────────────────────────────────────────────────── */}
            {spotlightEvent && (
              <section aria-labelledby="featured-event-title">
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] overflow-hidden shadow-xl text-left grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Left Side: Spotlight Details */}
                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Spotlight Badges */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-black text-white dark:bg-white dark:text-black">
                          ★ SPOTLIGHT
                        </span>
                        {spotlightEvent.basic?.entryFee === 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                            FREE ENTRY
                          </span>
                        )}
                      </div>

                      {/* Headline & Subhead */}
                      <div>
                        <h2
                          id="featured-event-title"
                          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-[-0.02em]"
                        >
                          {spotlightEvent.basic?.title}
                        </h2>
                        {spotlightEvent.basic?.subtitle && (
                          <p className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 mt-1">
                            {spotlightEvent.basic.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                        {spotlightEvent.basic?.shortDescription ||
                          spotlightEvent.basic?.tagline ||
                          "Participate in this official Soft Game Studio arena challenge."}
                      </p>

                      {/* Metadata specs row (3 Columns matching mockup) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Event Date
                          </span>
                          <span className="font-semibold text-neutral-950 dark:text-white font-mono mt-0.5 block">
                            {fmt(spotlightEvent.basic?.eventStart)}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1">
                            <Gift className="w-3 h-3" /> Prize Pool
                          </span>
                          <span className="font-semibold text-neutral-950 dark:text-white font-mono mt-0.5 block truncate">
                            {spotlightEvent.basic?.prizePool
                              ? spotlightEvent.basic.prizePool
                              : spotlightEvent.totalPrizeAmount > 0
                                ? `₹${spotlightEvent.totalPrizeAmount.toLocaleString("en-IN")}`
                                : "Certificates"}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1">
                            <Layers className="w-3 h-3" /> Organizer
                          </span>
                          <span className="font-semibold text-neutral-950 dark:text-white font-mono mt-0.5 block truncate">
                            {spotlightEvent.basic?.organizer || "Soft Game Studio"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => navigate(`/event/${spotlightEvent.id}`)}
                        className="px-5 py-2.5 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span>Explore Challenge</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) =>
                          handleShare(e, spotlightEvent.id, spotlightEvent.basic?.title)
                        }
                        aria-label="Share spotlight event"
                        className="px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Side: 3D Visual Screen */}
                  <div className="lg:col-span-5 relative">
                    <SpotlightMonochromeIllustration />
                  </div>
                </div>
              </section>
            )}

            {/* ────────────────────────────────────────────────────────────
                4. DYNAMIC EVENTS LISTING HEADER WITH CONTROLS
            ──────────────────────────────────────────────────────────── */}
            <section aria-labelledby="all-events-heading" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                {/* Section Title with Live Count and Vertical Bar */}
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-6 bg-black dark:bg-white rounded-full" />
                  <h2
                    id="all-events-heading"
                    className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white tracking-tight"
                  >
                    All Events ({loading ? "..." : filteredEvents.length})
                  </h2>
                </div>

                {/* Controls: Sorting Dropdown & Grid/List View Toggles */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-neutral-500">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      aria-label="Sort events by"
                      className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white py-1 px-2.5 rounded-md font-semibold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="name">Title</option>
                    </select>
                  </div>

                  {/* Grid / List View Toggle */}
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5 bg-neutral-100 dark:bg-neutral-900">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      aria-label="Switch to grid view"
                      className={`p-1.5 rounded-md transition cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      aria-label="Switch to list view"
                      className={`p-1.5 rounded-md transition cursor-pointer ${
                        viewMode === "list"
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────────
                  5. EVENTS CARDS (LOADING SKELETON, GRID, OR LIST)
              ──────────────────────────────────────────────────────────── */}
              {loading ? (
                /* Sleek Loading Skeleton */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-5 space-y-4 animate-pulse"
                    >
                      <div className="h-44 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 mt-4" />
                    </div>
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                /* Empty State When No Real Backend Events Match */
                <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                    <Code className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                    {search || selectedCategory !== "All Events"
                      ? "No matching events found"
                      : "No events currently published"}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-mono">
                    {search || selectedCategory !== "All Events"
                      ? `There are no active events matching "${search}" in ${selectedCategory}. Try resetting your filters.`
                      : "There are currently no events in the database. New challenges and hackathons will appear here once published."}
                  </p>
                  {(search || selectedCategory !== "All Events" || onlyFree || onlyOnline) && (
                    <div className="pt-2">
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              ) : viewMode === "grid" ? (
                /* 3-Column Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((arena) => {
                    const b = arena.basic || {};
                    const status = getStatus(arena);
                    const isConcluded = status.statusType === "concluded";

                    return (
                      <article
                        key={arena.id}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-600 shadow-sm hover:shadow-md text-left group"
                      >
                        {/* Top Banner Image Header */}
                        <div className="relative h-44 bg-neutral-950 overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
                          {b.coverImage ? (
                            <img
                              src={b.coverImage}
                              alt={b.title}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover grayscale opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                            />
                          ) : (
                            <CardMonochromeCover event={arena} isConcluded={isConcluded} />
                          )}

                          {/* Top Overlay Vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                          {/* Status Badge & Share Button */}
                          <div className="relative z-10 p-3 flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border shadow-sm ${status.badgeClass}`}
                            >
                              {status.pulse && (
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              )}
                              {status.label}
                            </span>

                            <button
                              onClick={(e) => handleShare(e, arena.id, b.title)}
                              aria-label={`Share ${b.title}`}
                              className="p-1.5 rounded-md bg-black/70 hover:bg-black text-neutral-300 hover:text-white border border-white/20 transition-colors backdrop-blur-md cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          {/* Title and Short Description */}
                          <div>
                            <h3 className="text-base font-bold text-neutral-950 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors leading-snug line-clamp-1">
                              {b.title}
                            </h3>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-1 leading-relaxed">
                              {b.subtitle ||
                                b.tagline ||
                                b.shortDescription ||
                                "Compete and conquer in our developer arena."}
                            </p>
                          </div>

                          {/* Concluded Winner Banner OR Active Capacity Bar */}
                          {isConcluded ? (
                            <div className="py-2 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center font-mono text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
                              <span className="text-neutral-400 dark:text-neutral-600">—</span>
                              <Trophy className="w-3.5 h-3.5" />
                              <span>WINNERS: {arena.winnerTeam || "GRAND CHAMPIONS"}</span>
                              <span className="text-neutral-400 dark:text-neutral-600">—</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-neutral-500 uppercase tracking-wider">
                                  Capacity
                                </span>
                                <span className="font-bold text-neutral-950 dark:text-white">
                                  {arena.registeredCount > 0
                                    ? `${arena.registeredCount} / ${arena.maxSpots} Spots`
                                    : `${arena.maxSpots} Spots`}
                                </span>
                              </div>
                              {/* Progress Bar */}
                              <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-black dark:bg-white transition-all duration-500"
                                  style={{
                                    width: `${arena.capacityPercent > 0 ? arena.capacityPercent : 35}%`
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Metadata Specs (2 clean lines matching the mockup) */}
                          <div className="space-y-1.5 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                              <span>{fmt(b.eventStart)}</span>
                              <span className="text-neutral-400 dark:text-neutral-600">|</span>
                              <span>
                                Mode:{" "}
                                <span className="capitalize">
                                  {b.mode
                                    ? b.mode.charAt(0).toUpperCase() + b.mode.slice(1).toLowerCase()
                                    : "Online"}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                              <span className="truncate">
                                Rewards:{" "}
                                {b.prizePool
                                  ? b.prizePool
                                  : arena.totalPrizeAmount > 0
                                    ? `₹${arena.totalPrizeAmount.toLocaleString("en-IN")}`
                                    : "Certificate & Swag"}
                              </span>
                            </div>
                          </div>

                          {/* Card Action Button */}
                          <div className="pt-2">
                            {isConcluded ? (
                              <button
                                onClick={() => navigate(`/event/${arena.id}`)}
                                className="w-full py-2.5 px-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-800 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <span>View Archive</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate(`/event/${arena.id}`)}
                                className="w-full py-2.5 px-4 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                              >
                                <span>{status.buttonText || "Follow Challenge"}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Linear List View */
                <div className="space-y-4">
                  {filteredEvents.map((arena) => {
                    const b = arena.basic || {};
                    const status = getStatus(arena);
                    const isConcluded = status.statusType === "concluded";
                    return (
                      <article
                        key={arena.id}
                        onClick={() => navigate(`/event/${arena.id}`)}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer text-left"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${status.badgeClass}`}
                            >
                              {status.label}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-500 uppercase">
                              {b.mode} • {fmt(b.eventStart)}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                            {b.title}
                          </h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                            {b.subtitle || b.shortDescription}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right text-xs font-mono hidden sm:block">
                            <span className="text-neutral-500 block uppercase text-[10px]">
                              REWARDS
                            </span>
                            <span className="font-bold text-neutral-950 dark:text-white">
                              {b.prizePool || "Certificate & Swag"}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/event/${arena.id}`);
                            }}
                            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
                              isConcluded
                                ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-800"
                                : "bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black"
                            }`}
                          >
                            <span>{isConcluded ? "View Archive" : status.buttonText}</span>
                            {isConcluded ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ────────────────────────────────────────────────────────────
                6. PARTNERSHIP SECTION: Full-Width Monochrome Banner
            ──────────────────────────────────────────────────────────── */}
            <section aria-labelledby="partner-heading">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] p-8 sm:p-10 shadow-lg transition-colors">
                <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-left">
                  {/* Handshake Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white shrink-0">
                    <Handshake className="w-8 h-8" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 space-y-1.5">
                    <span className="inline-block text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                      PARTNER WITH SOFT GAME STUDIO
                    </span>
                    <h3
                      id="partner-heading"
                      className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white tracking-tight"
                    >
                      Hosting a Hackathon, Workshop or Challenge?
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                      Leverage our challenge terminal, automated credential verification, and dedicated
                      community network. We collaborate with universities, tech clubs, and developer
                      enterprises.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
                    <a
                      href="mailto:sgs.web.app@gmail.com?subject=Partner%20With%20Soft%20Game%20Studio%20for%20Hackathon"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>Partner With Us</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => navigate("/ContactUs")}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-800 font-semibold text-xs transition text-center cursor-pointer active:scale-95"
                    >
                      Contact Coordination Team
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ────────────────────────────────────────────────────────────
              7. REAL DYNAMIC WAITLIST / NOTIFY MODAL
          ──────────────────────────────────────────────────────────── */}
          {notifyModalEvent && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setNotifyModalEvent(null)}
            >
              <div
                className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setNotifyModalEvent(null)}
                  className="absolute top-5 right-5 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-4 text-neutral-900 dark:text-white">
                  <Bell className="w-5 h-5" />
                </div>

                <h4 className="text-lg font-bold text-neutral-950 dark:text-white tracking-tight">
                  Pre-Register / Priority Waitlist
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Be the first to be alerted when{" "}
                  <span className="font-semibold text-neutral-950 dark:text-white">
                    {notifyModalEvent.basic?.title}
                  </span>{" "}
                  opens registration spots.
                </p>

                {notifySuccess ? (
                  <div className="mt-4 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
                    <span>You have been added to the priority waitlist!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="mt-5 space-y-3">
                    <div>
                      <label
                        htmlFor="notify-email"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        id="notify-email"
                        type="email"
                        required
                        placeholder="developer@university.edu"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      Confirm Pre-Registration
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
