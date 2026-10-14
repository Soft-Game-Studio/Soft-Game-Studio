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
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
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
  FaArrowRight,
  FaSignOutAlt,
  FaLayerGroup,
  FaCode,
  FaCheck,
  FaIdCard
} from "react-icons/fa";
import { useAuth } from "../../AuthProvide";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet-async";

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
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [communityData, setCommunityData] = useState(null);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [revealedEmail, setRevealedEmail] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(false);

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
      const userDocRef = doc(fireDB, "users", userData.id);
      await updateDoc(userDocRef, {
        name: editedData.name.trim(),
        phone: editedData.phone.trim(),
        address: {
          streetno: editedData.address?.streetno?.trim() || "",
          area: editedData.address?.area?.trim() || "",
          city: editedData.address?.city?.trim() || "",
          state: editedData.address?.state?.trim() || "",
          pincode: editedData.address?.pincode?.trim() || "",
        },
      });

      setUserData((prev) => ({
        ...prev,
        name: editedData.name.trim(),
        phone: editedData.phone.trim(),
        address: {
          streetno: editedData.address?.streetno?.trim() || "",
          area: editedData.address?.area?.trim() || "",
          city: editedData.address?.city?.trim() || "",
          state: editedData.address?.state?.trim() || "",
          pincode: editedData.address?.pincode?.trim() || "",
        },
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

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Content Area (Tabs & Panels) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Navigation Tabs */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/90">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 py-3.5 px-4 text-center text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer ${activeTab === "profile"
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      }`}
                  >
                    <span>Account Details</span>
                    {activeTab === "profile" && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("community")}
                    className={`flex-1 py-3.5 px-4 text-center text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer ${activeTab === "community"
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      }`}
                  >
                    <span>Community Membership</span>
                    {activeTab === "community" && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("resources")}
                    className={`flex-1 py-3.5 px-4 text-center text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer ${activeTab === "resources"
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      }`}
                  >
                    <span>Activity & Hub</span>
                    {activeTab === "resources" && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white"
                      />
                    )}
                  </button>
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
                </div>

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
