// src/components/Members/CommunityMembers.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion
} from "framer-motion";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { fireDB, storage } from "../../DataBase/firebaseConfig";
import Layout from "../layout/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "../../AuthProvide";
import { useNavigate } from "react-router-dom";
import {
  Linkedin,
  Github,
  Instagram,
  Search,
  ArrowUp,
  X,
  ExternalLink,
  UserPlus,
  CheckCircle2,
  Clock,
  Edit3,
  User,
  Save,
  Monitor,
  Smartphone,
  Tablet,
  Users,
  Grid3X3,
  List,
  AlertCircle,
  Upload,
  Info,
  ChevronDown
} from "lucide-react";

// Platform-specific social link icon
const SocialIcon = ({ platform, url }) => {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      case "github":
        return <Github className="w-4 h-4" />;
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${platform} profile`}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-[#00ACF0] dark:hover:text-sky-400 transition-colors"
    >
      {getIcon()}
    </a>
  );
};

// Clean status badge
const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || "pending").toLowerCase();

  const statusConfig = {
    accepted: {
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />,
      label: "ACCEPTED"
    },
    pending: {
      color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />,
      label: "IN REVIEW"
    },
    rejected: {
      color: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
      icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600 dark:text-rose-400" />,
      label: "REJECTED"
    }
  };

  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

// Device indicator
const DeviceBadge = ({ device }) => {
  const getDeviceIcon = () => {
    switch (device) {
      case "Mobile":
        return <Smartphone className="w-3 h-3 mr-1" />;
      case "Tablet":
        return <Tablet className="w-3 h-3 mr-1" />;
      default:
        return <Monitor className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
      {getDeviceIcon()}
      {device || "Web"}
    </span>
  );
};

// Community member card
const MemberCard = ({
  member,
  layoutType,
  onMemberClick,
  isCurrentUser = false,
  onEditClick
}) => {
  if (layoutType === "grid") {
    return (
      <div
        className={`group relative bg-white dark:bg-neutral-900 rounded-2xl p-6 border transition-all duration-300 cursor-pointer shadow-sm flex flex-col justify-between ${
          isCurrentUser
            ? "border-[#00ACF0] ring-1 ring-[#00ACF0]/40"
            : "border-neutral-200 dark:border-neutral-800 hover:border-[#00ACF0]/40"
        }`}
        onClick={() => onMemberClick(member)}
      >
        {isCurrentUser && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(member);
              }}
              className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/60 text-[#00ACF0] hover:bg-[#00ACF0] hover:text-white border border-sky-200 dark:border-sky-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold rounded-lg">
              You
            </span>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 mt-2">
            {member.photoUrl ? (
              <img
                alt={member.name}
                loading="lazy"
                className="w-24 h-24 object-cover rounded-full border-2 border-neutral-200 dark:border-neutral-700 shadow-sm group-hover:scale-105 transition-transform"
                src={member.photoUrl}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-2xl font-bold text-[#00ACF0]">
                {member.name ? member.name.charAt(0) : "C"}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <StatusBadge status={member.status} />
            {member.communityId && (
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {member.communityId}
              </span>
            )}
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-[#00ACF0] mt-1">
            {member.role || "Community Member"}
          </p>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
            {member.name}
          </h3>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
            {member.bio || `${member.role || "Member"} in the Soft Game Studio Community`}
          </p>

          {member.skills && (
            <div className="flex justify-center flex-wrap gap-1.5 mt-4">
              {member.skills.split(",").slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800 w-full">
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {member.socialLinks &&
              Object.entries(member.socialLinks).map(
                ([platform, url]) => url && <SocialIcon key={platform} platform={platform} url={url} />
              )}
          </div>
          {member.deviceInfo && <DeviceBadge device={member.deviceInfo.device} />}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative bg-white dark:bg-neutral-900 rounded-2xl p-6 border transition-all duration-300 cursor-pointer shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${
        isCurrentUser
          ? "border-[#00ACF0] ring-1 ring-[#00ACF0]/40"
          : "border-neutral-200 dark:border-neutral-800 hover:border-[#00ACF0]/40"
      }`}
      onClick={() => onMemberClick(member)}
    >
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          {member.photoUrl ? (
            <img
              alt={member.name}
              loading="lazy"
              className="w-16 h-16 object-cover rounded-full border-2 border-neutral-200 dark:border-neutral-700 shadow-sm group-hover:scale-105 transition-transform"
              src={member.photoUrl}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-xl font-bold text-[#00ACF0]">
              {member.name ? member.name.charAt(0) : "C"}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {member.name}
            </h3>
            <StatusBadge status={member.status} />
            {member.communityId && (
              <span className="text-xs font-mono text-neutral-400">
                {member.communityId}
              </span>
            )}
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold rounded">
                You
              </span>
            )}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#00ACF0]">
            {member.role || "Community Member"}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-lg line-clamp-2 leading-relaxed">
            {member.bio || `${member.role || "Member"} in the Soft Game Studio Community`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {member.socialLinks &&
            Object.entries(member.socialLinks).map(
              ([platform, url]) => url && <SocialIcon key={platform} platform={platform} url={url} />
            )}
        </div>
        {isCurrentUser && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(member);
            }}
            className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-[#00ACF0] hover:bg-[#00ACF0] hover:text-white border border-sky-200 dark:border-sky-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

// Modal for full member details
const MemberModal = ({ member, isOpen, onClose, onEditClick, isCurrentUser = false }) => {
  if (!isOpen || !member) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="community-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-4">
                {member.photoUrl ? (
                  <img
                    alt={member.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-neutral-200 dark:border-neutral-700 shadow-sm"
                    src={member.photoUrl}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-2xl font-bold text-[#00ACF0]">
                    {member.name ? member.name.charAt(0) : "C"}
                  </div>
                )}
                <div>
                  <h2 id="community-modal-title" className="text-xl font-bold text-neutral-900 dark:text-white">
                    {member.name}
                  </h2>
                  <p className="text-xs font-semibold text-[#00ACF0] uppercase tracking-wide">
                    {member.role || "Community Member"}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={member.status} />
                    {member.communityId && (
                      <span className="text-xs font-mono text-neutral-400">
                        {member.communityId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCurrentUser && (
                  <button
                    onClick={() => onEditClick(member)}
                    className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-[#00ACF0] hover:bg-[#00ACF0] hover:text-white transition"
                    aria-label="Edit Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5">
                  About Member
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {member.bio || `${member.role || "Member"} in the Soft Game Studio Community`}
                </p>
              </div>

              {member.skills && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    Skills & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.socialLinks && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    Social & Portfolio
                  </h3>
                  <div className="flex items-center gap-2">
                    {Object.entries(member.socialLinks).map(
                      ([platform, url]) => url && <SocialIcon key={platform} platform={platform} url={url} />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Profile update modal for authenticated owner
const ProfileUpdateModal = ({ isOpen, onClose, memberData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    bio: "",
    contactInfo: "",
    socialLinks: {
      linkedin: "",
      github: "",
      instagram: ""
    }
  });
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (memberData && isOpen) {
      setFormData({
        name: memberData.name || "",
        skills: memberData.skills || "",
        bio: memberData.bio || "",
        contactInfo: memberData.contactInfo || "",
        socialLinks: {
          linkedin: memberData.socialLinks?.linkedin || "",
          github: memberData.socialLinks?.github || "",
          instagram: memberData.socialLinks?.instagram || ""
        }
      });

      if (memberData.photoUrl) {
        setPreviewUrl(memberData.photoUrl);
      }
    }
  }, [memberData, isOpen]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialLinkChange = (platform, url) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url
      }
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let photoUrl = memberData.photoUrl;

      if (photo) {
        const storageRef = ref(storage, `community-members/${Date.now()}_${photo.name}`);
        const snapshot = await uploadBytes(storageRef, photo);
        photoUrl = await getDownloadURL(snapshot.ref);

        if (memberData.photoUrl) {
          try {
            const oldPhotoRef = ref(storage, memberData.photoUrl);
            await deleteObject(oldPhotoRef);
          } catch (err) {
            console.log("Old photo clean-up notice:", err);
          }
        }
      }

      const memberRef = doc(fireDB, "communityMembers", memberData.id);
      await updateDoc(memberRef, {
        ...formData,
        photoUrl,
        updatedAt: serverTimestamp()
      });

      setMessage({ text: "Profile updated successfully!", type: "success" });

      if (onUpdate) {
        onUpdate({ ...formData, photoUrl, id: memberData.id });
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: "Failed to update profile. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Update Profile
              </h2>
              <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
                }`}
              >
                {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Skills (comma separated) *
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. React, Unity, C#, 3D Modeling"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bio / About Yourself *
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your background and interests..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Contact Info *
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                  placeholder="Phone number or preferred contact"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Social Links
                </label>
                <div className="space-y-2">
                  {Object.entries(formData.socialLinks).map(([platform, url]) => (
                    <div key={platform} className="flex items-center gap-2">
                      <span className="w-20 text-xs text-neutral-500 capitalize">{platform}</span>
                      <input
                        type="url"
                        placeholder={`https://${platform}.com/...`}
                        value={url}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#00ACF0]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="flex-1 text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 dark:file:bg-neutral-800 file:text-neutral-700 dark:file:text-neutral-300 hover:file:bg-neutral-200"
                  />
                  {previewUrl && (
                    <div className="relative shrink-0">
                      <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border" />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Sequential community ID generator
const generateCommunityId = async () => {
  try {
    const querySnapshot = await getDocs(collection(fireDB, "communityMembers"));
    const members = querySnapshot.docs.map((d) => d.data());

    const communityIds = members
      .map((m) => m.communityId)
      .filter((id) => id && id.startsWith("SGSCOM"))
      .map((id) => {
        const num = id.replace("SGSCOM", "");
        return parseInt(num, 10) || 0;
      });

    const highestId = communityIds.length > 0 ? Math.max(...communityIds) : 0;
    const nextId = highestId + 1;
    return `SGSCOM${nextId.toString().padStart(3, "0")}`;
  } catch (error) {
    console.error("Error generating community ID:", error);
    return `SGSCOM${Date.now().toString().slice(-6)}`;
  }
};

// Modal for new applicants
const ApplicationModal = ({ isOpen, onClose, onSubmit, userData, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    bio: "",
    contactInfo: "",
    socialLinks: {
      linkedin: "",
      github: "",
      instagram: ""
    }
  });
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        name: userData.name || "",
        skills: userData.skills || "",
        bio: userData.bio || "",
        contactInfo: userData.phone || userData.contactInfo || "",
        socialLinks: {
          linkedin: userData.socialLinks?.linkedin || "",
          github: userData.socialLinks?.github || "",
          instagram: userData.socialLinks?.instagram || ""
        }
      });

      if (userData.photoUrl) {
        setPreviewUrl(userData.photoUrl);
      }
    }
  }, [userData, isOpen]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialLinkChange = (platform, url) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url
      }
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let photoUrl = "";

      if (photo) {
        const storageRef = ref(storage, `community-members/${Date.now()}_${photo.name}`);
        const snapshot = await uploadBytes(storageRef, photo);
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      const communityId = await generateCommunityId();

      await addDoc(collection(fireDB, "communityMembers"), {
        ...formData,
        photoUrl,
        communityId,
        status: "pending",
        appliedAt: serverTimestamp(),
        userId: user?.uid,
        userEmail: user?.email
      });

      setMessage({ text: "Application submitted! We will review your profile shortly.", type: "success" });

      setTimeout(() => {
        onSubmit();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage({ text: "Failed to submit application. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Join SGS Community
              </h2>
              <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {userData && (
              <div className="mb-4 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs flex items-center gap-2 text-sky-800 dark:text-sky-300">
                <Info className="w-4 h-4 shrink-0 text-[#00ACF0]" />
                <span>Information pre-filled from your registered account.</span>
              </div>
            )}

            {message.text && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
                }`}
              >
                {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Skills (comma separated) *
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Unity, Unreal Engine, JavaScript, Pixel Art"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bio / Introduction *
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us what you make and what you're working towards..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Contact Number / WhatsApp *
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. +91 9914267704"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Social Links (Optional)
                </label>
                <div className="space-y-2">
                  {Object.entries(formData.socialLinks).map(([platform, url]) => (
                    <div key={platform} className="flex items-center gap-2">
                      <span className="w-20 text-xs text-neutral-500 capitalize">{platform}</span>
                      <input
                        type="url"
                        placeholder={`https://${platform}.com/...`}
                        value={url}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#00ACF0]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="flex-1 text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 dark:file:bg-neutral-800 file:text-neutral-700 dark:file:text-neutral-300 hover:file:bg-neutral-200"
                  />
                  {previewUrl && (
                    <div className="relative shrink-0">
                      <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border" />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function CommunityMembers() {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yParallax = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "15%"]);

  const [communityMembers, setCommunityMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutType, setLayoutType] = useState("grid");
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentUserMember, setCurrentUserMember] = useState(null);
  const [userData, setUserData] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const membersPerPage = 6;

  // Fetch logged in user profile document
  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        if (!user?.email) return;

        const usersRef = collection(fireDB, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty && isMounted) {
          querySnapshot.forEach((d) => {
            setUserData({ id: d.id, ...d.data() });
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fetch community members
  const fetchCommunityMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, "communityMembers"));
      const membersData = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      const sortedMembers = membersData.sort((a, b) => {
        if (a.status === "accepted" && b.status !== "accepted") return -1;
        if (a.status !== "accepted" && b.status === "accepted") return 1;
        const timeA = a.appliedAt?.toDate ? a.appliedAt.toDate().getTime() : 0;
        const timeB = b.appliedAt?.toDate ? b.appliedAt.toDate().getTime() : 0;
        return timeB - timeA;
      });

      setCommunityMembers(sortedMembers);

      if (user) {
        const currentProfile = membersData.find((m) => m.userId === user.uid);
        setCurrentUserMember(currentProfile || null);
      }
    } catch (error) {
      console.error("Error fetching community members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredMembers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return communityMembers.filter((member) => {
      const matchesSearch =
        (member.name && member.name.toLowerCase().includes(q)) ||
        (member.skills && member.skills.toLowerCase().includes(q)) ||
        (member.communityId && member.communityId.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [communityMembers, searchTerm]);

  // Display accepted members publicly, and show the user their own entry even if pending
  const displayMembers = useMemo(() => {
    return filteredMembers.filter(
      (m) => m.status === "accepted" || m.userId === user?.uid
    );
  }, [filteredMembers, user]);

  const totalPages = Math.ceil(displayMembers.length / membersPerPage);
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = displayMembers.slice(indexOfFirstMember, indexOfLastMember);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleEditClick = (member) => {
    if (member.userId === user?.uid) {
      setSelectedMember(member);
      setProfileModalOpen(true);
    }
  };

  const handleProfileUpdate = (updatedMember) => {
    setCommunityMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? { ...m, ...updatedMember } : m))
    );
    if (currentUserMember && currentUserMember.id === updatedMember.id) {
      setCurrentUserMember(updatedMember);
    }
    setProfileModalOpen(false);
  };

  const handleApplicationSubmit = () => {
    fetchCommunityMembers();
    setApplicationModalOpen(false);
  };

  const communitySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Soft Game Studio Developer Community",
    "url": "https://softgamestudios.web.app/OurCommunity",
    "description": "Join our community of aspiring and professional game creators, designers, and students.",
    "publisher": {
      "@type": "Organization",
      "name": "Soft Game Studio Pvt. Ltd.",
      "url": "https://softgamestudios.web.app"
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Community Members | Soft Game Studio</title>
        <meta
          name="description"
          content="Connect with independent developers, designers, and learners in the Soft Game Studio community. Apply to join our growing network."
        />
        <link rel="canonical" href="https://softgamestudios.web.app/OurCommunity" />

        {/* Open Graph */}
        <meta property="og:title" content="Developer Community | Soft Game Studio" />
        <meta
          property="og:description"
          content="Connect with creators and enthusiasts in the Soft Game Studio community."
        />
        <meta property="og:url" content="https://softgamestudios.web.app/OurCommunity" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SoftGameStudio" />
        <meta name="twitter:title" content="Community Members | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Discover members and contributors in the Soft Game Studio ecosystem."
        />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(communitySchema)}</script>
      </Helmet>

      <div
        ref={containerRef}
        className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300"
      >
        {/* Header Hero */}
        <header className="relative pt-24 pb-14 px-4 bg-gradient-to-b from-neutral-100 via-neutral-50 to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <motion.div
            style={{ y: yParallax }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] dark:text-sky-400 border border-sky-200 dark:border-sky-900/50 mb-6">
              <Users className="w-3.5 h-3.5" />
              Creator Network
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Community Members
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Collaborate with fellow game creators, developers, and educators. Share your skills and projects.
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {user && currentUserMember && (
                <button
                  onClick={() => handleEditClick(currentUserMember)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#00ACF0] hover:bg-[#0092cc] text-white shadow-sm flex items-center gap-2 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  Update Your Profile
                </button>
              )}

              {user && !currentUserMember && (
                <button
                  onClick={() => setApplicationModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#00ACF0] hover:bg-[#0092cc] text-white shadow-sm flex items-center gap-2 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Apply to Join Community
                </button>
              )}

              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#00ACF0] hover:bg-[#0092cc] text-white shadow-sm flex items-center gap-2 transition"
                >
                  <User className="w-4 h-4" />
                  Login to Apply
                </button>
              )}
            </div>
          </motion.div>
        </header>

        {/* Current User Pending Notification Banner */}
        {currentUserMember && currentUserMember.status === "pending" && (
          <aside aria-label="Application Status" className="py-6 px-4 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Application Under Review
                  </h2>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Your community profile has been submitted and is awaiting approval by the SGS moderation team.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEditClick(currentUserMember)}
                className="px-3.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition shrink-0"
              >
                Edit Pending Profile
              </button>
            </div>
          </aside>
        )}

        {/* Main Directory Area */}
        <main className="py-12 px-4 max-w-7xl mx-auto">
          {/* Search & Layout Bar */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Member Directory
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {displayMembers.length} active member{displayMembers.length === 1 ? "" : "s"} listed
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by name, skill, ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] focus:border-transparent transition"
                  />
                </div>

                <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setLayoutType("grid")}
                    aria-label="Grid layout"
                    className={`p-2 rounded-lg transition ${
                      layoutType === "grid"
                        ? "bg-white dark:bg-neutral-700 text-[#00ACF0] shadow-sm"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayoutType("list")}
                    aria-label="List layout"
                    className={`p-2 rounded-lg transition ${
                      layoutType === "list"
                        ? "bg-white dark:bg-neutral-700 text-[#00ACF0] shadow-sm"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Members List or Empty State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-[#00ACF0] border-t-transparent animate-spin" />
            </div>
          ) : displayMembers.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 max-w-lg mx-auto">
              <Users className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                No matching members found
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-5">
                {searchTerm
                  ? "Try searching for a different skill, name, or community ID."
                  : "Be the first creator to join our community network!"}
              </p>
              {user && (
                <button
                  onClick={() => setApplicationModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#00ACF0] text-white hover:bg-[#0092cc] transition"
                >
                  Apply to Join
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                className={
                  layoutType === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {currentMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    layoutType={layoutType}
                    onMemberClick={handleMemberClick}
                    onEditClick={handleEditClick}
                    isCurrentUser={member.userId === user?.uid}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-9 h-9 text-xs font-semibold rounded-lg transition ${
                        currentPage === num
                          ? "bg-[#00ACF0] text-white shadow-sm"
                          : "border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Floating Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="fixed bottom-6 right-6 z-40 p-3 bg-[#00ACF0] text-white rounded-full shadow-lg hover:bg-[#0092cc] active:scale-95 transition"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Modals */}
        <ApplicationModal
          isOpen={applicationModalOpen}
          onClose={() => setApplicationModalOpen(false)}
          onSubmit={handleApplicationSubmit}
          userData={userData}
          user={user}
        />

        <ProfileUpdateModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          memberData={selectedMember}
          onUpdate={handleProfileUpdate}
        />

        <MemberModal
          member={selectedMember}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onEditClick={handleEditClick}
          isCurrentUser={selectedMember?.userId === user?.uid}
        />
      </div>
    </Layout>
  );
}