import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import {
  FaEdit,
  FaSave,
  FaStar,
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
  FaShieldAlt,
  FaAward,
  FaClock,
  FaRocket,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaGamepad,
} from "react-icons/fa";
import { useAuth } from "../../AuthProvide";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const [communityData, setCommunityData] = useState(null);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [revealedEmail, setRevealedEmail] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = user;
        if (!storedUser?.email) {
          navigate("/Login");
          return;
        }

        const usersRef = collection(fireDB, "users");
        const q = query(usersRef, where("email", "==", storedUser?.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            setUserData({ id: doc.id, ...data });
            setEditedData({
              name: data.name,
              phone: data.phone,
              address: { ...data.address },
            });
          });
        } else {
          navigate("/Login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, user]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!user?.uid) return;

      setLoadingCommunity(true);
      try {
        const communityRef = collection(fireDB, "communityMembers");
        const q = query(communityRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const docData = doc.data();

          setCommunityData({
            id: doc.id,
            ...docData,
            acceptedAt: docData.acceptedAt,
            appliedAt: docData.appliedAt,
            updatedAt: docData.updatedAt,
          });
        } else {
          setCommunityData(null);
        }
      } catch (error) {
        console.error("Error loading community data:", error);
        setCommunityData(null);
      } finally {
        setLoadingCommunity(false);
      }
    };

    if (user?.uid) {
      fetchCommunityData();
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e, field, nestedField = null) => {
    if (nestedField) {
      setEditedData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: e.target.value,
        },
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const userDoc = doc(fireDB, "users", userData.id);
      await updateDoc(userDoc, editedData);

      setUserData((prev) => ({
        ...prev,
        ...editedData,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-500/20 text-amber-100 border border-amber-500/30",
        glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
        icon: "⏳",
      },
      accepted: {
        color:
          "bg-emerald-500/20 text-emerald-100 border border-emerald-500/30",
        glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
        icon: "✨",
      },
      rejected: {
        color: "bg-rose-500/20 text-rose-100 border border-rose-500/30",
        glow: "shadow-[0_0_20px_rgba(244,63,94,0.3)]",
        icon: "🔄",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <div
        className={`px-4 py-2 rounded-full backdrop-blur-sm ${config.color} ${config.glow} flex items-center gap-2 w-fit`}
      >
        <span className="text-sm">{config.icon}</span>
        <span className="text-sm font-medium">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Not available";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Not available";
    }
  };

  // Masking helpers
  const maskEmail = (email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const maskedLocal = local.length > 1 ? local.charAt(0) + "***" : "***";
    return `${maskedLocal}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone || phone.length < 5) return phone;
    const start = phone.slice(0, 3);
    const end = phone.slice(-2);
    const masked = "*".repeat(phone.length - 5);
    return `${start}${masked}${end}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-24 h-24 relative"
          >
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-blue-400 blur-sm"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-blue-400"></div>
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6 text-lg text-white/70 font-light tracking-widest"
          >
            LOADING PROFILE
          </motion.p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  // Letter avatar
  const firstLetter = userData.name?.charAt(0).toUpperCase() || "?";

  return (
    <Layout>
      <Helmet>
        <title>Profile | Soft Game Studios</title>
        <meta
          name="description"
          content="Your personal profile at Soft Game Studios. Manage your information, track community status, and access exclusive member benefits."
        />
        <meta
          name="keywords"
          content="game studio profile, player dashboard, community member, gaming profile"
        />
      </Helmet>

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="min-h-screen pt-6 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Profile
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  Manage your account and community status
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditToggle}
                className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2 text-white font-medium">
                  {isEditing ? (
                    <>
                      <FaTimes className="text-lg" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit className="text-lg" />
                      Edit Profile
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="flex border-b border-slate-700/50">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 relative ${activeTab === "profile" ? "text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    <span className="relative">
                      Profile Info
                      {activeTab === "profile" && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("community")}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 relative ${activeTab === "community" ? "text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    <span className="relative">
                      Community
                      {activeTab === "community" && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                      )}
                    </span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-8"
                  >
                    {activeTab === "profile" ? (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-purple-500/20">
                                <FaUser className="text-purple-400" />
                              </div>
                              Personal Information
                            </h3>
                            <div className="space-y-4">
                              <InfoItem
                                label="Full Name"
                                value={
                                  isEditing ? editedData.name : userData.name
                                }
                                isEditing={isEditing}
                                onChange={(e) => handleChange(e, "name")}
                                icon="👤"
                              />
                              <InfoItem
                                label="Email Address"
                                value={userData.email}
                                maskedValue={maskEmail(userData.email)}
                                isRevealed={revealedEmail}
                                onToggleReveal={() =>
                                  setRevealedEmail(!revealedEmail)
                                }
                                icon="✉️"
                                isEditing={false}
                              />
                              <InfoItem
                                label="Phone"
                                value={userData.phone}
                                maskedValue={maskPhone(userData.phone)}
                                isRevealed={revealedPhone}
                                onToggleReveal={() =>
                                  setRevealedPhone(!revealedPhone)
                                }
                                icon="📱"
                                isEditing={false}
                              />
                              {/* Existing items */}
                              <InfoItem
                                label="Member Since"
                                value={formatDate(userData.time)}
                                icon="📅"
                                isEditing={false}
                              />

                              {/* 👇 NEW: Roll Number */}
                              <InfoItem
                                label="Roll Number"
                                value={userData?.rollNumber || "Not assigned"}
                                icon="🎓"
                                isEditing={false}
                              />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-blue-500/20">
                                <FaMapMarkerAlt className="text-blue-400" />
                              </div>
                              Location
                            </h3>
                            <div className="space-y-4">
                              <InfoItem
                                label="Street Address"
                                value={
                                  isEditing
                                    ? editedData.address?.streetno
                                    : userData.address?.streetno
                                }
                                isEditing={isEditing}
                                onChange={(e) =>
                                  handleChange(e, "address", "streetno")
                                }
                                icon="📍"
                              />
                              <InfoItem
                                label="Area"
                                value={
                                  isEditing
                                    ? editedData.address?.area
                                    : userData.address?.area
                                }
                                isEditing={isEditing}
                                onChange={(e) =>
                                  handleChange(e, "address", "area")
                                }
                                icon="🏘️"
                              />
                              <InfoItem
                                label="City"
                                value={
                                  isEditing
                                    ? editedData.address?.city
                                    : userData.address?.city
                                }
                                isEditing={isEditing}
                                onChange={(e) =>
                                  handleChange(e, "address", "city")
                                }
                                icon="🏙️"
                              />
                              <InfoItem
                                label="State"
                                value={
                                  isEditing
                                    ? editedData.address?.state
                                    : userData.address?.state
                                }
                                isEditing={isEditing}
                                onChange={(e) =>
                                  handleChange(e, "address", "state")
                                }
                                icon="🗺️"
                              />
                              <InfoItem
                                label="Pincode"
                                value={
                                  isEditing
                                    ? editedData.address?.pincode
                                    : userData.address?.pincode
                                }
                                isEditing={isEditing}
                                onChange={(e) =>
                                  handleChange(e, "address", "pincode")
                                }
                                icon="📮"
                              />
                            </div>
                          </div>
                        </div>

                        {isEditing && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end"
                          >
                            <button
                              onClick={handleSave}
                              className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25"
                            >
                              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                              <span className="relative flex items-center gap-2 text-white font-semibold">
                                <FaSave />
                                Save Changes
                              </span>
                            </button>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <CommunityStatusTab
                        communityData={communityData}
                        loadingCommunity={loadingCommunity}
                        userData={userData}
                        formatDate={formatDate}
                        navigate={navigate}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1">
                      <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                        <span className="text-5xl font-bold text-slate-300">
                          {firstLetter}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {userData.name}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-300 mb-4">
                    <FaMapMarkerAlt className="text-sm" />
                    <span>
                      {userData.address?.city}, {userData.address?.state}
                    </span>
                  </div>

                  {!loadingCommunity && communityData && (
                    <div className="mb-6">
                      {getStatusBadge(communityData.status)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Community Tab (unchanged)
const CommunityStatusTab = ({
  communityData,
  loadingCommunity,
  userData,
  formatDate,
  navigate,
}) => {
  if (loadingCommunity) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (communityData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Community{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Membership
              </span>
            </h3>
            <p className="text-slate-300">
              Welcome to our exclusive gaming community
            </p>
          </div>
          {communityData.communityId && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700/50">
              <div className="text-slate-400 text-sm">Community ID</div>
              <div className="text-white font-mono font-bold">
                {communityData.communityId}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <FaShieldAlt className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Status</div>
                  <div className="text-white font-semibold">
                    {communityData.status === "accepted"
                      ? "Active Member"
                      : communityData.status === "pending"
                        ? "Under Review"
                        : "Not Accepted"}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FaAward className="text-blue-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Role</div>
                  <div className="text-white font-semibold">
                    {communityData.role || "Member"}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <FaClock className="text-purple-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Member Since</div>
                  <div className="text-white font-semibold">
                    {formatDate(communityData.acceptedAt)}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <FaCalendarAlt className="text-amber-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Applied On</div>
                  <div className="text-white font-semibold">
                    {formatDate(communityData.appliedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {communityData.skills && (
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Skills & Expertise
            </h4>
            <div className="flex flex-wrap gap-2">
              {communityData.skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-100 rounded-full text-sm border border-purple-500/30"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {communityData.bio && (
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">About Me</h4>
            <p className="text-slate-300 leading-relaxed">
              {communityData.bio}
            </p>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Community Benefits
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: FaRocket, text: "Early game access" },
              { icon: FaUsers, text: "Exclusive events" },
              { icon: FaAward, text: "Special badges" },
              { icon: FaStar, text: "Premium support" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <benefit.icon className="text-white text-lg" />
                  </div>
                  <span className="text-white font-medium">{benefit.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="relative bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed border-purple-500/30 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                <FaUsers className="text-4xl text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Join Our Gaming Community
            </h3>
            <p className="text-slate-300 mb-6">
              Connect with fellow gamers, get early access to new releases, and
              participate in exclusive events.
            </p>
            <div className="space-y-3 mb-6">
              {[
                "Exclusive beta testing access",
                "Monthly gaming tournaments",
                "Developer Q&A sessions",
                "Early game discounts",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-slate-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/OurCommunity")}
              className="relative px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              Join Community
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Updated InfoItem with reveal support
const InfoItem = ({
  label,
  value,
  isEditing,
  onChange,
  icon,
  maskedValue,
  isRevealed,
  onToggleReveal,
}) => {
  const showReveal = maskedValue && !isEditing; // only when not editing and maskedValue exists

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-slate-400 font-medium">{label}</span>
      </div>

      {isEditing ? (
        <input
          type="text"
          value={value || ""}
          onChange={onChange}
          className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white w-48 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-white font-medium truncate max-w-[200px]">
            {showReveal
              ? isRevealed
                ? value
                : maskedValue
              : value || "Not set"}
          </span>
          {showReveal && (
            <button
              onClick={onToggleReveal}
              className="p-1 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              title={isRevealed ? "Hide" : "Reveal"}
            >
              {isRevealed ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
