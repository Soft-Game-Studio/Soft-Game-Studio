// src/pages/SGS Hackthone/RegistrationTracker.jsx
// Production-grade Candidate Registration & Progress Tracking Terminal
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { useAuth } from "../../AuthProvide";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Key,
  FileText,
  Lock,
  RefreshCw,
  Trophy,
  ExternalLink,
  Sparkles,
  QrCode,
  Compass,
  Terminal,
  ChevronRight,
  Layers
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function RegistrationTracker() {
  const { id: paramId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Search Input State
  const initialQuery = searchParams.get("id") || paramId || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Result state (Current user registrations only)
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [activeRegistration, setActiveRegistration] = useState(null);
  const [fetchingRegistrations, setFetchingRegistrations] = useState(true);

  // Copy feedback state
  const [copiedField, setCopiedField] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  /* Toast Notification Trigger */
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  /* Copy to Clipboard Helper */
  const handleCopy = async (text, fieldName) => {
    if (!text) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        triggerToast(`${fieldName} copied to clipboard!`);
        setTimeout(() => setCopiedField(null), 2000);
      }
    } catch {
      triggerToast(text);
    }
  };

  /* Fetch strictly Current User's Registrations from Firebase Firestore (NO localStorage) */
  const fetchMyRegistrations = useCallback(async () => {
    if (!user) {
      setFetchingRegistrations(false);
      return;
    }

    setFetchingRegistrations(true);
    setErrorMsg("");

    try {
      const colRef = collection(fireDB, "event_registrations");
      const list = [];

      // 1. Fetch by logged-in User UID
      const qUser = query(colRef, where("userId", "==", user.uid));
      const snapUser = await getDocs(qUser);
      snapUser.forEach((d) => list.push({ docId: d.id, ...d.data() }));

      // 2. Fallback: also fetch by User Email if any past doc was saved without UID
      if (user.email) {
        const qEmail = query(colRef, where("email", "==", user.email.toLowerCase()));
        const snapEmail = await getDocs(qEmail);
        snapEmail.forEach((d) => {
          if (!list.some((existing) => existing.docId === d.id)) {
            list.push({ docId: d.id, ...d.data() });
          }
        });
      }

      setUserRegistrations(list);

      // Select active registration based on paramId or initial query
      if (list.length > 0) {
        let selected = null;
        if (paramId) {
          selected = list.find((r) => r.eventId === paramId || r.candidateId === paramId);
        }
        if (!selected && initialQuery) {
          selected = list.find(
            (r) =>
              (r.candidateId && r.candidateId.toLowerCase() === initialQuery.toLowerCase()) ||
              (r.eventId && r.eventId.toLowerCase() === initialQuery.toLowerCase())
          );
        }
        setActiveRegistration(selected || list[0]);
      } else {
        setActiveRegistration(null);
      }
    } catch (err) {
      console.error("Firestore user registrations fetch error:", err);
      setErrorMsg("Unable to retrieve your registrations. Please check your network connection.");
    } finally {
      setFetchingRegistrations(false);
    }
  }, [user, paramId, initialQuery]);

  useEffect(() => {
    fetchMyRegistrations();
  }, [fetchMyRegistrations]);

  /* Filter or search within current user's registrations */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchInput.trim().toLowerCase();
    if (!q) {
      if (userRegistrations.length > 0) setActiveRegistration(userRegistrations[0]);
      return;
    }

    const matched = userRegistrations.find(
      (r) =>
        (r.candidateId && r.candidateId.toLowerCase().includes(q)) ||
        (r.eventTitle && r.eventTitle.toLowerCase().includes(q)) ||
        (r.eventId && r.eventId.toLowerCase().includes(q))
    );

    if (matched) {
      setActiveRegistration(matched);
      setErrorMsg("");
      setSearchParams({ id: matched.candidateId });
    } else {
      setErrorMsg(`No challenge registration matching "${searchInput}" found for your account.`);
    }
  };

  /* Print Handler (Targets #sgs-print-pass-card only) */
  const handlePrintCard = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  /* Calculate Status Stage & Percent */
  const statusInfo = useMemo(() => {
    if (!activeRegistration) return null;
    const rawStatus = (activeRegistration.status || "SUBMITTED").toUpperCase();
    const rawStep = Number(activeRegistration.statusStep) || 1;

    let stage = 1;
    let percent = 25;
    let label = "APPLICATION SUBMITTED";
    let badgeStyle = "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100";
    let description =
      "Your registration has been securely received by our database and is queued for verification.";

    if (rawStatus === "CONFIRMED" || rawStatus === "APPROVED" || rawStep >= 4) {
      stage = 4;
      percent = 100;
      label = "CONFIRMED & ARENA SEAT ALLOCATED";
      badgeStyle = "bg-black text-white dark:bg-white dark:text-black shadow-sm";
      description =
        "All credentials verified! Your seat and Arena Terminal access are officially confirmed.";
    } else if (rawStatus === "SELECTED" || rawStatus === "SHORTLISTED" || rawStep === 3) {
      stage = 3;
      percent = 75;
      label = "SELECTED / SHORTLISTED FOR ROUND 1";
      badgeStyle = "bg-black text-white dark:bg-white dark:text-black";
      description =
        "Congratulations! Your profile has been screened and selected for the Round 1 challenge.";
    } else if (rawStatus === "UNDER_REVIEW" || rawStatus === "VERIFYING" || rawStep === 2) {
      stage = 2;
      percent = 50;
      label = "CREDENTIALS & SQUAD UNDER SCREENING";
      badgeStyle = "bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-200";
      description =
        "Our coordination team and automated anti-bot checks are currently verifying student affiliation and roster details.";
    } else if (rawStatus === "REJECTED") {
      stage = 1;
      percent = 100;
      label = "APPLICATION NOT ACCEPTED";
      badgeStyle = "bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100";
      description =
        "The submission could not be verified or the arena reached capacity. Check your email for details.";
    }

    return { stage, percent, label, badgeStyle, description };
  }, [activeRegistration]);

  /* Format Firestore Timestamp */
  const fmtDate = (val) => {
    if (!val) return "Recorded in System";
    try {
      if (val.toDate && typeof val.toDate === "function") {
        return val.toDate().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    } catch {
      // fallback
    }
    return String(val);
  };

  return (
    <Layout>
      <Helmet>
        <html lang="en" />
        <title>Track Registration &amp; Progress | Soft Game Studio</title>
        <meta
          name="description"
          content="Track your hackathon and arena challenge registration status, selection progress, credentials, and verified QR pass on Soft Game Studio."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Embedded High-Precision Print Stylesheet */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 8mm;
          }
          body {
            visibility: hidden !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          #sgs-print-pass-card, #sgs-print-pass-card * {
            visibility: visible !important;
          }
          #sgs-print-pass-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 100% !important;
            max-width: 90mm !important;
            border: 2px solid #000000 !important;
            border-radius: 12px !important;
            padding: 16px !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
          .no-print, header, footer, nav, button {
            display: none !important;
          }
        }
      `}</style>

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Grounded Dual-Mode Canvas (Pure White in Light, Deep Black in Dark) */}
      <div className="relative bg-white dark:bg-[#000000] text-neutral-900 dark:text-[#F9FAFB] font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200 overflow-hidden pb-24">
        {/* Background Flowing Wave Lines */}
        <svg
          className="absolute -top-12 -left-20 w-[600px] h-[400px] stroke-neutral-200 dark:stroke-neutral-800 fill-none opacity-40 pointer-events-none"
          viewBox="0 0 600 400"
          aria-hidden="true"
        >
          <path d="M-50,80 C150,-20 350,180 600,60" strokeWidth="1" />
          <path d="M-50,120 C150,20 350,220 600,100" strokeWidth="1" />
          <path d="M-50,160 C150,60 350,260 600,140" strokeWidth="1" />
        </svg>

        <main id="main-content" role="main" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10 sm:space-y-12">
          {/* ────────────────────────────────────────────────────────────
              1. HEADER: Title & User Registration Overview
          ──────────────────────────────────────────────────────────── */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-[0.05em] uppercase bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SGS ARENA CREDENTIAL &amp; PROGRESS TRACKER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              My Challenge Passes
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Track your live review status, candidate selection progress, terminal access credentials, and verified QR entry passes.
            </p>

            {user && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                <span>Account:</span>
                <strong className="text-neutral-950 dark:text-white">{user.email}</strong>
              </div>
            )}

            {/* Event Switcher Pills if user has registered for multiple events */}
            {userRegistrations.length > 1 && (
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block mb-2">
                  YOUR REGISTERED EVENTS ({userRegistrations.length})
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {userRegistrations.map((item) => {
                    const isSelected = activeRegistration?.docId === item.docId;
                    return (
                      <button
                        key={item.docId}
                        onClick={() => {
                          setActiveRegistration(item);
                          setSearchParams({ id: item.candidateId });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                          isSelected
                            ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-800"
                        }`}
                      >
                        <Trophy size={12} />
                        <span>{item.eventTitle || "Arena Challenge"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Notice */}
            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono max-w-xl mx-auto flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-black dark:text-white shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────────
              2. STATE: LOADING, EMPTY STATE, OR ACTIVE REGISTRATION
          ──────────────────────────────────────────────────────────── */}
          {fetchingRegistrations || authLoading ? (
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] p-16 text-center space-y-4 shadow-sm">
              <div className="w-10 h-10 mx-auto rounded-full border-2 border-black dark:border-white border-t-transparent animate-spin" />
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Retrieving your arena credentials from Firebase Firestore...
              </p>
            </div>
          ) : userRegistrations.length === 0 ? (
            /* Empty State: Logged-in user has zero registrations */
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] p-12 sm:p-16 text-center space-y-5 shadow-lg max-w-lg mx-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-950 dark:text-white">
                <FileText size={26} />
              </div>
              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                  NO PASSES FOUND
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                  No Active Event Registrations
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                  You have not registered for any hackathons or developer challenges under this account.
                  Explore upcoming challenges to claim your first pass!
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/event")}
                  className="px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Explore Events &amp; Challenges
                </button>
              </div>
            </div>
          ) : activeRegistration && statusInfo ? (
            /* Active Registration Dossier & Credential Pass */
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Status Header Banner */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] p-6 sm:p-8 text-left shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold tracking-wider uppercase border border-current ${statusInfo.badgeStyle}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                      {activeRegistration.eventTitle || "Soft Game Studio Arena"}
                    </h2>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {statusInfo.description}
                    </p>
                  </div>

                  {/* Actions: Print Card & Refresh */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={handlePrintCard}
                      className="px-4 py-2.5 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Printer size={14} />
                      <span>Print Pass</span>
                    </button>
                    <button
                      onClick={fetchMyRegistrations}
                      aria-label="Refresh tracking status"
                      className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition cursor-pointer"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>

                {/* ────────────────────────────────────────────────────────────
                    3. FOUR-STEP PROGRESS PIPELINE (Visual Stepper)
                ──────────────────────────────────────────────────────────── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500 uppercase tracking-wider">
                      SELECTION &amp; VERIFICATION PROGRESS
                    </span>
                    <span className="font-bold text-neutral-950 dark:text-white">
                      Stage {statusInfo.stage} of 4 ({statusInfo.percent}%)
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <div
                      className="h-full bg-black dark:bg-white transition-all duration-700 ease-out"
                      style={{ width: `${statusInfo.percent}%` }}
                    />
                  </div>

                  {/* 4 Pipeline Steps Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    {/* Step 1 */}
                    <div
                      className={`p-3.5 rounded-xl border text-left space-y-1 transition ${
                        statusInfo.stage >= 1
                          ? "bg-neutral-50 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-700"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase text-neutral-500">
                          Step 01
                        </span>
                        {statusInfo.stage >= 1 && (
                          <CheckCircle2 size={13} className="text-black dark:text-white" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                        Application Submitted
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {fmtDate(activeRegistration.createdAt)}
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div
                      className={`p-3.5 rounded-xl border text-left space-y-1 transition ${
                        statusInfo.stage >= 2
                          ? "bg-neutral-50 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-700"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase text-neutral-500">
                          Step 02
                        </span>
                        {statusInfo.stage >= 2 ? (
                          <CheckCircle2 size={13} className="text-black dark:text-white" />
                        ) : (
                          <Clock size={13} className="text-neutral-400" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                        Credential Screening
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {statusInfo.stage >= 2 ? "Affiliation Verified" : "In queue"}
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div
                      className={`p-3.5 rounded-xl border text-left space-y-1 transition ${
                        statusInfo.stage >= 3
                          ? "bg-neutral-50 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-700"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase text-neutral-500">
                          Step 03
                        </span>
                        {statusInfo.stage >= 3 ? (
                          <CheckCircle2 size={13} className="text-black dark:text-white" />
                        ) : (
                          <Clock size={13} className="text-neutral-400" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                        Selection / Shortlist
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {statusInfo.stage >= 3 ? "Selected for Round 1" : "Pending decision"}
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div
                      className={`p-3.5 rounded-xl border text-left space-y-1 transition ${
                        statusInfo.stage >= 4
                          ? "bg-neutral-50 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-700"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase text-neutral-500">
                          Step 04
                        </span>
                        {statusInfo.stage >= 4 ? (
                          <CheckCircle2 size={13} className="text-black dark:text-white" />
                        ) : (
                          <Lock size={13} className="text-neutral-400" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                        Arena Seat Confirmed
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {statusInfo.stage >= 4
                          ? activeRegistration.seatNumber || "Seat Allocated"
                          : "Allocating"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────────
                  4. THE OFFICIAL COMPACT PASS CARD (Target of @media print)
              ──────────────────────────────────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Printable Credential Pass Card */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div className="w-full text-left mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">
                      OFFICIAL ENCRYPTED PASS CARD
                    </span>
                  </div>

                  <div
                    id="sgs-print-pass-card"
                    className="w-full rounded-2xl border-2 border-neutral-950 dark:border-white bg-white text-black p-5 shadow-2xl space-y-4 select-none text-left"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b-2 border-neutral-950 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-black text-white flex items-center justify-center font-extrabold text-xs">
                          SGS
                        </div>
                        <div>
                          <span className="font-extrabold text-xs tracking-tight uppercase block leading-none">
                            Soft Game Studio
                          </span>
                          <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-widest block mt-0.5">
                            OFFICIAL ARENA PASS
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded border border-neutral-950 font-mono text-[9px] font-bold uppercase">
                        DPDP 2023 COMPLIANT
                      </span>
                    </div>

                    {/* Event Name */}
                    <div>
                      <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider block">
                        COMPETITION ARENA
                      </span>
                      <h4 className="text-sm font-extrabold text-black leading-snug mt-0.5">
                        {activeRegistration.eventTitle || "Arena Challenge"}
                      </h4>
                    </div>

                    {/* Candidate & Security Credentials Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 rounded bg-neutral-100 border border-neutral-300 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-neutral-500 uppercase block">
                            CANDIDATE ID
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(activeRegistration.candidateId, "Candidate ID")
                            }
                            title="Copy Candidate ID"
                            className="text-neutral-500 hover:text-black cursor-pointer"
                          >
                            {copiedField === "Candidate ID" ? (
                              <Check size={11} />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                        <span className="font-bold text-black text-xs block truncate mt-0.5">
                          {activeRegistration.candidateId}
                        </span>
                      </div>

                      <div className="p-2 rounded bg-neutral-100 border border-neutral-300 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-neutral-500 uppercase block flex items-center gap-1">
                            <Key size={10} /> ACCESS PASSWORD
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(activeRegistration.userPassword, "Access Password")
                            }
                            title="Copy Password"
                            className="text-neutral-500 hover:text-black cursor-pointer"
                          >
                            {copiedField === "Access Password" ? (
                              <Check size={11} />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                        <span className="font-bold text-black text-xs block truncate mt-0.5">
                          {activeRegistration.userPassword || "SGS-KEY-AUTHENTICATED"}
                        </span>
                      </div>
                    </div>

                    {/* Candidate Identity Details */}
                    <div className="space-y-1.5 text-xs border-t border-neutral-200 pt-2 font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500 uppercase text-[10px]">CHALLENGER:</span>
                        <span className="font-bold text-black capitalize truncate max-w-[200px]">
                          {activeRegistration.firstName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500 uppercase text-[10px]">
                          SQUAD / MODE:
                        </span>
                        <span className="font-semibold text-black truncate max-w-[200px]">
                          {activeRegistration.teamName || "Solo Challenger"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500 uppercase text-[10px]">INSTITUTE:</span>
                        <span className="font-semibold text-black truncate max-w-[200px]">
                          {activeRegistration.college || "Independent Developer"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500 uppercase text-[10px]">CONTACT:</span>
                        <span className="text-neutral-700 truncate max-w-[200px]">
                          {activeRegistration.email}
                        </span>
                      </div>
                    </div>

                    {/* Verified QR Code (Fixed & Immutable) */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-300">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] font-bold text-neutral-600 uppercase block">
                          GATE VERIFICATION
                        </span>
                        <span className="text-[8px] font-mono text-neutral-500 block leading-tight max-w-[150px]">
                          Scan at arena entrance terminal or discord verification desk.
                        </span>
                        <span className="inline-block mt-1 font-mono text-[8px] font-bold text-black uppercase">
                          STATUS: {statusInfo.label}
                        </span>
                      </div>
                      <div className="p-1.5 bg-white rounded-lg border border-neutral-400 shrink-0">
                        <QRCodeSVG
                          value={
                            activeRegistration.qrPayload ||
                            JSON.stringify({
                              candidateId: activeRegistration.candidateId,
                              authKey: activeRegistration.userPassword,
                              userId: activeRegistration.userId,
                              eventTitle: activeRegistration.eventTitle,
                              name: activeRegistration.firstName,
                              email: activeRegistration.email,
                              team: activeRegistration.teamName,
                              college: activeRegistration.college,
                              issuedBy: "Soft Game Studio"
                            })
                          }
                          size={85}
                          level="M"
                        />
                      </div>
                    </div>

                    {/* Watermark Footer */}
                    <div className="pt-2 border-t border-neutral-300 flex items-center justify-between text-[8px] font-mono text-neutral-500">
                      <span>POWERED BY SOFT GAME STUDIO</span>
                      <span>https://softgamestudio.in</span>
                    </div>
                  </div>

                  {/* Print Card Action */}
                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={handlePrintCard}
                      className="px-5 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Printer size={14} />
                      <span>Print Pass Badge</span>
                    </button>
                    <button
                      onClick={() => {
                        const origin =
                          typeof window !== "undefined"
                            ? window.location.origin
                            : "https://softgamestudio.in";
                        handleCopy(
                          `${origin}/event/track?id=${activeRegistration.candidateId}`,
                          "Tracking Link"
                        );
                      }}
                      className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition cursor-pointer"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Right Column: Full Application Specs & Arena Instructions */}
                <div className="lg:col-span-6 space-y-6 text-left">
                  {/* Detailed Specs Card */}
                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] p-6 space-y-4 shadow-sm">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block border-b border-neutral-200 dark:border-neutral-800 pb-2">
                      REGISTRATION DOSSIER
                    </span>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          Full Legal Name
                        </span>
                        <span className="font-bold text-neutral-950 dark:text-white capitalize mt-0.5 block">
                          {activeRegistration.firstName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          Registered Email
                        </span>
                        <span className="font-bold text-neutral-950 dark:text-white mt-0.5 block truncate">
                          {activeRegistration.email}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          Participation Format
                        </span>
                        <span className="font-bold text-neutral-950 dark:text-white uppercase mt-0.5 block">
                          {activeRegistration.teamType === "solo" ? "Solo Challenger" : "Squad Roster"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          Roster Size
                        </span>
                        <span className="font-bold text-neutral-950 dark:text-white mt-0.5 block">
                          {activeRegistration.teamMembersCount || 1} Member(s)
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          City / State
                        </span>
                        <span className="font-bold text-neutral-950 dark:text-white mt-0.5 block">
                          {activeRegistration.cityVillage || "N/A"},{" "}
                          {activeRegistration.state || "India"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          Course &amp; Semester
                        </span>
                        <span className="font-bold text-neutral-950 dark:text-white mt-0.5 block">
                          {activeRegistration.courseSemester || "Enrolled"}
                        </span>
                      </div>
                    </div>

                    {/* GitHub or Portfolio link if provided */}
                    {activeRegistration.githubOrPortfolio && (
                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          Portfolio / GitHub Repository
                        </span>
                        <a
                          href={activeRegistration.githubOrPortfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-neutral-950 dark:text-white hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate">{activeRegistration.githubOrPortfolio}</span>
                          <ExternalLink size={12} className="shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Next Steps / Arena Terminal Guide */}
                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111827] p-6 space-y-4 shadow-sm">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block border-b border-neutral-200 dark:border-neutral-800 pb-2">
                      WHAT TO DO NEXT
                    </span>

                    <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div>
                          <strong className="text-neutral-950 dark:text-white block font-medium">
                            Save or Print Your Pass Card
                          </strong>
                          Keep your Candidate Token ID ({activeRegistration.candidateId}) handy for automated submission logins.
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div>
                          <strong className="text-neutral-950 dark:text-white block font-medium">
                            Join Developer Discussion &amp; Discord
                          </strong>
                          Coordinate with squad members, mentors, and verify your participant badge before the competition window opens.
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div>
                          <strong className="text-neutral-950 dark:text-white block font-medium">
                            Review Problem Statements &amp; Guidelines
                          </strong>
                          Familiarize yourself with the arena rules, judging criteria, and submission deadlines.
                        </div>
                      </li>
                    </ul>

                    {/* Navigation Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      {activeRegistration.eventId && (
                        <button
                          onClick={() => navigate(`/event/${activeRegistration.eventId}`)}
                          className="px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Explore Challenge</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => navigate("/event")}
                        className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition cursor-pointer"
                      >
                        All Arenas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </Layout>
  );
}
