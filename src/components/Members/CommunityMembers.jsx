import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where,
  deleteDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { fireDB, storage } from "../../DataBase/firebaseConfig";
import Layout from "../layout/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from '../../AuthProvide';
import { useNavigate } from "react-router-dom";
import {
  FiLinkedin,
  FiGithub,
  FiInstagram,
  FiSearch,
  FiArrowUp, 
  FiX,
  FiExternalLink,
  FiUserPlus,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiUser,
  FiSave,
  FiMonitor,
  FiSmartphone
} from "react-icons/fi";

// Function to generate sequential community IDs




const SocialIcon = ({ platform, url }) => {
  const icons = {
    linkedin: <FiLinkedin className="w-5 h-5" />,
    github: <FiGithub className="w-5 h-5" />,
    instagram: <FiInstagram className="w-5 h-5" />,
  };

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={platform}
    >
      {icons[platform]}
    </motion.a>
  );
};

const StatusBadge = ({ status }) => {
  const statusColors = {
    accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const statusIcons = {
    accepted: <FiCheckCircle className="w-4 h-4 mr-1" />,
    pending: <FiClock className="w-4 h-4 mr-1" />,
    rejected: <FiX className="w-4 h-4 mr-1" />,
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusColors[status] || statusColors.pending}`}
    >
      {statusIcons[status]} {status?.toUpperCase()}
    </span>
  );
};

const DeviceBadge = ({ device }) => {
  const deviceIcons = {
    Desktop: <FiMonitor className="w-3 h-3 mr-1" />,
    Mobile: <FiSmartphone className="w-3 h-3 mr-1" />,
    Tablet: <FiTablet className="w-3 h-3 mr-1" />,
  };

  return (
    <span className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
      {deviceIcons[device] || <FiMonitor className="w-3 h-3 mr-1" />}
      {device}
    </span>
  );
};

const MemberCard = ({ member, layoutType, onMemberClick, isCurrentUser = false, onEditClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer ${
        isCurrentUser ? "ring-2 ring-indigo-500 dark:ring-indigo-400" : ""
      }`}
      onClick={() => onMemberClick(member)}
    >
      {isCurrentUser && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(member);
            }}
            className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full flex items-center gap-1 hover:bg-indigo-700"
          >
            <FiEdit className="w-3 h-3" /> Edit
          </button>
          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
            You
          </span>
        </div>
      )}
      
      {layoutType === "grid" ? (
        <div className="flex flex-col items-center text-center h-full">
          <motion.div className="relative mb-6" whileHover={{ scale: 1.03 }}>
            <div className="relative">
              {member.photoUrl ? (
                <img
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  src={member.photoUrl}
                />
              ) : (
                <div className="w-32 h-32 text-4xl rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
              <motion.div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full bg-indigo-500`}
                whileHover={{ width: "100%" }}
              />
            </div>
          </motion.div>

          <div className="flex flex-col gap-2 mb-3 w-full">
            <StatusBadge status={member.status} />
            <div className="flex justify-center gap-2">
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                ID: {member.communityId}
              </span>
              {member.deviceInfo && (
                <DeviceBadge device={member.deviceInfo.device} />
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-1 mt-3">
            {member.role || "Community Member"}
          </h3>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {member.name}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
            {member.bio || `${member.role || "Member"} at Soft Game Studio Community`}
          </p>

          <div className="flex justify-center mb-4 gap-2 flex-wrap">
            {member.skills && member.skills.split(',').map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>

          <div className="flex justify-center mt-4 gap-3">
            {member.socialLinks && Object.entries(member.socialLinks).map(
              ([platform, url]) =>
                url && (
                  <SocialIcon key={platform} platform={platform} url={url} />
                )
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative">
              {member.photoUrl ? (
                <img
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  src={member.photoUrl}
                />
              ) : (
                <div className="w-24 h-24 text-2xl rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
              <motion.div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full bg-indigo-500`}
                whileHover={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {member.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={member.status} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {member.communityId}
                  </span>
                  {member.deviceInfo && (
                    <DeviceBadge device={member.deviceInfo.device} />
                  )}
                </div>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                {member.role || "Community Member"}
              </p>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {member.bio || `${member.role || "Member"} at Soft Game Studio Community`}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {member.skills && member.skills.split(',').map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
                  {skill.trim()}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                {member.socialLinks && Object.entries(member.socialLinks).map(
                  ([platform, url]) =>
                    url && (
                      <SocialIcon
                        key={platform}
                        platform={platform}
                        url={url}
                      />
                    )
                )}
              </div>
              <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1">
                View Details <FiExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const MemberModal = ({ member, isOpen, onClose, onEditClick, isCurrentUser = false }) => {
  if (!isOpen || !member) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                {member.photoUrl ? (
                  <img
                    alt={member.name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    src={member.photoUrl}
                  />
                ) : (
                  <div className="w-20 h-20 text-2xl rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {member.name}
                  </h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {member.role || "Community Member"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={member.status} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {member.communityId}
                    </span>
                  </div>
                  {member.deviceInfo && (
                    <div className="flex items-center gap-2 mt-1">
                      <DeviceBadge device={member.deviceInfo.device} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {member.deviceInfo.browser}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {isCurrentUser && (
                  <button
                    onClick={() => onEditClick(member)}
                    className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">About</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.bio || `${member.role || "Member"} at Soft Game Studio Community`}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills && member.skills.split(',').map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Social Links</h3>
              <div className="flex gap-3">
                {member.socialLinks && Object.entries(member.socialLinks).map(
                  ([platform, url]) =>
                    url && (
                      <SocialIcon key={platform} platform={platform} url={url} />
                    )
                )}
              </div>
              
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProfileUpdateModal = ({ isOpen, onClose, memberData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    bio: '',
    contactInfo: '',
    socialLinks: {
      linkedin: '',
      github: '',
      instagram: ''
    }
  });
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (memberData && isOpen) {
      setFormData({
        name: memberData.name || '',
        skills: memberData.skills || '',
        bio: memberData.bio || '',
        contactInfo: memberData.contactInfo || '',
        socialLinks: {
          linkedin: memberData.socialLinks?.linkedin || '',
          github: memberData.socialLinks?.github || '',
          instagram: memberData.socialLinks?.instagram || ''
        }
      });
      
      if (memberData.photoUrl) {
        setPreviewUrl(memberData.photoUrl);
      }
    }
  }, [memberData, isOpen]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialLinkChange = (platform, url) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: url
      }
    });
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
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

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
          } catch (error) {
            console.log('Error deleting old photo:', error);
          }
        }
      }

      const memberRef = doc(fireDB, 'communityMembers', memberData.id);
      await updateDoc(memberRef, {
        ...formData,
        photoUrl,
        updatedAt: serverTimestamp()
      });

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      if (onUpdate) {
        onUpdate({ ...formData, photoUrl, id: memberData.id });
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Error updating profile. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Update Your Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {message.text && (
              <div className={`p-3 rounded-lg mb-4 ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills (comma separated) *
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., React, JavaScript, UI/UX Design"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  About Yourself *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Info *
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="phone number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Social Links (Optional)
                </label>
                <div className="space-y-2">
                  {Object.entries(formData.socialLinks).map(([platform, url]) => (
                    <div key={platform} className="flex items-center gap-2">
                      <SocialIcon platform={platform} url="#" />
                      <input
                        type="url"
                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                        value={url}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {previewUrl && (
                    <div className="relative">
                      <img loading="lazy" src={previewUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-gray-300" />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Updating...' : (
                    <>
                      <FiSave /> Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};








const generateCommunityId = async () => {
  try {
    const querySnapshot = await getDocs(collection(fireDB, "communityMembers"));
    const members = querySnapshot.docs.map(doc => doc.data());
    
    // Find the highest existing community ID
    const communityIds = members
      .map(member => member.communityId)
      .filter(id => id && id.startsWith('SGSCOM'))
      .map(id => {
        const num = id.replace('SGSCOM', '');
        return parseInt(num) || 0;
      });
    
    const highestId = communityIds.length > 0 ? Math.max(...communityIds) : 0;
    const nextId = highestId + 1;
    
    // Format with leading zeros
    return `SGSCOM${nextId.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error("Error generating community ID:", error);
    // Fallback to timestamp-based ID
    return `SGSCOM${Date.now().toString().slice(-6)}`;
  }
};

function CommunityMembers() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
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
  const [userLoading, setUserLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const membersPerPage = 6;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.email) {
          setUserLoading(false);
          return;
        }

        const usersRef = collection(fireDB, 'users');
        const q = query(usersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            const data = doc.data();
            setUserData({ id: doc.id, ...data });
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const fetchCommunityMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, "communityMembers"));
      const membersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const sortedMembers = membersData.sort((a, b) => {
        if (a.status === 'accepted' && b.status !== 'accepted') return -1;
        if (a.status !== 'accepted' && b.status === 'accepted') return 1;
        return (b.appliedAt?.toDate() || 0) - (a.appliedAt?.toDate() || 0);
      });
      
      setCommunityMembers(sortedMembers);
      
      // Find current user's member profile by matching Firebase UID
      if (user) {
        const currentUserMemberProfile = membersData.find(member => 
          member.userId === user.uid
        );
        setCurrentUserMember(currentUserMemberProfile);
      }
    } catch (error) {
      console.error("Error fetching community members:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommunityMembers();
  }, [user]); // Add user as dependency

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredMembers = communityMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.skills && member.skills.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.communityId && member.communityId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const displayMembers = filteredMembers.filter(member => 
    member.status === 'accepted' || member.userId === user?.uid
  );

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = displayMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(displayMembers.length / membersPerPage);

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
    setCommunityMembers(prev => prev.map(member => 
      member.id === updatedMember.id ? { ...member, ...updatedMember } : member
    ));
    // Also update currentUserMember if it's the same member
    if (currentUserMember && currentUserMember.id === updatedMember.id) {
      setCurrentUserMember(updatedMember);
    }
    setProfileModalOpen(false);
  };

  const handleApplicationSubmit = () => {
    fetchCommunityMembers();
    setApplicationModalOpen(false);
  };

  // Update ApplicationModal to include userId
  const ApplicationModal = ({ isOpen, onClose, onSubmit, userData }) => {
    const [formData, setFormData] = useState({
      name: '',
      skills: '',
      bio: '',
      contactInfo: '',
      socialLinks: {
        linkedin: '',
        github: '',
        instagram: ''
      }
    });
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
      if (userData && isOpen) {
        setFormData({
          name: userData.name || '',
          skills: userData.skills || '',
          bio: userData.bio || '',
          contactInfo: userData.phone || userData.contactInfo || '',
          socialLinks: {
            linkedin: userData.socialLinks?.linkedin || '',
            github: userData.socialLinks?.github || '',
            instagram: userData.socialLinks?.instagram || ''
          }
        });
        
        if (userData.photoUrl) {
          setPreviewUrl(userData.photoUrl);
        }
      }
    }, [userData, isOpen]);

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialLinkChange = (platform, url) => {
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [platform]: url
        }
      });
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
      setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage({ text: '', type: '' });

      try {
        let photoUrl = '';

        if (photo) {
          const storageRef = ref(storage, `community-members/${Date.now()}_${photo.name}`);
          const snapshot = await uploadBytes(storageRef, photo);
          photoUrl = await getDownloadURL(snapshot.ref);
        }

        // Generate sequential community ID
        const communityId = await generateCommunityId();
        
        await addDoc(collection(fireDB, 'communityMembers'), {
          ...formData,
          photoUrl,
          communityId,
          status: 'pending',
          appliedAt: serverTimestamp(),
          userId: user?.uid, // Store Firebase UID instead of user document ID
          userEmail: user?.email // Also store email for reference
        });

        setMessage({ text: 'Application submitted successfully!', type: 'success' });
        
        setTimeout(() => {
          onSubmit();
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Error submitting application:', error);
        setMessage({ text: 'Error submitting application. Please try again.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          {/* ... (keep the rest of your ApplicationModal JSX the same) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Join Our Community
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {userData && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    <strong>Auto-fill enabled:</strong> Your profile information has been pre-filled.
                  </p>
                </div>
              )}

              {message.text && (
                <div className={`p-3 rounded-lg mb-4 ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (keep the rest of your form fields the same) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skills (comma separated) *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., React, JavaScript, UI/UX Design"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    About Yourself *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Info *
                  </label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    placeholder="phone number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Social Links (Optional)
                  </label>
                  <div className="space-y-2">
                    {Object.entries(formData.socialLinks).map(([platform, url]) => (
                      <div key={platform} className="flex items-center gap-2">
                        <SocialIcon platform={platform} url="#" />
                        <input
                          type="url"
                          placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                          value={url}
                          onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    {previewUrl && (
                      <div className="relative">
                        <img loading="lazy" src={previewUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-gray-300" />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting...' : (
                      <>
                        <FiUserPlus /> Apply Now
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Layout>
      <Helmet>
        <title>Community Members - Soft Game Studio | Join Our Growing Community</title>
        <meta
          name="description"
          content="Join the Soft Game Studio community of game developers, designers, and enthusiasts. Apply to become a member and connect with like-minded individuals."
        />
      </Helmet>

      <div
        ref={containerRef}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            y,
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <section className="py-20 px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white tracking-tight"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                COMMUNITY
              </motion.h1>
              <motion.div className="w-24 h-1 bg-indigo-600 mx-auto mb-6 rounded-full" />
              <motion.h2
                className="text-2xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                JOIN OUR{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  GROWING FAMILY
                </span>
              </motion.h2>
              <motion.p
                className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Connect with passionate game developers, designers, and enthusiasts. 
                Share knowledge, collaborate on projects, and grow together.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                {user && currentUserMember && (
                  <motion.button
                    onClick={() => handleEditClick(currentUserMember)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FiEdit className="w-5 h-5" />
                    Update Profile
                  </motion.button>
                )}
                
                {user && !currentUserMember && (
                  <motion.button
                    onClick={() => setApplicationModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <FiUserPlus className="w-5 h-5" />
                    Apply to Join Community
                  </motion.button>
                )}

                {!user && (
                  <motion.button
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <FiUser className="w-5 h-5" />
                    Login to Apply
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {currentUserMember && currentUserMember.status === 'pending' && (
          <section className="py-8 px-4 relative z-10 bg-yellow-50 dark:bg-yellow-900/20">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Your Application Status
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your application is currently under review
                </p>
              </motion.div>
              
              <div className="max-w-2xl mx-auto">
                <MemberCard
                  member={currentUserMember}
                  layoutType="list"
                  onMemberClick={handleMemberClick}
                  onEditClick={handleEditClick}
                  isCurrentUser={true}
                />
              </div>
            </div>
          </section>
        )}

        <section className="py-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Community Members ({displayMembers.length})
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Connect with our amazing community members
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => setLayoutType("grid")}
                        className={`p-2 rounded-md ${
                          layoutType === "grid"
                            ? "bg-white dark:bg-gray-600 shadow-sm"
                            : "hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setLayoutType("list")}
                        className={`p-2 rounded-md ${
                          layoutType === "list"
                            ? "bg-white dark:bg-gray-600 shadow-sm"
                            : "hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              </div>
            ) : displayMembers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <FiUserPlus className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mt-4 mb-6">
                  {searchTerm
                    ? "No matching community members found."
                    : "No community members yet. Be the first to join!"}
                </p>
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setApplicationModalOpen(true)}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    Apply to Join
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <>
                <div className={layoutType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                  {currentMembers.map((member, index) => (
                    <MemberCard
                      key={member.id || index}
                      member={member}
                      layoutType={layoutType}
                      onMemberClick={handleMemberClick}
                      onEditClick={handleEditClick}
                      isCurrentUser={member.userId === user?.uid}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === i + 1
                              ? "bg-indigo-600 text-white"
                              : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <ApplicationModal
          isOpen={applicationModalOpen}
          onClose={() => setApplicationModalOpen(false)}
          onSubmit={handleApplicationSubmit}
          userData={userData}
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

        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700"
          >
            <FiArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </Layout>
  );
}

export default CommunityMembers;