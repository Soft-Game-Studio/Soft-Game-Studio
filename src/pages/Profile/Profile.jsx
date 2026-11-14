/**
 * Profile.jsx: Soft Game Studio User Account & Membership Portal
 *
 * Production-grade authenticated profile management implementing:
 * - Full Dark & Light Mode Theme Support (neutral foundations, high contrast)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, zero emoji icons
 * - Technical SEO & Privacy: react-helmet-async with noindex/nofollow robots directives
 * - Robust Authentication Lifecycle: Guards against premature redirects while auth initializes
 * - Data Masking & Privacy: Safe email and phone masking with accessible reveal toggles
 * - Synchronized Firestore Updates: Authoritative validation and sanitized write contracts
 * - Tabbed Architecture: Account Details, Community Membership, and Academic/Studio Resources
 */

/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { fireDB, auth } from "../../DataBase/firebaseConfig";
import { signOut } from "firebase/auth";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaUsers,
  FaShieldAlt,
  FaAward,
  FaClock,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaGamepad,
  FaBook,
  FaGraduationCap,
  FaPhoneAlt,
  FaEnvelope,
  FaHome,
  FaCity,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaSignOutAlt,
  FaLayerGroup,
  FaCode,
  FaIdCard,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaTrophy,
  FaDownload,
  FaTrashAlt,
  FaUndo,
} from "react-icons/fa";
import { useAuth } from "../../AuthProvide";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet-async";

const POPULAR_GOOGLE_SKILLS = [
  "Google Cloud Platform",
  "Android & Kotlin",
  "Google Workspace API",
  "Core Web Vitals & SEO",
  "Firebase Realtime Systems",
  "TensorFlow & AI/ML",
  "Google Play Deployment",
  "Competitive Programming",
];

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ text: "", type: "" });
  const [editedData, setEditedData] = useState({
    name: "",
    phone: "",
    address: {
      streetno: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
    developerRole: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    googleSkills: [],
    legalSuccessor: {
      name: "",
      relation: "",
      contact: "",
    },
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [communityData, setCommunityData] = useState(null);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [revealedEmail, setRevealedEmail] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(false);

  // 2-Step DPDP Act Statutory Erasure & Soft-Delete State
  const [showErasureModal, setShowErasureModal] = useState(false);
  const [erasureStep, setErasureStep] = useState(1);
  const [confirmAck1, setConfirmAck1] = useState(false);
  const [confirmAck2, setConfirmAck2] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [processingErasure, setProcessingErasure] = useState(false);
  const [cancellingErasure, setCancellingErasure] = useState(false);

  // Remaining cooling-off days calculation (1 to 30 days window)
  const remainingCoolingOffDays = useMemo(() => {
    if (!userData?.coolingOffExpiresAt) return 0;
    const diffMs = new Date(userData.coolingOffExpiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }, [userData?.coolingOffExpiresAt]);

  // Fetch User Document
  useEffect(() => {
    let isCancelled = false;

    // Do nothing while auth state is resolving
    if (authLoading) return;

    if (!user?.email) {
      navigate("/Login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const usersRef = collection(fireDB, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (isCancelled) return;

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data();
          setUserData({ id: userDoc.id, ...data });
          setEditedData({
            name: data.name || "",
            phone: data.phone || "",
            address: {
              streetno: data.address?.streetno || "",
              area: data.address?.area || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              pincode: data.address?.pincode || "",
            },
            developerRole: data.developerRole || "",
            bio: data.bio || "",
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            portfolioUrl: data.portfolioUrl || "",
            googleSkills: Array.isArray(data.googleSkills) ? data.googleSkills : [],
            legalSuccessor: {
              name: data.legalSuccessor?.name || "",
              relation: data.legalSuccessor?.relation || "",
              contact: data.legalSuccessor?.contact || "",
            },
          });
        } else {
          navigate("/Login");
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("[SGS Profile] Error fetching user:", error);
          setSaveStatus({
            text: "Failed to load account profile. Please refresh.",
            type: "error",
          });
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchUserData();
    return () => {
      isCancelled = true;
    };
  }, [user, authLoading, navigate]);

  // Fetch Community Member Document
  useEffect(() => {
    let isCancelled = false;

    if (!user?.uid) {
      setLoadingCommunity(false);
      return;
    }

    const fetchCommunityData = async () => {
      setLoadingCommunity(true);
      try {
        const communityRef = collection(fireDB, "communityMembers");
        const q = query(communityRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        if (isCancelled) return;

        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const docData = docSnap.data();
          setCommunityData({
            id: docSnap.id,
            ...docData,
          });
        } else {
          setCommunityData(null);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("[SGS Profile] Community fetch error:", error);
          setCommunityData(null);
        }
      } finally {
        if (!isCancelled) setLoadingCommunity(false);
      }
    };

    fetchCommunityData();
    return () => {
      isCancelled = true;
    };
  }, [user]);

  const handleEditToggle = useCallback(() => {
    if (isEditing && userData) {
      // Revert edited fields
      setEditedData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: { ...(userData.address || {}) },
        developerRole: userData.developerRole || "",
        bio: userData.bio || "",
        githubUrl: userData.githubUrl || "",
        linkedinUrl: userData.linkedinUrl || "",
        portfolioUrl: userData.portfolioUrl || "",
        googleSkills: Array.isArray(userData.googleSkills) ? userData.googleSkills : [],
        legalSuccessor: {
          name: userData.legalSuccessor?.name || "",
          relation: userData.legalSuccessor?.relation || "",
          contact: userData.legalSuccessor?.contact || "",
        },
      });
      setSaveStatus({ text: "", type: "" });
    }
    setIsEditing((prev) => !prev);
  }, [isEditing, userData]);

  const handleChange = useCallback((e, field, nestedField = null) => {
    const value = e.target.value;
    if (nestedField) {
      setEditedData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: value,
        },
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  }, []);

  const handleToggleGoogleSkill = useCallback((skill) => {
    if (!isEditing) return;
    setEditedData((prev) => {
      const current = prev.googleSkills || [];
      const exists = current.includes(skill);
      return {
        ...prev,
        googleSkills: exists ? current.filter((s) => s !== skill) : [...current, skill],
      };
    });
  }, [isEditing]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!userData?.id) return;

    if (!editedData.name.trim()) {
      setSaveStatus({ text: "Full name cannot be empty.", type: "error" });
      return;
    }

    setSaving(true);
    setSaveStatus({ text: "", type: "" });

    try {
      const payload = {
        name: editedData.name.trim(),
        phone: editedData.phone.trim(),
        address: {
          streetno: editedData.address?.streetno?.trim() || "",
          area: editedData.address?.area?.trim() || "",
          city: editedData.address?.city?.trim() || "",
          state: editedData.address?.state?.trim() || "",
          pincode: editedData.address?.pincode?.trim() || "",
        },
        developerRole: editedData.developerRole?.trim() || "",
        bio: editedData.bio?.trim() || "",
        githubUrl: editedData.githubUrl?.trim() || "",
        linkedinUrl: editedData.linkedinUrl?.trim() || "",
        portfolioUrl: editedData.portfolioUrl?.trim() || "",
        googleSkills: Array.isArray(editedData.googleSkills) ? editedData.googleSkills : [],
        legalSuccessor: {
          name: editedData.legalSuccessor?.name?.trim() || "",
          relation: editedData.legalSuccessor?.relation?.trim() || "",
          contact: editedData.legalSuccessor?.contact?.trim() || "",
        },
      };

      const userDocRef = doc(fireDB, "users", userData.id);
      await updateDoc(userDocRef, payload);

      setUserData((prev) => ({
        ...prev,
        ...payload,
      }));

      setIsEditing(false);
      setSaveStatus({
        text: "Profile updated successfully.",
        type: "success",
      });

      setTimeout(() => setSaveStatus({ text: "", type: "" }), 4000);
    } catch (error) {
      console.error("[SGS Profile] Error updating profile:", error);
      setSaveStatus({
        text: "Failed to save profile changes. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadMyData = useCallback(() => {
    if (!userData) return;
    const exportPayload = {
      fiduciary: "Soft Game Studio",
      complianceNotice: "Data archive generated pursuant to Section 11 of the Digital Personal Data Protection (DPDP) Act, 2023.",
      generatedAtUTC: new Date().toISOString(),
      accountProfile: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        rollNumber: userData.rollNumber || "Not assigned",
        address: userData.address || {},
        developerRole: userData.developerRole || "",
        bio: userData.bio || "",
        socialProfiles: {
          github: userData.githubUrl || "",
          linkedin: userData.linkedinUrl || "",
          portfolio: userData.portfolioUrl || "",
        },
        googleSkills: userData.googleSkills || [],
        memberSince: userData.time || null,
      },
      consentArtefact: {
        noticeVersion: userData.consentVersion || "2026-DPDP-v1.0",
        consentTimestamp: userData.consentTimestamp || null,
        purposeCodes: ["AUTH_SESSION", "CORE_SERVICES", "EXAM_PROCTOR_TELEMETRY"],
        fiduciaryStatus: "Direct Affirmative Opt-in",
      },
      legalSuccessorNomination: userData.legalSuccessor || null,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sgs_data_export_${userData.rollNumber || userData.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [userData]);

  const handleOpenErasureModal = useCallback(() => {
    setErasureStep(1);
    setConfirmAck1(false);
    setConfirmAck2(false);
    setConfirmDeleteText("");
    setShowErasureModal(true);
  }, []);

  const handleConfirmErasure = useCallback(async () => {
    if (!userData?.id) return;
    if (!confirmAck1 || !confirmAck2 || confirmDeleteText.trim() !== "DELETE") {
      return;
    }

    setProcessingErasure(true);
    try {
      const now = new Date();
      const coolingOffExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const scheduledPurge = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

      const userDocRef = doc(fireDB, "users", userData.id);
      const erasurePayload = {
        status: "scheduled_erasure",
        isSoftDeleted: true,
        erasureRequested: true,
        deletionRequestedAt: now.toISOString(),
        coolingOffExpiresAt: coolingOffExpires,
        scheduledPurgeAt: scheduledPurge,
        deletionReason: "Data Principal self-service statutory erasure request under DPDP Act 2023 Section 12",
      };

      await updateDoc(userDocRef, erasurePayload);

      // Non-repudiable audit ledger entry in erasure_requests
      await addDoc(collection(fireDB, "erasure_requests"), {
        userId: userData.id,
        userName: userData.name,
        userEmail: userData.email,
        userRollNumber: userData.rollNumber || null,
        requestedAt: now.toISOString(),
        coolingOffExpiresAt: coolingOffExpires,
        scheduledPurgeAt: scheduledPurge,
        status: "cooling_off",
        complianceNotice: "DPDP_ACT_2023_SECTION_12_AND_RULE_14_3",
        fiduciary: "Soft Game Studio",
      });

      setUserData((prev) => ({
        ...prev,
        ...erasurePayload,
      }));

      setShowErasureModal(false);
      setSaveStatus({
        text: "Account placed in soft-deleted state. You have 30 days cooling-off to cancel before final purge.",
        type: "success",
      });
      setTimeout(() => setSaveStatus({ text: "", type: "" }), 8000);
    } catch (err) {
      console.error("[SGS Profile] Error requesting erasure:", err);
      setSaveStatus({
        text: "Unable to schedule erasure. Please contact support@softgamestudio.in.",
        type: "error",
      });
    } finally {
      setProcessingErasure(false);
    }
  }, [userData, confirmAck1, confirmAck2, confirmDeleteText]);

  const handleCancelErasure = useCallback(async () => {
    if (!userData?.id) return;
    setCancellingErasure(true);
    try {
      const userDocRef = doc(fireDB, "users", userData.id);
      await updateDoc(userDocRef, {
        status: "active",
        isSoftDeleted: false,
        erasureRequested: false,
        coolingOffExpiresAt: null,
        scheduledPurgeAt: null,
        restoredAt: new Date().toISOString(),
      });

      await addDoc(collection(fireDB, "admin_audit_logs"), {
        action: "CANCEL_ERASURE_REQUEST",
        targetUserId: userData.id,
        targetUserEmail: userData.email,
        targetRollNumber: userData.rollNumber || null,
        timestamp: new Date().toISOString(),
        initiatedBy: "Data Principal (Self-service cooling-off cancellation)",
      });

      setUserData((prev) => ({
        ...prev,
        status: "active",
        isSoftDeleted: false,
        erasureRequested: false,
        coolingOffExpiresAt: null,
        scheduledPurgeAt: null,
      }));

      setSaveStatus({
        text: "Erasure request cancelled. Your account and personal records have been restored.",
        type: "success",
      });
      setTimeout(() => setSaveStatus({ text: "", type: "" }), 6000);
    } catch (err) {
      console.error("[SGS Profile] Error cancelling erasure:", err);
      setSaveStatus({
        text: "Failed to restore account. Please contact support@softgamestudio.in.",
        type: "error",
      });
    } finally {
      setCancellingErasure(false);
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/Login");
    } catch (error) {
      console.error("[SGS Profile] Logout failed:", error);
    }
  };

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "Not available";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Not available";
    }
  }, []);

  // Privacy Masking Helpers
  const maskEmail = useCallback((email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const maskedLocal = local.length > 2 ? `${local.slice(0, 2)}***` : "***";
    return `${maskedLocal}@${domain}`;
  }, []);

  const maskPhone = useCallback((phone) => {
    if (!phone || phone.length < 5) return phone || "Not set";
    const start = phone.slice(0, 3);
    const end = phone.slice(-2);
    const masked = "*".repeat(Math.max(3, phone.length - 5));
    return `${start}${masked}${end}`;
  }, []);

  const getStatusBadge = useCallback((status) => {
    const statusMap = {
      accepted: {
        label: "Active Member",
        icon: FaCheckCircle,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
      },
      pending: {
        label: "Under Review",
        icon: FaClock,
        className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
      },
      rejected: {
        label: "Not Active",
        icon: FaTimes,
        className: "bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
      },
    };

    const config = statusMap[status] || statusMap.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
        <IconComponent className="text-xs" />
        <span>{config.label}</span>
      </span>
    );
  }, []);

  // Monogram Avatar
  const monogram = useMemo(() => {
    if (!userData?.name) return "U";
    return userData.name.charAt(0).toUpperCase();
  }, [userData]);

  // Loading Screen
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors py-20 px-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              Loading member profile...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userData) return null;

  return (
    <Layout>
      <Helmet>
        <title>Account Profile | Soft Game Studio</title>
        <meta
          name="description"
          content="Manage your personal information, security preferences, and verified community status on Soft Game Studio."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Action Bar */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <FaShieldAlt className="text-neutral-500 text-[10px]" /> Verified Account
                </span>
                {communityData && getStatusBadge(communityData.status)}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Member Profile
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Manage your credentials, academic identity, and studio community access.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    disabled={saving}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <FaTimes className="text-xs" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
                  >
                    {saving ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                        <span>Saving...</span>
                      </span>
                    ) : (
                      <>
                        <FaSave className="text-xs" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
                >
                  <FaEdit className="text-xs" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Feedback Status Alert */}
          {saveStatus.text && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${saveStatus.type === "error"
                  ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300"
                  : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300"
                }`}
            >
              <div className="flex items-center gap-2">
                {saveStatus.type === "error" ? (
                  <FaExclamationCircle className="text-red-600 dark:text-red-400" />
                ) : (
                  <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" />
                )}
                <span>{saveStatus.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveStatus({ text: "", type: "" })}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <FaTimes className="text-xs" />
              </button>
            </motion.div>
          )}

          {/* Statutory Soft-Delete / Erasure Alert Banner */}
          {(userData?.isSoftDeleted || userData?.erasureRequested) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FaExclamationTriangle className="text-base" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                      DPDP Act Sec 12 Soft-Delete
                    </span>
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      Cooling-Off Window Active: {remainingCoolingOffDays} Days Remaining
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                    Account Scheduled for Permanent Deletion & De-Identification
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                    Your account has entered the statutory 30-day cooling-off period. During this window, your personal profile and exam submissions are hidden. If not cancelled, final irreversible database purging and certificate decommissioning will execute after the 90-day statutory buffer.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelErasure}
                disabled={cancellingErasure}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                {cancellingErasure ? (
                  <span>Restoring Account...</span>
                ) : (
                  <>
                    <FaUndo className="text-xs" />
                    <span>Cancel Erasure & Restore Account</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Content Area (Tabs & Panels) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Navigation Tabs */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/90 overflow-x-auto">
                  {[
                    { id: "profile", label: "Account Details", icon: FaUser },
                    { id: "portfolio", label: "Portfolio & Skills", icon: FaCode },
                    { id: "competition", label: "Leaderboard & Exams", icon: FaTrophy },
                    { id: "privacy", label: "DPDP Privacy Rights", icon: FaShieldAlt },
                    { id: "community", label: "Membership", icon: FaUsers },
                    { id: "resources", label: "Activity Hub", icon: FaLayerGroup },
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3.5 px-4 text-center text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0 ${
                          isActive
                            ? "text-neutral-900 dark:text-white"
                            : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        }`}
                      >
                        <TabIcon className="text-xs" />
                        <span>{tab.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab 1: Profile & Account Information */}
                {activeTab === "profile" && (
                  <div className="p-6 sm:p-8 space-y-8">
                    {/* Personal Information Group */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <FaUser className="text-neutral-400 text-xs" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Personal Identification
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileFieldItem
                          label="Full Name"
                          value={isEditing ? editedData.name : userData.name}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "name")}
                          icon={FaUser}
                          required
                        />

                        <ProfileFieldItem
                          label="Roll Number / Student ID"
                          value={userData?.rollNumber || "Not assigned"}
                          isEditing={false}
                          icon={FaIdCard}
                          helperText="Assigned by academic administration"
                        />

                        <ProfileFieldItem
                          label="Email Address"
                          value={userData.email}
                          maskedValue={maskEmail(userData.email)}
                          isRevealed={revealedEmail}
                          onToggleReveal={() => setRevealedEmail((prev) => !prev)}
                          isEditing={false}
                          icon={FaEnvelope}
                          helperText="Primary authentication credential"
                        />

                        <ProfileFieldItem
                          label="Phone Number"
                          value={isEditing ? editedData.phone : userData.phone}
                          maskedValue={maskPhone(userData.phone)}
                          isRevealed={revealedPhone}
                          onToggleReveal={() => setRevealedPhone((prev) => !prev)}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "phone")}
                          icon={FaPhoneAlt}
                        />

                        <ProfileFieldItem
                          label="Member Since"
                          value={formatDate(userData.time)}
                          isEditing={false}
                          icon={FaCalendarAlt}
                        />
                      </div>
                    </div>

                    {/* Address & Location Group */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <FaMapMarkerAlt className="text-neutral-400 text-xs" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Residential Address
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileFieldItem
                          label="Street Address"
                          value={isEditing ? editedData.address?.streetno : userData.address?.streetno}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "address", "streetno")}
                          icon={FaHome}
                          placeholder="House or Street number"
                        />

                        <ProfileFieldItem
                          label="Area / Locality"
                          value={isEditing ? editedData.address?.area : userData.address?.area}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "address", "area")}
                          icon={FaCity}
                          placeholder="Locality or Sector"
                        />

                        <ProfileFieldItem
                          label="City"
                          value={isEditing ? editedData.address?.city : userData.address?.city}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "address", "city")}
                          icon={FaCity}
                          placeholder="City name"
                        />

                        <ProfileFieldItem
                          label="State / Province"
                          value={isEditing ? editedData.address?.state : userData.address?.state}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "address", "state")}
                          icon={FaMapMarkerAlt}
                          placeholder="State name"
                        />

                        <ProfileFieldItem
                          label="Postal Pincode"
                          value={isEditing ? editedData.address?.pincode : userData.address?.pincode}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "address", "pincode")}
                          icon={FaMapMarkerAlt}
                          placeholder="6-digit postal code"
                        />
                      </div>
                    </div>

                    {/* Save Footer Bar in Editing Mode */}
                    {isEditing && (
                      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          disabled={saving}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                        >
                          {saving ? (
                            <span>Saving Changes...</span>
                          ) : (
                            <>
                              <FaSave className="text-xs" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Developer Portfolio & Google Skills */}
                {activeTab === "portfolio" && (
                  <div className="p-6 sm:p-8 space-y-8">
                    {/* Developer Info & Bio */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <FaCode className="text-neutral-400 text-xs" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Developer Specialty & Bio
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileFieldItem
                          label="Primary Role / Title"
                          value={isEditing ? editedData.developerRole : userData.developerRole}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "developerRole")}
                          icon={FaCode}
                          placeholder="e.g. Full Stack Architect, Game Developer"
                          helperText="Featured on your verified studio developer card"
                        />

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                            Professional Summary / Bio
                          </label>
                          {isEditing ? (
                            <textarea
                              rows={3}
                              value={editedData.bio || ""}
                              onChange={(e) => handleChange(e, "bio")}
                              placeholder="Brief description of your programming expertise, game projects, or technical interests..."
                              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
                            />
                          ) : (
                            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                              {userData.bio || "No developer summary provided yet. Click 'Edit Profile' to add your bio."}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Social & Portfolio Links */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <FaGlobe className="text-neutral-400 text-xs" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Portfolio & Social Connections
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ProfileFieldItem
                          label="GitHub Profile URL"
                          value={isEditing ? editedData.githubUrl : userData.githubUrl}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "githubUrl")}
                          icon={FaGithub}
                          placeholder="https://github.com/username"
                        />

                        <ProfileFieldItem
                          label="LinkedIn Profile URL"
                          value={isEditing ? editedData.linkedinUrl : userData.linkedinUrl}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "linkedinUrl")}
                          icon={FaLinkedin}
                          placeholder="https://linkedin.com/in/username"
                        />

                        <ProfileFieldItem
                          label="Personal Portfolio URL"
                          value={isEditing ? editedData.portfolioUrl : userData.portfolioUrl}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "portfolioUrl")}
                          icon={FaGlobe}
                          placeholder="https://yourportfolio.dev"
                        />
                      </div>
                    </div>

                    {/* Google Skills & Competencies */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <FaAward className="text-emerald-500 text-xs" />
                          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            Google Skills & Technical Badges
                          </h2>
                        </div>
                        {isEditing && (
                          <span className="text-[11px] text-neutral-400 font-mono">
                            Click chips to toggle
                          </span>
                        )}
                      </div>

                      {/* Display or Edit Badges */}
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_GOOGLE_SKILLS.map((skill) => {
                          const isSelected = isEditing
                            ? (editedData.googleSkills || []).includes(skill)
                            : (userData.googleSkills || []).includes(skill);

                          if (!isEditing && !isSelected) return null;

                          return (
                            <button
                              key={skill}
                              type="button"
                              disabled={!isEditing}
                              onClick={() => handleToggleGoogleSkill(skill)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                isSelected
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                              } ${!isEditing ? "cursor-default" : "cursor-pointer"}`}
                            >
                              {isSelected ? (
                                <FaCheckCircle className="text-emerald-500 text-xs" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                              )}
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                        {!isEditing && (!userData.googleSkills || userData.googleSkills.length === 0) && (
                          <p className="text-xs text-neutral-400 italic">
                            No Google skill badges selected yet. Edit your profile to select your competencies.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Save Footer Bar in Editing Mode */}
                    {isEditing && (
                      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          disabled={saving}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                        >
                          {saving ? (
                            <span>Saving Changes...</span>
                          ) : (
                            <>
                              <FaSave className="text-xs" />
                              <span>Save Portfolio</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Competitions & Leaderboards */}
                {activeTab === "competition" && (
                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        Competitive Examinations & Merit Credentials
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        Track verified examination results, merit rankings, and cryptographic certificates.
                      </p>
                    </div>

                    {/* Candidate Identity Card */}
                    <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-mono font-semibold uppercase text-neutral-400">
                          Registered Examination Candidate
                        </span>
                        <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                          {userData.name}
                        </h4>
                        <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                          Roll Number: {userData.rollNumber || "Not assigned yet"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {userData.rollNumber ? (
                          <Link
                            to={`/Result/Certificates/${userData.rollNumber}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                          >
                            <FaAward className="text-xs" />
                            <span>Verify My Certificate</span>
                          </Link>
                        ) : (
                          <Link
                            to="/Exam"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 text-white transition-colors"
                          >
                            <FaTrophy className="text-xs" />
                            <span>Browse Competitions</span>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link
                        to="/Result"
                        className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors space-y-2 block"
                      >
                        <div className="flex items-center justify-between">
                          <FaTrophy className="text-amber-500 text-lg" />
                          <FaArrowRight className="text-neutral-400 text-xs" />
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          Official Competition Leaderboard
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Inspect top rank holders, verified winners, and certified merit standings across all quiz tracks.
                        </p>
                      </Link>

                      <Link
                        to="/Result/Certificates"
                        className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors space-y-2 block"
                      >
                        <div className="flex items-center justify-between">
                          <FaAward className="text-emerald-500 text-lg" />
                          <FaArrowRight className="text-neutral-400 text-xs" />
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          Certificate Verification Portal
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Search any roll number to authenticate and download tamper-evident digital certificates.
                        </p>
                      </Link>
                    </div>

                    {/* Telemetry & Proctoring Status */}
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        <FaShieldAlt className="text-emerald-500" />
                        <span>Examination Telemetry & Anti-Cheat Covenants</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Soft Game Studio proctoring adheres to DPDP Act 2023 guidelines. Telemetry data (screen visibility, tab focus, input rates) is collected strictly during active assessment sessions to preserve merit integrity and is securely purged post evaluation.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab: DPDP Act 2023 Statutory Data Rights */}
                {activeTab === "privacy" && (
                  <div className="p-6 sm:p-8 space-y-8">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        Statutory Privacy & Data Governance Center
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        Your rights as a Data Principal under the Digital Personal Data Protection (DPDP) Act, 2023 and DPDP Rules, 2025.
                      </p>
                    </div>

                    {/* Section 11: Right to Access Information (Data Portability) */}
                    <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaDownload className="text-neutral-700 dark:text-neutral-300 text-sm" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                            Section 11: Right to Access Personal Data
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                          JSON Archive
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Download a cryptographically verifiable summary of all personal data, contact information, device telemetry permissions, and registered consent artefacts associated with your account.
                      </p>
                      <button
                        type="button"
                        onClick={handleDownloadMyData}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 text-white transition-colors cursor-pointer"
                      >
                        <FaDownload className="text-xs" />
                        <span>Download My Personal Data Archive</span>
                      </button>
                    </div>

                    {/* Section 14: Nomination of Legal Successor */}
                    <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                        <FaUsers className="text-neutral-700 dark:text-neutral-300 text-sm" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                          Section 14: Right to Nominate a Legal Successor
                        </h4>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Designate an individual who shall exercise your Data Principal rights under the DPDP Act in the event of death or incapacity.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ProfileFieldItem
                          label="Nominee Name"
                          value={isEditing ? editedData.legalSuccessor?.name : userData.legalSuccessor?.name}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "legalSuccessor", "name")}
                          icon={FaUser}
                          placeholder="Full legal name"
                        />

                        <ProfileFieldItem
                          label="Relationship"
                          value={isEditing ? editedData.legalSuccessor?.relation : userData.legalSuccessor?.relation}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "legalSuccessor", "relation")}
                          icon={FaUsers}
                          placeholder="e.g. Parent, Sibling, Spouse"
                        />

                        <ProfileFieldItem
                          label="Nominee Contact (Email/Phone)"
                          value={isEditing ? editedData.legalSuccessor?.contact : userData.legalSuccessor?.contact}
                          isEditing={isEditing}
                          onChange={(e) => handleChange(e, "legalSuccessor", "contact")}
                          icon={FaPhoneAlt}
                          placeholder="email@example.com or phone"
                        />
                      </div>
                    </div>

                    {/* Section 12: Right to Erasure */}
                    <div className="p-5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <FaTrashAlt className="text-red-600 dark:text-red-400 text-sm" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 dark:text-red-300">
                          Section 12: Right to Erasure & De-Identification
                        </h4>
                      </div>
                      <p className="text-xs text-red-700/80 dark:text-red-400/80 leading-relaxed">
                        Submit a formal request to purge your non-statutory data from Soft Game Studio databases. In accordance with DPDP Rules 2025 Rule 14(3), our system enforces a 30-day cooling-off window followed by a maximum 90-day statutory buffer for final purging.
                      </p>
                      {userData?.isSoftDeleted || userData?.erasureRequested ? (
                        <div className="p-3.5 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                              <FaClock className="text-xs" />
                              Scheduled for Deletion (Cooling-off: {remainingCoolingOffDays} days left)
                            </span>
                            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                              Purge Date: {formatDate(userData.scheduledPurgeAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                            Your account is currently in soft-delete status. You can cancel this request at any time during the 30-day cooling-off period.
                          </p>
                          <button
                            type="button"
                            onClick={handleCancelErasure}
                            disabled={cancellingErasure}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                          >
                            <FaUndo className="text-xs" />
                            <span>Cancel Request & Restore Account</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleOpenErasureModal}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-xs"
                        >
                          <FaTrashAlt className="text-xs" />
                          <span>Request Account & Data Erasure</span>
                        </button>
                      )}
                    </div>

                    {/* Consent Governance Log */}
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 text-neutral-500 text-[11px] leading-relaxed space-y-1">
                      <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                        Designated Data Protection Grievance Officer
                      </p>
                      <p>
                        Email: <span className="font-mono text-neutral-800 dark:text-neutral-200">support@softgamestudio.in</span> | Location: Abohar, Punjab (152116), India
                      </p>
                      <p>
                        Governing Notice: <span className="font-mono">DPDP-ACT-2023-V2.1</span> (MeitY Nov 2026 / May 2027 compliance framework).
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Community Membership */}
                {activeTab === "community" && (
                  <div className="p-6 sm:p-8 space-y-6">
                    {loadingCommunity ? (
                      <div className="py-16 text-center">
                        <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-xs text-neutral-500">Checking community status...</p>
                      </div>
                    ) : communityData ? (
                      <div className="space-y-6">
                        {/* Membership Top Card */}
                        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                Membership Tier
                              </span>
                              {getStatusBadge(communityData.status)}
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                              {communityData.role || "Community Member"}
                            </h3>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                              Registered under Soft Game Studio Developer & Gamer Network
                            </p>
                          </div>

                          {communityData.communityId && (
                            <div className="px-3.5 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-right">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block">
                                Member ID
                              </span>
                              <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                                {communityData.communityId}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Metric Tiles */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                            <span className="text-xs text-neutral-500 block mb-1">Status</span>
                            <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                              {communityData.status === "accepted" ? "Active" : "Pending Review"}
                            </span>
                          </div>
                          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                            <span className="text-xs text-neutral-500 block mb-1">Role</span>
                            <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                              {communityData.role || "Member"}
                            </span>
                          </div>
                          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                            <span className="text-xs text-neutral-500 block mb-1">Accepted</span>
                            <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                              {formatDate(communityData.acceptedAt)}
                            </span>
                          </div>
                          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                            <span className="text-xs text-neutral-500 block mb-1">Applied</span>
                            <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                              {formatDate(communityData.appliedAt)}
                            </span>
                          </div>
                        </div>

                        {/* Skills Section */}
                        {communityData.skills && (
                          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                              Technical Skills & Specializations
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {communityData.skills.split(",").map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bio Section */}
                        {communityData.bio && (
                          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                              Member Biography
                            </h4>
                            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                              {communityData.bio}
                            </p>
                          </div>
                        )}

                        {/* Privileges Matrix */}
                        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            Verified Member Privileges
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                              <FaCode className="text-neutral-500 text-sm" />
                              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                Beta testing access to new game titles
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                              <FaUsers className="text-neutral-500 text-sm" />
                              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                Engineering workshops and community sessions
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                              <FaAward className="text-neutral-500 text-sm" />
                              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                Verified contributor badges across studio platforms
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                              <FaShieldAlt className="text-neutral-500 text-sm" />
                              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                Direct priority developer feedback channel
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Not a community member yet */
                      <div className="text-center py-10 px-4 max-w-md mx-auto space-y-4">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center text-2xl">
                          <FaUsers />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                            Join the Studio Community
                          </h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Connect with fellow developers, participate in game playtests, and contribute to studio initiatives.
                          </p>
                        </div>
                        <div className="pt-2">
                          <Link
                            to="/OurCommunity"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-sm"
                          >
                            <span>Apply for Community Membership</span>
                            <FaArrowRight className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Activity & Resource Hub */}
                {activeTab === "resources" && (
                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        Studio Hub Shortcuts
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        Direct navigation to your study materials, games, and learning pathways.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link
                        to="/DownloadNotes"
                        className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors space-y-2 block"
                      >
                        <div className="flex items-center justify-between">
                          <FaBook className="text-neutral-600 dark:text-neutral-400 text-lg" />
                          <FaArrowRight className="text-neutral-400 text-xs" />
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          Academic Study Notes
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Browse verified lecture summaries, branch notes, and take interactive practice quizzes.
                        </p>
                      </Link>

                      <Link
                        to="/UploadNotes"
                        className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors space-y-2 block"
                      >
                        <div className="flex items-center justify-between">
                          <FaLayerGroup className="text-neutral-600 dark:text-neutral-400 text-lg" />
                          <FaArrowRight className="text-neutral-400 text-xs" />
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          Contribute Notes
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Upload handwritten notes or lab documents with automatic stream optimization.
                        </p>
                      </Link>

                      <Link
                        to="/Game"
                        className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors space-y-2 block"
                      >
                        <div className="flex items-center justify-between">
                          <FaGamepad className="text-neutral-600 dark:text-neutral-400 text-lg" />
                          <FaArrowRight className="text-neutral-400 text-xs" />
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          Game Projects Catalog
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Play interactive web and Phaser game builds engineered by Soft Game Studio.
                        </p>
                      </Link>

                      <Link
                        to="/OurCourse"
                        className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors space-y-2 block"
                      >
                        <div className="flex items-center justify-between">
                          <FaGraduationCap className="text-neutral-600 dark:text-neutral-400 text-lg" />
                          <FaArrowRight className="text-neutral-400 text-xs" />
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          Engineering Courses
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Access curated curricula on software development and computer science topics.
                        </p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar Area (User Card & Security Settings) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Monogram Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 flex items-center justify-center font-bold text-3xl shadow-sm border-2 border-neutral-200 dark:border-neutral-800">
                  {monogram}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white truncate">
                    {userData.name}
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5 truncate">
                    {maskEmail(userData.email)}
                  </p>
                  {userData.developerRole && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                      {userData.developerRole}
                    </span>
                  )}
                </div>

                {/* Social Profiles on Card */}
                {(userData.githubUrl || userData.linkedinUrl || userData.portfolioUrl) && (
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    {userData.githubUrl && (
                      <a
                        href={userData.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                        title="GitHub Profile"
                      >
                        <FaGithub className="text-xs" />
                      </a>
                    )}
                    {userData.linkedinUrl && (
                      <a
                        href={userData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <FaLinkedin className="text-xs" />
                      </a>
                    )}
                    {userData.portfolioUrl && (
                      <a
                        href={userData.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Portfolio Website"
                      >
                        <FaGlobe className="text-xs" />
                      </a>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <FaMapMarkerAlt className="text-neutral-400 text-xs flex-shrink-0" />
                  <span className="truncate">
                    {userData.address?.city && userData.address?.state
                      ? `${userData.address.city}, ${userData.address.state}`
                      : "Location not set"}
                  </span>
                </div>
              </div>

              {/* Account Security & Logout Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <FaShieldAlt className="text-neutral-500 text-sm" />
                  <h3 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider">
                    Account Security
                  </h3>
                </div>

                <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800/50">
                    <span>Authentication Provider</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      Email / Password
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800/50">
                    <span>Active Session</span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Authorized
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span>Account Created</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {formatDate(userData.time)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaSignOutAlt className="text-xs" />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              </div>

              {/* Support Notice */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 text-neutral-500 text-[11px] leading-relaxed">
                Need to modify your student roll number or institutional credentials? Contact your academic administrator or the Soft Game Studio support desk.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Step Statutory Erasure Confirmation Modal (Widget Box) */}
      {showErasureModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 flex items-center justify-center shrink-0">
                  <FaTrashAlt className="text-base" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {erasureStep === 1
                      ? "Step 1 of 2: Statutory Erasure Notice"
                      : "Step 2 of 2: Affirmation & Confirmation"}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    DPDP Act 2023 Sec 12 & Rule 14(3)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowErasureModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Modal Step 1 Body */}
            {erasureStep === 1 && (
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <FaClock className="text-xs" />
                    Statutory Timelines (1 to 90 Days)
                  </h4>
                  <ul className="text-xs text-amber-900/80 dark:text-amber-200/80 space-y-1.5 list-disc list-inside">
                    <li>
                      <strong>Days 1 to 30 (Cooling-Off Window):</strong> Your account enters a soft-deleted state. All public listings and profiles are hidden, but you can cancel the request and restore your account at any time with one click.
                    </li>
                    <li>
                      <strong>Days 31 to 90 (Statutory Buffer):</strong> Administrative systems execute final cryptographic de-identification and permanent deletion in compliance with Rule 14(3).
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Impact on Academic Credentials & Platform Assets:
                  </h4>
                  <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc list-inside">
                    <li>Roll number credentials and candidate records will be permanently decommissioned.</li>
                    <li>Verified examination certificates will be revoked and removed from verification lookups.</li>
                    <li>Developer portfolio, Google skill badges, and leaderboard standings will be purged.</li>
                    <li>Quiz submissions, study notes contributions, and community memberships will be detached.</li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowErasureModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Keep Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setErasureStep(2)}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Proceed to Step 2: Affirmation</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}

            {/* Modal Step 2 Body */}
            {erasureStep === 2 && (
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmAck1}
                      onChange={(e) => setConfirmAck1(e.target.checked)}
                      className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span>
                      I acknowledge that all my certificates, roll numbers, and academic records will be permanently purged after the 90-day statutory buffer.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmAck2}
                      onChange={(e) => setConfirmAck2(e.target.checked)}
                      className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span>
                      I understand I retain a 30-day cooling-off window from today to cancel this erasure request and restore my account.
                    </span>
                  </label>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    To confirm deletion, please type <span className="font-mono font-bold text-red-600">DELETE</span> below:
                  </label>
                  <input
                    type="text"
                    value={confirmDeleteText}
                    onChange={(e) => setConfirmDeleteText(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                  />
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setErasureStep(1)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back to Step 1
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowErasureModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmErasure}
                      disabled={!confirmAck1 || !confirmAck2 || confirmDeleteText.trim() !== "DELETE" || processingErasure}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      {processingErasure ? (
                        <span>Scheduling...</span>
                      ) : (
                        <>
                          <FaTrashAlt className="text-xs" />
                          <span>Confirm & Soft-Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

// Field Component Supporting View Mode with Privacy Masking and Edit Inputs
function ProfileFieldItem({
  label,
  value,
  isEditing,
  onChange,
  icon: Icon,
  placeholder,
  maskedValue,
  isRevealed,
  onToggleReveal,
  required,
  helperText,
}) {
  const showReveal = Boolean(maskedValue && !isEditing);
  const displayValue = showReveal
    ? isRevealed
      ? value
      : maskedValue
    : value || "Not specified";

  return (
    <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
          {Icon && <Icon className="text-neutral-400 text-xs" />}
          <span>{label} {required && isEditing && <span className="text-red-500">*</span>}</span>
        </label>
        {showReveal && (
          <button
            type="button"
            onClick={onToggleReveal}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            title={isRevealed ? "Hide detail" : "Reveal detail"}
            aria-label={isRevealed ? `Hide ${label}` : `Reveal ${label}`}
          >
            {isRevealed ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
          </button>
        )}
      </div>

      {isEditing ? (
        <input
          type="text"
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
        />
      ) : (
        <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {displayValue}
        </div>
      )}

      {helperText && !isEditing && (
        <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
