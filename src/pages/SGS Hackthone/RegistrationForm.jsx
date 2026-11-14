// src/pages/SGS Hackthone/RegistrationForm.jsx
// Production-grade standalone & embedded event registration terminal
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { addDoc, collection, doc, getDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { useAuth } from "../../AuthProvide";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import {
  CheckCircle2,
  Send,
  ShieldCheck,
  ChevronDown,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  MapPin,
  Building,
  Globe,
  Users,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Printer,
  RefreshCw,
  AlertCircle,
  Lock,
  Compass,
  Terminal,
  Clock,
  Key,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const INPUT_BASE_CLASSES =
  "w-full pl-11 pr-4 py-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-black dark:focus:border-white transition font-medium text-xs";

/* ─── Date Formatter Helper ─── */
const fmt = (d) => {
  if (!d) return "TBA";
  try {
    const parsed = new Date(d);
    return isNaN(parsed.getTime())
      ? "TBA"
      : parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "TBA";
  }
};

function FormField({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  autoComplete
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label
        htmlFor={name}
        className="block font-mono text-[11px] uppercase tracking-[0.05em] text-neutral-600 dark:text-neutral-400"
      >
        {label} {required && <span className="text-black dark:text-white">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors pointer-events-none">
            <Icon size={15} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`${INPUT_BASE_CLASSES} ${Icon ? "pl-10" : "pl-3.5"} ${
            error ? "border-black dark:border-white" : ""
          }`}
        />
      </div>
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-[11px] text-neutral-700 dark:text-neutral-300 font-mono flex items-center gap-1 mt-1 font-medium"
        >
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

export default function RegistrationForm({
  eventId: propEventId,
  eventTitle: propEventTitle,
  dynamicFields: propDynamicFields,
  isRegOpen: propIsRegOpen,
  registrationOpen: propRegOpen,
  registrationClose: propRegClose,
  onClose,
  className = ""
}) {
  const { id: routeEventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const eventId = propEventId || routeEventId || "";
  const isStandaloneRoute = !propEventId;

  // Remote event state (when rendered standalone)
  const [eventData, setEventData] = useState(null);
  const [fetchingEvent, setFetchingEvent] = useState(isStandaloneRoute && Boolean(eventId));

  // Form terminal state
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    firstName: user?.displayName || "",
    email: user?.email || "",
    mobile: "",
    age: "",
    college: "",
    courseSemester: "",
    teamType: "team", // 'solo' or 'team'
    teamName: "",
    teamMembersCount: "2",
    addressLine: "",
    cityVillage: "",
    state: "",
    pincode: "",
    country: "India",
    githubOrPortfolio: "",
    agreeTerms: false,
    parentConsent: false,
    privacyConsent: false,
    honeypot: "" // Anti-bot trap
  });

  const [custom, setCustom] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  // Rate Limiting & Cooldown Protection
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);

  // Real-time Countdown timer for pending events
  const [pendingCountdown, setPendingCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Priority notification waitlist for upcoming events
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Keep form synced with user profile
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: prev.email || user.email || "",
        firstName: prev.firstName || user.displayName || ""
      }));
    }
  }, [user]);

  // Fetch Firestore Event Data if rendered on standalone route
  useEffect(() => {
    let isMounted = true;
    if (eventId && !propEventTitle) {
      setFetchingEvent(true);
      getDoc(doc(fireDB, "events", eventId))
        .then((snap) => {
          if (snap.exists() && isMounted) {
            setEventData({ id: snap.id, ...snap.data() });
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch event for registration:", err);
        })
        .finally(() => {
          if (isMounted) setFetchingEvent(false);
        });
    } else {
      setFetchingEvent(false);
    }
    return () => {
      isMounted = false;
    };
  }, [eventId, propEventTitle]);

  // Check if current user has ALREADY registered for this event in Firestore (Enforces strictly 1 entry)
  useEffect(() => {
    let isMounted = true;
    const checkUserRegistration = async () => {
      if (!eventId || !user) return;
      try {
        const colRef = collection(fireDB, "event_registrations");
        // Query by user UID first
        let qUser = query(colRef, where("eventId", "==", eventId), where("userId", "==", user.uid));
        let snap = await getDocs(qUser);

        // Fallback: query by email
        if (snap.empty && user.email) {
          qUser = query(
            colRef,
            where("eventId", "==", eventId),
            where("email", "==", user.email.toLowerCase())
          );
          snap = await getDocs(qUser);
        }

        if (!snap.empty && isMounted) {
          const docData = { docId: snap.docs[0].id, ...snap.docs[0].data() };
          setSubmittedData(docData);
          setSubmitted(true);
          setAlreadyRegistered(true);
        }
      } catch (err) {
        console.warn("Firestore registration check notice:", err);
      }
    };

    checkUserRegistration();
    return () => {
      isMounted = false;
    };
  }, [eventId, user]);

  // Normalized Event Properties
  const eventDetails = useMemo(() => {
    const raw = eventData || {};
    const b = raw.basic || {};
    const title = propEventTitle || b.title || raw.title || "Arena Challenge";
    const mode = b.mode || raw.mode || "ONLINE";
    const status = b.status || raw.status || "PUBLISHED";
    const regOpen = propRegOpen || b.registrationOpen || raw.registrationOpen || "";
    const regClose = propRegClose || b.registrationClose || raw.registrationClose || "";
    const eventStart = b.eventStart || raw.eventStart || "";
    const eventEnd = b.eventEnd || raw.eventEnd || "";
    const entryFee = b.entryFee !== undefined ? b.entryFee : raw.entryFee !== undefined ? raw.entryFee : 0;
    const dynamicFields = propDynamicFields || raw.registrationFields || b.registrationFields || [];
    const teamConf = raw.team || b.team || { allowSolo: true, allowTeam: true, minSize: 1, maxSize: 4 };

    return {
      title,
      mode,
      status,
      regOpen,
      regClose,
      eventStart,
      eventEnd,
      entryFee,
      dynamicFields,
      teamConf
    };
  }, [eventData, propEventTitle, propRegOpen, propRegClose, propDynamicFields]);

  // Competition Status Check: Pending to Open, Open, Closed, or Draft
  const competitionState = useMemo(() => {
    // If an explicit prop was passed, respect it
    if (propIsRegOpen !== undefined) {
      return propIsRegOpen ? "OPEN" : "CLOSED";
    }

    const { status, regOpen, regClose } = eventDetails;
    const now = new Date();

    // Parse dates with boundary handling
    let openTime = null;
    if (regOpen) {
      if (typeof regOpen === "string" && regOpen.length <= 10) {
        openTime = new Date(`${regOpen}T00:00:00`);
      } else {
        openTime = new Date(regOpen);
      }
    }

    let closeTime = null;
    if (regClose) {
      if (typeof regClose === "string" && regClose.length <= 10) {
        closeTime = new Date(`${regClose}T23:59:59.999`);
      } else {
        closeTime = new Date(regClose);
      }
    }

    const hasValidOpen = openTime && !isNaN(openTime.getTime());
    const hasValidClose = closeTime && !isNaN(closeTime.getTime());
    const statusUpper = (status || "").toUpperCase();

    // 1. Explicit CLOSED status takes priority
    if (statusUpper === "CLOSED" || statusUpper === "CONCLUDED") {
      return "CLOSED";
    }

    // 2. Check if past registration close deadline
    if (hasValidClose && closeTime < now) {
      return "CLOSED";
    }

    // 3. Check if upcoming/pending (open date is in future)
    if (hasValidOpen && openTime > now) {
      return "PENDING";
    }

    // 4. If registrationOpen date is reached and not closed, OPEN!
    if (hasValidOpen && (!hasValidClose || closeTime >= now)) {
      return "OPEN";
    }

    // 5. Explicit OPEN status
    if (statusUpper === "OPEN" || statusUpper === "PUBLISHED" || statusUpper === "ACTIVE") {
      return "OPEN";
    }

    // 6. Draft status (only when no active dates)
    if (statusUpper === "DRAFT") {
      return "DRAFT";
    }

    return "OPEN";
  }, [propIsRegOpen, eventDetails]);

  // Countdown timer for PENDING registrations
  useEffect(() => {
    if (competitionState === "PENDING" && eventDetails.regOpen) {
      const targetTime = new Date(eventDetails.regOpen).getTime();
      const updateTimer = () => {
        const diff = targetTime - Date.now();
        if (diff <= 0) {
          setPendingCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          setPendingCountdown({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          });
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [competitionState, eventDetails.regOpen]);

  // Rate Limiting Cooldown Ticker
  useEffect(() => {
    if (rateLimitCooldown > 0) {
      const timer = setInterval(() => {
        setRateLimitCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [rateLimitCooldown]);

  // Field error auto-focus
  useEffect(() => {
    const firstErrorKey = Object.keys(errors).find((key) => errors[key]);
    if (firstErrorKey) {
      document.getElementById(firstErrorKey)?.focus();
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (formError) {
      setFormError("");
    }
  };

  const handleCustom = (label, val) => {
    setCustom((prev) => ({ ...prev, [label]: val }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Full Legal Name is required";
    if (!form.email.trim()) newErrors.email = "Valid Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile Number is required";
    else if (form.mobile.replace(/\D/g, "").length < 10) newErrors.mobile = "Enter a valid 10-digit number";
    if (!form.age) newErrors.age = "Age is required";
    else if (Number(form.age) < 10 || Number(form.age) > 100) newErrors.age = "Enter a valid age";
    if (!form.college.trim()) newErrors.college = "College/Institute name is required";
    if (!form.courseSemester.trim()) newErrors.courseSemester = "Course & Semester is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const newErrors = {};
    if (form.teamType === "team" && !form.teamName.trim()) {
      newErrors.teamName = "Team Name is required for squad participation";
    }
    if (!form.cityVillage.trim()) newErrors.cityVillage = "City/Town is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{4,10}$/.test(form.pincode.trim())) newErrors.pincode = "Enter a valid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Submit Handler with Strict Rate-Limiting & Immutable Credentials Generation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Rate Limiting Check
    if (rateLimitCooldown > 0) {
      setFormError(`Rate limit active. Please wait ${rateLimitCooldown}s before submitting again.`);
      return;
    }

    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (!form.agreeTerms) {
      setFormError("Please accept the competition Rules & Code of Conduct.");
      return;
    }

    if (!form.privacyConsent) {
      setFormError("Please review and accept the Privacy Policy to proceed.");
      return;
    }

    if (Number(form.age) < 18 && !form.parentConsent) {
      setFormError(
        "Under Section 9 of the DPDP Act 2023, participants under 18 require verifiable parental/guardian authorization."
      );
      return;
    }

    // Bot honeypot verification
    if (form.honeypot) {
      setSubmitted(true);
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        setFormError("You must be signed in with your Soft Game Studio account to register.");
        setLoading(false);
        return;
      }

      // Check if user has already registered for this event (strictly 1 registration per user)
      const colRef = collection(fireDB, "event_registrations");
      const existingCheckQ = query(
        colRef,
        where("eventId", "==", eventId),
        where("userId", "==", user.uid)
      );
      const existingCheckSnap = await getDocs(existingCheckQ);
      if (!existingCheckSnap.empty) {
        const existingDoc = {
          docId: existingCheckSnap.docs[0].id,
          ...existingCheckSnap.docs[0].data()
        };
        setSubmittedData(existingDoc);
        setSubmitted(true);
        setAlreadyRegistered(true);
        setFormError("You have already registered for this challenge. 1 registration per challenger.");
        setLoading(false);
        return;
      }

      // 1. Generate Unique Immutable Candidate ID (e.g. SGS-2026-X491-B8K2)
      const randomSeed = Math.random().toString(36).substring(2, 6).toUpperCase();
      const timeStampSeed = Date.now().toString(36).slice(-4).toUpperCase();
      const uniqueUserId = `SGS-2026-${randomSeed}-${timeStampSeed}`;

      // 2. Auto-Generate Unique Security Access Key / Password
      const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const autoUserPassword = `SGS-KEY-${p1}-${p2}`;

      const assignedSeat = `SGS-A${Math.floor(100 + Math.random() * 900)}`;

      // 3. Unique Cryptographic QR Code Payload for Gate & Admin Verification
      const qrPayloadData = {
        candidateId: uniqueUserId,
        authKey: autoUserPassword,
        userId: user.uid,
        eventId: eventId || "sgs-arena",
        eventTitle: eventDetails.title,
        name: form.firstName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.replace(/\s/g, ""),
        college: form.college.trim(),
        team: form.teamName.trim() || "Solo Challenger",
        mode: form.teamType,
        teamMembersCount: form.teamMembersCount,
        seatNumber: assignedSeat,
        verifiedIssuer: "Soft Game Studio Security Protocol",
        issuedAt: new Date().toISOString()
      };

      const qrPayloadString = JSON.stringify(qrPayloadData);

      const submissionPayload = {
        userId: user.uid,
        userEmail: (user.email || form.email.trim()).toLowerCase(),
        candidateId: uniqueUserId,
        userPassword: autoUserPassword,
        qrPayload: qrPayloadString,
        firstName: form.firstName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.replace(/\s/g, ""),
        age: form.age,
        college: form.college.trim(),
        courseSemester: form.courseSemester.trim(),
        teamType: form.teamType,
        teamName: form.teamName.trim() || "Solo Challenger",
        teamMembersCount: form.teamMembersCount,
        addressLine: form.addressLine.trim(),
        cityVillage: form.cityVillage.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: form.country,
        githubOrPortfolio: form.githubOrPortfolio.trim(),
        customFields: custom,
        eventId: eventId || "unknown",
        eventTitle: eventDetails.title,
        status: "SUBMITTED",
        statusStep: 1,
        statusNotes: "Application received and queued for automated credential verification.",
        verificationStatus: "VERIFIED",
        round: "Round 1 - Arena Qualification",
        seatNumber: assignedSeat,
        createdAt: Timestamp.now()
      };

      // Write strictly to Firestore collection (NO localStorage)
      const docRef = await addDoc(colRef, submissionPayload);
      const finalResult = { ...submissionPayload, docId: docRef.id };

      setSubmittedData(finalResult);
      setSubmitted(true);
      setAlreadyRegistered(true);

      // Set 45-second rate limiting cooldown
      setRateLimitCooldown(45);
    } catch (err) {
      console.error("Registration error:", err);
      setFormError("Failed to submit registration. Please verify your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Custom Questions Renderer
  const renderDynField = useCallback(
    (field, idx) => {
      const { type, label, required, options } = field;
      const val = custom[label] || "";
      const fieldId = `cf-${idx}`;
      const props = {
        id: fieldId,
        value: val,
        onChange: (e) => handleCustom(label, e.target.value),
        required,
        className: `${INPUT_BASE_CLASSES} pl-4`
      };

      switch (type?.toUpperCase()) {
        case "TEXT":
        case "EMAIL":
        case "NUMBER":
        case "DATE":
          return <input type={type.toLowerCase()} placeholder={label} {...props} />;
        case "PHONE":
          return <input type="tel" placeholder={label} {...props} />;
        case "TEXTAREA":
          return (
            <textarea
              rows="3"
              placeholder={label}
              {...props}
              className={`${INPUT_BASE_CLASSES} pl-4 min-h-[90px] resize-y`}
            />
          );
        case "SELECT":
          return (
            <div className="relative">
              <select {...props} className={`${INPUT_BASE_CLASSES} pl-4 appearance-none pr-10`}>
                <option value="">Select {label}</option>
                {(options || []).map((o, i) => (
                  <option key={i} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          );
        default:
          return <input type="text" placeholder={label} {...props} />;
      }
    },
    [custom]
  );

  // Trigger Print Only For The Small Card
  const handlePrintCard = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Submit Priority Waitlist for Pending Arena
  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistSuccess(true);
  };

  // Inner Content Wrapper
  const content = (
    <div className={`w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 ${className}`}>
      {/* ────────────────────────────────────────────────────────────
          PRINT STYLES: Ensures ONLY the compact pass card prints
      ──────────────────────────────────────────────────────────── */}
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

      {/* Loading Remote Event State */}
      {fetchingEvent ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-black dark:border-white border-t-transparent animate-spin" />
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            Initializing Secure Arena Registration Terminal...
          </p>
        </div>
      ) : isStandaloneRoute && eventId && !eventData ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 text-center space-y-5 shadow-lg">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-950 dark:text-white">
            <AlertCircle size={26} />
          </div>
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
              ARENA NOT FOUND
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white tracking-tight mt-2">
              Challenge Does Not Exist
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              We couldn't locate this challenge in the database. The event may have been unpublished or the link may be invalid.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate("/event")}
              className="px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Browse Active Arenas
            </button>
            <button
              onClick={() => navigate("/event/track")}
              className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition cursor-pointer"
            >
              Track Registration
            </button>
          </div>
        </div>
      ) : competitionState === "DRAFT" ? (
        /* ────────────────────────────────────────────────────────────
            CASE 1: DRAFT STATE (Competition not yet active)
        ──────────────────────────────────────────────────────────── */
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 text-center space-y-5 shadow-lg">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-950 dark:text-white">
            <Lock size={26} />
          </div>
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
              DRAFT PREVIEW
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white tracking-tight mt-2">
              Registration Under Configuration
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              The competition <strong className="text-neutral-950 dark:text-white">{eventDetails.title}</strong> is currently being prepared by the coordinators. Registration will open as soon as the schedule is published.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate(`/event/${eventId}`)}
              className="px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              View Challenge Details
            </button>
          </div>
        </div>
      ) : competitionState === "PENDING" ? (
        /* ────────────────────────────────────────────────────────────
            CASE 2: PENDING TO OPEN (Upcoming Event Countdown)
        ──────────────────────────────────────────────────────────── */
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 text-center space-y-6 shadow-lg">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-950 dark:text-white">
            <Clock size={26} />
          </div>
          <div className="space-y-1.5">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700">
              REGISTRATION PENDING TO OPEN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight mt-1">
              {eventDetails.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              Registration for this arena opens on{" "}
              <strong className="text-neutral-950 dark:text-white font-mono">{fmt(eventDetails.regOpen)}</strong>.
            </p>
          </div>

          {/* Live Countdown Clock */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-sm mx-auto">
            {[
              { label: "DAYS", val: pendingCountdown.days },
              { label: "HOURS", val: pendingCountdown.hours },
              { label: "MINS", val: pendingCountdown.minutes },
              { label: "SECS", val: pendingCountdown.seconds }
            ].map(({ label, val }) => (
              <div
                key={label}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center"
              >
                <span className="block text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
                  {String(val).padStart(2, "0")}
                </span>
                <span className="block text-[10px] font-mono font-bold text-neutral-500 uppercase mt-0.5">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Priority Alert Waitlist Form */}
          <div className="max-w-md mx-auto pt-2 border-t border-neutral-200 dark:border-neutral-800">
            {waitlistSuccess ? (
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-mono flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                <span>You will be notified immediately when spots open!</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-2 text-left">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                  Priority Spot Alert (Email)
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="developer@university.edu"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Notify Me
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate(`/event/${eventId}`)}
              className="text-xs font-mono font-bold uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>Back to Challenge Details</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ) : competitionState === "CLOSED" ? (
        /* ────────────────────────────────────────────────────────────
            CASE 3: CLOSED / CONCLUDED STATE
        ──────────────────────────────────────────────────────────── */
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 text-center space-y-5 shadow-lg">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-950 dark:text-white">
            <ShieldAlert size={26} />
          </div>
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
              REGISTRATION CONCLUDED
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white tracking-tight mt-2">
              Registration Window Closed
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              The registration portal for <strong className="text-neutral-950 dark:text-white">{eventDetails.title}</strong> closed on {fmt(eventDetails.regClose)}. Submissions are no longer accepted for this round.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate("/event")}
              className="px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Explore Active Arenas
            </button>
            <button
              onClick={() => navigate(`/event/${eventId}`)}
              className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition cursor-pointer"
            >
              View Archive
            </button>
          </div>
        </div>
      ) : submitted && submittedData ? (
        /* ────────────────────────────────────────────────────────────
            SUCCESS CONFIRMED: COMPACT ID PASS CARD (Small card only for print)
        ──────────────────────────────────────────────────────────── */
        <div className="space-y-6 text-left">
          {/* Header Info (Hidden when printing card) */}
          <div className="no-print flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">
                  REGISTRATION VERIFIED &amp; ENCRYPTED
                </span>
                <h3 className="text-xl font-bold text-neutral-950 dark:text-white tracking-tight">
                  Credential Pass Issued
                </h3>
              </div>
            </div>

            {/* Print Action Button */}
            <button
              onClick={handlePrintCard}
              className="px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <Printer size={14} />
              <span>Print Credential Card</span>
            </button>
          </div>

          {alreadyRegistered && (
            <div className="no-print p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-black dark:text-white shrink-0" />
              <div>
                <strong className="block text-neutral-950 dark:text-white font-bold">
                  Active Registration Confirmed
                </strong>
                <span>
                  You are registered for this challenge. 1 official candidate entry is allocated per account.
                </span>
              </div>
            </div>
          )}

          <p className="no-print text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your candidate registration is confirmed. Keep this pass card for event entrance, discord role verification, and automated submission terminal access.
          </p>

          {/* ────────────────────────────────────────────────────────────
              THE COMPACT PASS CARD (Target of @media print)
          ──────────────────────────────────────────────────────────── */}
          <div
            id="sgs-print-pass-card"
            className="w-full max-w-md mx-auto rounded-2xl border-2 border-neutral-950 dark:border-white bg-white text-black p-5 shadow-2xl space-y-4 select-none"
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
                {eventDetails.title}
              </h4>
            </div>

            {/* Candidate & Security Credentials Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-neutral-100 border border-neutral-300">
                <span className="text-[9px] text-neutral-500 uppercase block">CANDIDATE ID</span>
                <span className="font-bold text-black text-xs block truncate mt-0.5">
                  {submittedData.candidateId}
                </span>
              </div>
              <div className="p-2 rounded bg-neutral-100 border border-neutral-300">
                <span className="text-[9px] text-neutral-500 uppercase block flex items-center gap-1">
                  <Key size={10} /> ACCESS PASSWORD
                </span>
                <span className="font-bold text-black text-xs block truncate mt-0.5">
                  {submittedData.userPassword}
                </span>
              </div>
            </div>

            {/* Candidate Identity Details */}
            <div className="space-y-1.5 text-xs border-t border-neutral-200 pt-2 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 uppercase text-[10px]">CHALLENGER:</span>
                <span className="font-bold text-black capitalize">{submittedData.firstName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 uppercase text-[10px]">SQUAD / MODE:</span>
                <span className="font-semibold text-black">{submittedData.teamName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 uppercase text-[10px]">INSTITUTE:</span>
                <span className="font-semibold text-black truncate max-w-[180px]">
                  {submittedData.college}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 uppercase text-[10px]">CONTACT:</span>
                <span className="text-neutral-700">{submittedData.email}</span>
              </div>
            </div>

            {/* Verified QR Code (Fixed & Immutable for this candidate) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-300">
              <div className="space-y-1">
                <span className="font-mono text-[9px] font-bold text-neutral-600 uppercase block">
                  GATE VERIFICATION
                </span>
                <span className="text-[8px] font-mono text-neutral-500 block leading-tight">
                  Scan at arena check-in terminal or upload to dev portal.
                </span>
                <span className="inline-block mt-1 font-mono text-[8px] font-bold text-black uppercase">
                  STATUS: VERIFIED
                </span>
              </div>
              <div className="p-1.5 bg-white rounded-lg border border-neutral-400 shrink-0">
                <QRCodeSVG
                  value={submittedData.qrPayload || JSON.stringify(submittedData)}
                  size={85}
                  level="M"
                />
              </div>
            </div>

            {/* Card Deep Brand Watermark Footer */}
            <div className="pt-2 border-t border-neutral-300 flex items-center justify-between text-[8px] font-mono text-neutral-500">
              <span>POWERED BY SOFT GAME STUDIO</span>
              <span>https://softgamestudio.in</span>
            </div>
          </div>

          {/* Navigation Controls (Hidden when printing) */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => navigate(`/event/${eventId}/track?id=${submittedData.candidateId}`)}
              className="px-5 py-2.5 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold text-xs uppercase tracking-tight transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Track Application Status</span>
              <ArrowRight size={14} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/event/${eventId}`)}
                className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition cursor-pointer"
              >
                Challenge Overview
              </button>
              <button
                onClick={() => navigate("/event")}
                className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition cursor-pointer"
              >
                Browse All Arenas
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────────
            CASE 4: ACTIVE 3-STEP REGISTRATION TERMINAL
        ──────────────────────────────────────────────────────────── */
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 text-left shadow-lg transition-colors">
          <div>
            {/* Terminal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] uppercase tracking-[0.05em] mb-2">
                  <Terminal size={12} /> SECURE ARENA TERMINAL
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-white tracking-[-0.02em]">
                  Register for {eventDetails.title}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-1">
                  Complete candidate verification and regulatory declarations in 3 steps.
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                  <span>Already registered?</span>
                  <button
                    type="button"
                    onClick={() => navigate(eventId ? `/event/${eventId}/track` : "/event/track")}
                    className="font-bold underline text-neutral-950 dark:text-white hover:opacity-80 cursor-pointer"
                  >
                    Track Application Status →
                  </button>
                </div>
              </div>

              {/* Step Counter */}
              <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs uppercase tracking-[0.05em] text-neutral-600 dark:text-neutral-400">
                <span className="text-neutral-950 dark:text-white font-bold">Step {currentStep}</span>
                <span>of 3</span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="my-6">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { step: 1, title: "Personal Info" },
                  { step: 2, title: "Squad & Location" },
                  { step: 3, title: "Review & Consent" }
                ].map(({ step, title }) => {
                  const isPassed = currentStep > step;
                  const isCurrent = currentStep === step;

                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        if (step < currentStep) setCurrentStep(step);
                      }}
                      className={`text-left p-2.5 rounded-lg border transition cursor-pointer ${
                        isCurrent
                          ? "border-black dark:border-white bg-neutral-100 dark:bg-neutral-900"
                          : isPassed
                          ? "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60"
                          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/40 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-neutral-500">
                          0{step}
                        </span>
                        {isPassed && <Check size={12} className="text-black dark:text-white" />}
                      </div>
                      <span
                        className={`block text-xs font-semibold mt-1 truncate ${
                          isCurrent ? "text-neutral-950 dark:text-white" : "text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        {title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Anti-bot Honeypot Trap */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              {/* Form Error Notice */}
              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs flex items-center gap-2 font-mono"
                >
                  <AlertCircle size={15} className="shrink-0 text-black dark:text-white" />
                  <span>{formError}</span>
                </div>
              )}

              {/* STEP 1: PERSONAL DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                      <User size={15} /> Participant Details
                    </h3>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Step 1 of 3</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Full Legal Name"
                      name="firstName"
                      placeholder="Enter your legal name"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      icon={User}
                      autoComplete="name"
                      error={errors.firstName}
                    />

                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="name@university.edu"
                      value={form.email}
                      onChange={handleChange}
                      required
                      icon={Mail}
                      autoComplete="email"
                      error={errors.email}
                    />

                    <FormField
                      label="Mobile Number (WhatsApp)"
                      name="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                      icon={Phone}
                      autoComplete="tel"
                      error={errors.mobile}
                    />

                    <FormField
                      label="Age"
                      name="age"
                      type="number"
                      placeholder="e.g. 21"
                      value={form.age}
                      onChange={handleChange}
                      required
                      icon={Calendar}
                      error={errors.age}
                    />

                    <FormField
                      label="College / Institute / Company"
                      name="college"
                      placeholder="Institution Name"
                      value={form.college}
                      onChange={handleChange}
                      required
                      icon={Building}
                      error={errors.college}
                    />

                    <FormField
                      label="Course & Semester / Role"
                      name="courseSemester"
                      placeholder="e.g. B.Tech CSE (6th Sem)"
                      value={form.courseSemester}
                      onChange={handleChange}
                      required
                      icon={GraduationCap}
                      error={errors.courseSemester}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: SQUAD & LOCATION */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                      <Users size={15} /> Squad &amp; Geographic Details
                    </h3>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Step 2 of 3</span>
                  </div>

                  {/* Mode Selector */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[11px] uppercase tracking-[0.05em] text-neutral-600 dark:text-neutral-400">
                      Participation Mode *
                    </label>
                    <div role="radiogroup" aria-label="Participation mode" className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={form.teamType === "team"}
                        onClick={() => setForm((prev) => ({ ...prev, teamType: "team" }))}
                        className={`p-3.5 rounded-lg border text-left transition cursor-pointer ${
                          form.teamType === "team"
                            ? "bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white text-neutral-950 dark:text-white"
                            : "bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs uppercase tracking-tight">Squad / Team</span>
                          <Users size={15} />
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Assemble with teammates (up to {eventDetails.teamConf.maxSize || 4})
                        </p>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={form.teamType === "solo"}
                        onClick={() => setForm((prev) => ({ ...prev, teamType: "solo", teamName: "" }))}
                        className={`p-3.5 rounded-lg border text-left transition cursor-pointer ${
                          form.teamType === "solo"
                            ? "bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white text-neutral-950 dark:text-white"
                            : "bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs uppercase tracking-tight">Solo Challenger</span>
                          <User size={15} />
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Individual engineering sprint
                        </p>
                      </button>
                    </div>
                  </div>

                  {form.teamType === "team" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                      <FormField
                        label="Squad / Team Name"
                        name="teamName"
                        placeholder="e.g. AlgoArchitects"
                        value={form.teamName}
                        onChange={handleChange}
                        required
                        icon={Users}
                        error={errors.teamName}
                      />

                      <div className="space-y-1.5 text-left">
                        <label
                          htmlFor="teamMembersCount"
                          className="block font-mono text-[11px] uppercase tracking-[0.05em] text-neutral-600 dark:text-neutral-400"
                        >
                          Squad Member Count
                        </label>
                        <div className="relative">
                          <select
                            id="teamMembersCount"
                            name="teamMembersCount"
                            value={form.teamMembersCount}
                            onChange={handleChange}
                            className={`${INPUT_BASE_CLASSES} pl-3.5 pr-10 appearance-none`}
                          >
                            <option value="2">2 Members</option>
                            <option value="3">3 Members</option>
                            <option value="4">4 Members</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Address Line"
                      name="addressLine"
                      placeholder="Street, locality, or landmark"
                      value={form.addressLine}
                      onChange={handleChange}
                      icon={MapPin}
                    />

                    <FormField
                      label="City / Town"
                      name="cityVillage"
                      placeholder="e.g. Abohar"
                      value={form.cityVillage}
                      onChange={handleChange}
                      required
                      icon={MapPin}
                      error={errors.cityVillage}
                    />

                    <FormField
                      label="State / Province"
                      name="state"
                      placeholder="e.g. Punjab"
                      value={form.state}
                      onChange={handleChange}
                      required
                      icon={MapPin}
                      error={errors.state}
                    />

                    <FormField
                      label="Pincode"
                      name="pincode"
                      placeholder="e.g. 152116"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      icon={MapPin}
                      error={errors.pincode}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: CUSTOM INQUIRIES & CONSENTS */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                      <FileText size={15} /> Declarations &amp; Verification
                    </h3>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Step 3 of 3</span>
                  </div>

                  <FormField
                    label="GitHub / Portfolio / Project Profile (Optional)"
                    name="githubOrPortfolio"
                    placeholder="https://github.com/yourhandle"
                    value={form.githubOrPortfolio}
                    onChange={handleChange}
                    icon={Globe}
                  />

                  {/* Challenge-Specific Dynamic Custom Fields */}
                  {eventDetails.dynamicFields.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <h4 className="text-xs font-mono uppercase tracking-[0.05em] text-neutral-600 dark:text-neutral-400">
                        Challenge Track Inquiries
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {eventDetails.dynamicFields.map((field, idx) => (
                          <div key={idx} className="space-y-1.5 text-left">
                            <label
                              htmlFor={`cf-${idx}`}
                              className="block font-mono text-[11px] uppercase tracking-[0.05em] text-neutral-600 dark:text-neutral-400"
                            >
                              {field.label} {field.required && <span className="text-black dark:text-white">*</span>}
                            </label>
                            {renderDynField(field, idx)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verification Summary */}
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 text-left">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider block">
                      Summary Verification
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1 font-mono">
                      <div>
                        <span className="text-neutral-500 text-[10px] uppercase block">Candidate</span>
                        <p className="font-bold text-neutral-950 dark:text-white truncate">
                          {form.firstName || "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-500 text-[10px] uppercase block">Squad Mode</span>
                        <p className="font-bold text-neutral-950 dark:text-white capitalize truncate">
                          {form.teamType} {form.teamType === "team" && `(${form.teamName})`}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-500 text-[10px] uppercase block">Institution</span>
                        <p className="font-bold text-neutral-950 dark:text-white truncate">
                          {form.college || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Regulatory & DPDP Act Consents */}
                  <div className="space-y-2.5">
                    <label className="flex items-start gap-3 cursor-pointer select-none text-left p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handleChange}
                        aria-required="true"
                        className="mt-0.5 w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-0"
                      />
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        I agree to the <span className="font-bold text-neutral-950 dark:text-white">Rules, Regulations &amp; Code of Conduct</span> for this competition.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer select-none text-left p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
                      <input
                        type="checkbox"
                        name="privacyConsent"
                        checked={form.privacyConsent}
                        onChange={handleChange}
                        aria-required="true"
                        className="mt-0.5 w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-0"
                      />
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        I consent to the collection and cryptographic issuance of credentials in compliance with the{" "}
                        <Link to="/PrivacyPolicy" target="_blank" className="font-bold underline text-neutral-950 dark:text-white">
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link to="/TermsAndConditions" target="_blank" className="font-bold underline text-neutral-950 dark:text-white">
                          Terms &amp; Conditions
                        </Link>.
                      </span>
                    </label>

                    {Number(form.age) < 18 && (
                      <label className="flex items-start gap-3 cursor-pointer select-none text-left p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <input
                          type="checkbox"
                          name="parentConsent"
                          checked={form.parentConsent}
                          onChange={handleChange}
                          aria-required="true"
                          className="mt-0.5 w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-0"
                        />
                        <span className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          <strong className="text-neutral-950 dark:text-white font-mono uppercase text-[11px]">
                            Parental Authorization (DPDP Act 2023 Sec 9):
                          </strong>{" "}
                          As a participant under 18, I confirm that my parent or legal guardian has authorized my participation.
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Stepper Footer Controls */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-neutral-950 dark:text-white shrink-0" />
                  <span>SECURED ARENA TERMINAL</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-4 py-2.5 rounded-lg font-semibold border border-neutral-300 dark:border-neutral-800 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-300 transition text-xs w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-lg font-bold bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black uppercase tracking-wider transition text-xs w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      Continue <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || rateLimitCooldown > 0}
                      aria-busy={loading ? "true" : undefined}
                      className="px-6 py-2.5 rounded-lg font-bold bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black uppercase tracking-wider transition text-xs disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer shadow-sm active:scale-95"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Issuing Pass...
                        </>
                      ) : rateLimitCooldown > 0 ? (
                        `Wait ${rateLimitCooldown}s`
                      ) : (
                        <>
                          Complete Registration <Send size={14} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // If rendered as a standalone route component, wrap in <Layout>
  if (isStandaloneRoute) {
    return (
      <Layout>
        <Helmet>
          <title>{`Registration | ${eventDetails.title} | Soft Game Studio`}</title>
          <meta
            name="description"
            content={`Official registration portal for ${eventDetails.title}. Submit squad allocation and claim entry credentials.`}
          />
        </Helmet>
        <div className="min-h-screen bg-white dark:bg-[#000000] text-neutral-900 dark:text-[#F9FAFB] transition-colors duration-200">
          {content}
        </div>
      </Layout>
    );
  }

  // Embedded mode (if ever called as a child component)
  return content;
}
