import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../layout/Layout";
import { Helmet } from "react-helmet";
import {
  FiLinkedin,
  FiGithub,
  FiInstagram,
  FiSearch,
  FiArrowUp,
  FiMail,
  FiBriefcase,
  FiBook,
  FiX,
  FiFilter,
  FiChevronDown,
  FiExternalLink,
} from "react-icons/fi";
import { FaUnity } from "react-icons/fa";
import { SiUnrealengine } from "react-icons/si";

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

const DepartmentBadge = ({ department }) => {
  const departmentColors = {
    Development:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Developement:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Design:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Marketing:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Management:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    HR: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    Default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  const colorClass = departmentColors[department] || departmentColors.Default;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {department}
    </span>
  );
};

const MemberCard = ({ member, layoutType, onMemberClick }) => {
  if (layoutType === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-full transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
        onClick={() => onMemberClick(member)}
      >
        <div className="flex flex-col items-center text-center">
          <motion.div className="relative mb-6" whileHover={{ scale: 1.03 }}>
            <div className="relative">
              {member.photoUrl ? (
                              <img
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  src={member.image || member.photoUrl}
                />
                            ) : (
                              <div className="w-32 h-32 text-4xl rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
              <motion.div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full ${
                  member.accentColor || "bg-indigo-500"
                }`}
                whileHover={{ width: "100%" }}
              />
            </div>
          </motion.div>

          <DepartmentBadge department={member.department} />

          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-1 mt-3">
            {member.role}
          </h3>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {member.name}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
            {member.bio || `${member.role} at Soft Game Studio`}
          </p>

          <div className="flex justify-center mb-4 gap-2 flex-wrap">
            {member.skills}
          </div>

          <div className="flex justify-center mt-4 gap-3">
            {member.social &&
              Object.entries(member.social).map(
                ([platform, url]) =>
                  url && (
                    <SocialIcon key={platform} platform={platform} url={url} />
                  )
              )}
          </div>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
        onClick={() => onMemberClick(member)}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative">
             {member.photoUrl ? (
                              <img
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  src={member.image || member.photoUrl}
                />
                            ) : (
                              <div className="w-32 h-32 text-4xl rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
              <motion.div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full ${
                  member.accentColor || "bg-indigo-500"
                }`}
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
                  <DepartmentBadge department={member.department} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {member.employeeId}
                  </span>
                </div>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                {member.role}
              </p>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {member.bio || `${member.role} at Soft Game Studio`}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">{member.skills}</div>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                {member.social &&
                  Object.entries(member.social).map(
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
      </motion.div>
    );
  }
};

const MemberModal = ({ member, isOpen, onClose }) => {
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl"></div>

            <div className="px-8 pb-8 -mt-16">
              <div className="flex flex-col items-center text-center mb-6">
                 {member.photoUrl ? (
                              <img
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  src={member.image || member.photoUrl}
                />
                            ) : (
                              <div className="w-32 h-32 text-4xl rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
                

                <div className="mt-6">
                  <DepartmentBadge department={member.department} />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">
                    {member.name}
                  </h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium text-lg">
                    {member.role}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {member.employeeId} • Joined{" "}
                    {member.joinDate
                      ? new Date(member.joinDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiBook className="text-indigo-500" /> About
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {member.bio || `${member.role} at Soft Game Studio`}
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiBriefcase className="text-indigo-500" /> Experience &
                    Education
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        {member.experience || "Not specified"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {member.education || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiBriefcase className="text-indigo-500" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {member.skills}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiMail className="text-indigo-500" /> Contact
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-300">
                      {"team.softgamestudio@gmail.com"}
                    </p>
                    <div className="flex gap-3">
                      {member.social &&
                        Object.entries(member.social).map(
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
                  </div>

                  {member.projects && member.projects.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 mt-6 flex items-center gap-2">
                        <FiBriefcase className="text-indigo-500" /> Projects
                      </h3>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                        {member.projects.map((project, index) => (
                          <li key={index}>{project}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function OurMembers() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutType, setLayoutType] = useState("grid");
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const membersPerPage = 6;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "teamMembers"));
        const teamMembersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Map Firestore fields to your component's expected structure
          image: doc.data().photoUrl || "",
          bio: doc.data().bio || `${doc.data().role} at Soft Game Studio`,
          accentColor: doc.data().accentColor || "bg-indigo-500",
          social: doc.data().social || {},
          joinDate:
            doc.data().joinDate ||
            doc.data().createdAt?.toDate().toISOString() ||
            new Date().toISOString(),
        }));
        setTeamMembers(teamMembersData);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
      setLoading(false);
    };
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use team members from Firebase
  const allMembers = [...teamMembers];

  // Filter members based on search term and filters
  const filteredMembers = allMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.role &&
        member.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.department &&
        member.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment =
      filters.department === "all" || member.department === filters.department;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments and skills for filters
  const departments = [
    ...new Set(allMembers.map((member) => member.department).filter(Boolean)),
  ];

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ department: "all" });
    setSearchTerm("");
  };

  return (
    <Layout>
      <Helmet>
        <title>Our Team - Soft Game Studio | Game Dev & EdTech Experts</title>
        <meta
          name="description"
          content="Meet the talented team members of Soft Game Studio. From game developers to education technologists, discover the people behind our innovative projects."
        />
        <link
          rel="canonical"
          href="https://softgamestudios.web.app/OurMembers"
        />
        <meta property="og:title" content="Meet Our Team - Soft Game Studio" />
        <meta
          property="og:description"
          content="Explore the profiles of our passionate developers, designers, and educators at Soft Game Studio. We create games and tools that inspire learning and fun."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FTeam-Members-Soft-Game-Studio-Game-Developers.png?alt=media&token=your-token-here"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Team | Meet the SGS Team" />
        <meta
          name="twitter:description"
          content="Get to know the game developers, designers, and educators behind Soft Game Studio."
        />
      </Helmet>

      <div
        ref={containerRef}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            y,
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating Tech Elements */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute opacity-10 dark:opacity-5"
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() > 0.5 ? 30 : -30, 0],
              rotate: [0, Math.random() > 0.5 ? 15 : -15, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
            style={{
              top: `${10 + i * 20}%`,
              left: `${10 + i * 15}%`,
              fontSize: `${2 + i * 1}rem`,
            }}
          >
            {i % 2 === 0 ? <FaUnity /> : <SiUnrealengine />}
          </motion.div>
        ))}

        {/* Header Section */}
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
                SOFT GAME STUDIO
              </motion.h1>
              <motion.div className="w-24 h-1 bg-indigo-600 mx-auto mb-6 rounded-full" />
              <motion.h2
                className="text-2xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                MEET OUR{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  TEAM
                </span>
              </motion.h2>
              <motion.p
                className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Get to know the passionate individuals behind our innovative
                projects and games
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Controls */}
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
                    Our Team Members
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {filteredMembers.length} member
                    {filteredMembers.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search team members..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <FiFilter className="w-4 h-4" /> Filters
                      <FiChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showFilters ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => setLayoutType("grid")}
                        className={`p-2 rounded-md ${
                          layoutType === "grid"
                            ? "bg-white dark:bg-gray-600 shadow-sm"
                            : "hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
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
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Department
                      </label>
                      <select
                        value={filters.department}
                        onChange={(e) =>
                          handleFilterChange("department", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Members Grid/List */}
            {loading ? (
              <motion.div
                className="flex justify-center py-12"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
              </motion.div>
            ) : filteredMembers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                <p className="text-gray-500 dark:text-gray-400 mt-4 mb-6">
                  {searchTerm ||
                  filters.department !== "all" ||
                  filters.skills !== "all"
                    ? "No matching team members found."
                    : "No team members found. Check back later!"}
                </p>
                {(searchTerm ||
                  filters.department !== "all" ||
                  filters.skills !== "all") && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    Clear Search & Filters
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <>
                <div
                  className={
                    layoutType === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {currentMembers.map((member, index) => (
                    <MemberCard
                      key={member.id || index}
                      member={member}
                      layoutType={layoutType}
                      onMemberClick={handleMemberClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mt-12"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-4 py-2 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-indigo-600 text-white"
                                  : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="w-5 h-5" />
          </motion.button>
        )}

        {/* Member Detail Modal */}
        <MemberModal
          member={selectedMember}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </Layout>
  );
}

export default OurMembers;
